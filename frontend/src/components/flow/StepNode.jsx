import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

/**
 * Step Node Component
 * Represents a workflow step with optional conditional logic
 * Supports both horizontal and vertical layouts
 */
function StepNode({ data, selected }) {
    const hasCondition = data.conditionalRule;
    const isHorizontal = data.direction === 'horizontal';

    return (
        <div className={`flow-node step-node ${selected ? 'selected' : ''} ${hasCondition ? 'has-condition' : ''}`}>
            <Handle
                type="target"
                position={isHorizontal ? Position.Left : Position.Top}
                className="node-handle"
            />

            <div className="node-header">
                <div className="node-number">{data.stepOrder}</div>
                <span className="node-title">{data.label}</span>
                {hasCondition && (
                    <div className="condition-badge" title="Has conditional logic">
                        <GitBranch size={14} />
                    </div>
                )}
            </div>

            {data.description && (
                <p className="node-description">{data.description}</p>
            )}

            <Handle
                type="source"
                position={isHorizontal ? Position.Right : Position.Bottom}
                className="node-handle"
            />
        </div>
    );
}

export default StepNode;
