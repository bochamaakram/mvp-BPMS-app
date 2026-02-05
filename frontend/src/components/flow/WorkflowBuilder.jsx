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
import StartNode from './StartNode';
import EndNode from './EndNode';
import EditableStepNode from './EditableStepNode';
import { Plus, Trash2, ArrowDown, ArrowRight } from 'lucide-react';

/**
 * WorkflowBuilder Component
 * Visual workflow editor for creating/editing processes with React Flow
 * Supports horizontal and vertical layout orientations
 */
function WorkflowBuilder({
    initialSteps = [],
    onStepsChange,
    onSave,
    processName = 'New Workflow'
}) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [direction, setDirection] = useState('vertical'); // 'vertical' or 'horizontal'

    // Custom node types
    const nodeTypes = useMemo(() => ({
        stepNode: EditableStepNode,
        startNode: StartNode,
        endNode: EndNode,
    }), []);

    // Build nodes from steps based on direction
    const buildNodes = useCallback((steps, dir) => {
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
                draggable: false,
            },
        ];

        steps.forEach((step, index) => {
            nodes.push({
                id: `step-${index}`,
                type: 'stepNode',
                position: isHorizontal
                    ? { x: startOffset + (index + 1) * nodeSpacing, y: 80 }
                    : { x: 250, y: startOffset + index * 140 },
                data: {
                    label: step.name || `Step ${index + 1}`,
                    description: step.description || '',
                    stepOrder: index + 1,
                    direction: dir,
                },
            });
        });

        nodes.push({
            id: 'end',
            type: 'endNode',
            position: isHorizontal
                ? { x: startOffset + (steps.length + 1) * nodeSpacing, y: 100 }
                : { x: 250, y: startOffset + steps.length * 140 },
            data: { label: 'End', direction: dir },
            draggable: false,
        });

        return nodes;
    }, []);

    // Build edges from nodes based on direction
    const buildEdges = useCallback((steps, dir) => {
        const edges = [];
        const nodeIds = ['start', ...steps.map((_, i) => `step-${i}`), 'end'];

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

    const [steps, setSteps] = useState(initialSteps.length > 0 ? initialSteps : [{ name: '', description: '' }]);
    const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(steps, direction));
    const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(steps, direction));

    // Update flow when direction changes
    useEffect(() => {
        setNodes(buildNodes(steps, direction));
        setEdges(buildEdges(steps, direction));
    }, [direction, steps, buildNodes, buildEdges, setNodes, setEdges]);

    // Sync nodes and edges when steps change
    const updateFlow = useCallback((newSteps) => {
        setSteps(newSteps);
        setNodes(buildNodes(newSteps, direction));
        setEdges(buildEdges(newSteps, direction));
        if (onStepsChange) {
            onStepsChange(newSteps);
        }
    }, [buildNodes, buildEdges, direction, onStepsChange, setNodes, setEdges]);

    // Toggle layout direction
    const toggleDirection = useCallback(() => {
        setDirection(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
    }, []);

    // Add new step
    const handleAddStep = useCallback(() => {
        const newSteps = [...steps, { name: '', description: '' }];
        updateFlow(newSteps);
    }, [steps, updateFlow]);

    // Delete step
    const handleDeleteNode = useCallback((nodeId) => {
        const index = parseInt(nodeId.replace('step-', ''));
        if (steps.length > 1) {
            const newSteps = steps.filter((_, i) => i !== index);
            updateFlow(newSteps);
        }
    }, [steps, updateFlow]);

    // Handle node selection
    const onNodeClick = useCallback((event, node) => {
        if (node.id.startsWith('step-')) {
            setSelectedNode(node);
        }
    }, []);

    return (
        <div className="workflow-builder">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                nodesDraggable={true}
                nodesConnectable={false}
                deleteKeyCode={null}
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

                {/* Toolbar Panel */}
                <Panel position="top-center" className="flow-toolbar">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddStep}
                    >
                        <Plus size={16} />
                        Add Step
                    </button>
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

            {/* Step Editor Panel */}
            {selectedNode && (
                <div className="step-editor-panel">
                    <h3>Edit Step {selectedNode.data.stepOrder}</h3>
                    <div className="form-group">
                        <label>Step Name</label>
                        <input
                            type="text"
                            value={steps[selectedNode.data.stepOrder - 1]?.name || ''}
                            onChange={(e) => {
                                const index = selectedNode.data.stepOrder - 1;
                                const newSteps = [...steps];
                                newSteps[index] = { ...newSteps[index], name: e.target.value };
                                updateFlow(newSteps);
                            }}
                            placeholder="Enter step name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={steps[selectedNode.data.stepOrder - 1]?.description || ''}
                            onChange={(e) => {
                                const index = selectedNode.data.stepOrder - 1;
                                const newSteps = [...steps];
                                newSteps[index] = { ...newSteps[index], description: e.target.value };
                                updateFlow(newSteps);
                            }}
                            placeholder="Optional description"
                            rows={2}
                        />
                    </div>
                    <div className="flex gap-2">
                        {steps.length > 1 && (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                    handleDeleteNode(selectedNode.id);
                                    setSelectedNode(null);
                                }}
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        )}
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedNode(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkflowBuilder;
