import { Handle, Position } from 'reactflow';
import { Circle, GitBranch } from 'lucide-react';

/**
 * Step Node Component
 * Represents a workflow step with optional conditional logic
 */
function StepNode({ data, selected }) {
    const hasCondition = data.conditionalRule;

    return (
        <div className={`flow-node step-node ${selected ? 'selected' : ''} ${hasCondition ? 'has-condition' : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
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
                position={Position.Bottom}
                className="node-handle"
            />
        </div>
    );
}

export default StepNode;
