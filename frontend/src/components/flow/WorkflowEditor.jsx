import { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import StepNode from './StepNode';
import StartNode from './StartNode';
import EndNode from './EndNode';
import { ArrowDown, ArrowRight } from 'lucide-react';

/**
 * WorkflowEditor Component
 * Visual workflow viewer using React Flow
 * Supports horizontal and vertical layout toggle
 */
function WorkflowEditor({ steps = [], readOnly = false }) {
    const [direction, setDirection] = useState('vertical');

    // Custom node types
    const nodeTypes = useMemo(() => ({
        stepNode: StepNode,
        startNode: StartNode,
        endNode: EndNode,
    }), []);

    // Build nodes based on direction
    const buildNodes = useCallback((stepsData, dir) => {
        const isHorizontal = dir === 'horizontal';
        const nodeSpacing = 180;
        const startOffset = 100;

        const nodes = [
            {
                id: 'start',
                type: 'startNode',
                position: isHorizontal
                    ? { x: 0, y: 100 }
                    : { x: 250, y: 0 },
                data: { label: 'Start', direction: dir },
            },
        ];

        stepsData.forEach((step, index) => {
            nodes.push({
                id: `step-${step.id || index}`,
                type: 'stepNode',
                position: isHorizontal
                    ? { x: startOffset + (index + 1) * nodeSpacing, y: 80 }
                    : { x: 250, y: startOffset + index * 120 },
                data: {
                    label: step.name,
                    description: step.description,
                    stepOrder: step.step_order || index + 1,
                    conditionalRule: step.conditional_rule,
                    direction: dir,
                },
            });
        });

        nodes.push({
            id: 'end',
            type: 'endNode',
            position: isHorizontal
                ? { x: startOffset + (stepsData.length + 1) * nodeSpacing, y: 100 }
                : { x: 250, y: startOffset + stepsData.length * 120 },
            data: { label: 'End', direction: dir },
        });

        return nodes;
    }, []);

    // Build edges
    const buildEdges = useCallback((stepsData) => {
        const edges = [];
        const nodeIds = ['start', ...stepsData.map((s, i) => `step-${s.id || i}`), 'end'];

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
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(steps, direction));
    const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(steps));

    // Update when direction or steps change
    useEffect(() => {
        setNodes(buildNodes(steps, direction));
        setEdges(buildEdges(steps));
    }, [direction, steps, buildNodes, buildEdges, setNodes, setEdges]);

    // Toggle layout direction
    const toggleDirection = useCallback(() => {
        setDirection(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
    }, []);

    return (
        <div className="workflow-editor">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={readOnly ? undefined : onNodesChange}
                onEdgesChange={readOnly ? undefined : onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                nodesDraggable={!readOnly}
                nodesConnectable={false}
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

                {/* Layout Toggle */}
                <Panel position="top-center" className="flow-toolbar">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={toggleDirection}
                        title={`Switch to ${direction === 'vertical' ? 'horizontal' : 'vertical'} layout`}
                    >
                        {direction === 'vertical' ? (
                            <>
                                <ArrowRight size={16} />
                                Horizontal
                            </>
                        ) : (
                            <>
                                <ArrowDown size={16} />
                                Vertical
                            </>
                        )}
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export default WorkflowEditor;
