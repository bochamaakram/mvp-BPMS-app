import { useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import StepNode from './StepNode';
import StartNode from './StartNode';
import EndNode from './EndNode';

/**
 * WorkflowEditor Component
 * Visual workflow editor using React Flow
 */
function WorkflowEditor({ steps = [], onStepsChange, readOnly = false }) {
    // Custom node types
    const nodeTypes = useMemo(() => ({
        stepNode: StepNode,
        startNode: StartNode,
        endNode: EndNode,
    }), []);

    // Convert steps to nodes
    const initialNodes = useMemo(() => {
        const nodes = [
            {
                id: 'start',
                type: 'startNode',
                position: { x: 250, y: 0 },
                data: { label: 'Start' },
            },
        ];

        steps.forEach((step, index) => {
            nodes.push({
                id: `step-${step.id || index}`,
                type: 'stepNode',
                position: { x: 250, y: 100 + index * 120 },
                data: {
                    label: step.name,
                    description: step.description,
                    stepOrder: step.step_order || index + 1,
                    conditionalRule: step.conditional_rule,
                },
            });
        });

        nodes.push({
            id: 'end',
            type: 'endNode',
            position: { x: 250, y: 100 + steps.length * 120 },
            data: { label: 'End' },
        });

        return nodes;
    }, [steps]);

    // Create edges between nodes
    const initialEdges = useMemo(() => {
        const edges = [];
        const nodeIds = ['start', ...steps.map((s, i) => `step-${s.id || i}`), 'end'];

        for (let i = 0; i < nodeIds.length - 1; i++) {
            edges.push({
                id: `edge-${i}`,
                source: nodeIds[i],
                target: nodeIds[i + 1],
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#1a3a2f',
                },
                style: {
                    stroke: '#1a3a2f',
                    strokeWidth: 2,
                },
            });
        }

        return edges;
    }, [steps]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#1a3a2f',
            },
            style: {
                stroke: '#1a3a2f',
                strokeWidth: 2,
            },
        }, eds)),
        [setEdges]
    );

    return (
        <div className="workflow-editor">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={readOnly ? undefined : onNodesChange}
                onEdgesChange={readOnly ? undefined : onEdgesChange}
                onConnect={readOnly ? undefined : onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                nodesDraggable={!readOnly}
                nodesConnectable={!readOnly}
                elementsSelectable={!readOnly}
            >
                <Background color="#e5ebe8" gap={20} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'startNode': return '#a3e635';
                            case 'endNode': return '#1a3a2f';
                            default: return '#ffffff';
                        }
                    }}
                    maskColor="rgba(26, 58, 47, 0.1)"
                />
            </ReactFlow>
        </div>
    );
}

export default WorkflowEditor;
