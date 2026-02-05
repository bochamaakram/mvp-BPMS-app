import { Handle, Position } from 'reactflow';
import { GripVertical } from 'lucide-react';

/**
 * Editable Step Node Component
 * Step node with inline editing capability for workflow builder
 * Supports both horizontal and vertical layouts
 */
function EditableStepNode({ data, selected }) {
    const isHorizontal = data.direction === 'horizontal';

    return (
        <div className={`flow-node step-node editable ${selected ? 'selected' : ''}`}>
            <Handle
                type="target"
                position={isHorizontal ? Position.Left : Position.Top}
                className="node-handle"
            />

            <div className="node-header">
                <div className="node-drag-handle">
                    <GripVertical size={16} />
                </div>
                <div className="node-number">{data.stepOrder}</div>
                <span className="node-title">
                    {data.label || 'Untitled Step'}
                </span>
            </div>

            {data.description && (
                <p className="node-description">{data.description}</p>
            )}

            <div className="node-hint">
                Click to edit
            </div>

            <Handle
                type="source"
                position={isHorizontal ? Position.Right : Position.Bottom}
                className="node-handle"
            />
        </div>
    );
}

export default EditableStepNode;
