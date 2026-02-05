import { Handle, Position } from 'reactflow';
import { Square } from 'lucide-react';

/**
 * End Node Component
 * Represents the end of a workflow
 * Supports both horizontal and vertical layouts
 */
function EndNode({ data }) {
    const isHorizontal = data.direction === 'horizontal';

    return (
        <div className="flow-node end-node">
            <Handle
                type="target"
                position={isHorizontal ? Position.Left : Position.Top}
                className="node-handle"
            />
            <div className="node-icon">
                <Square size={18} />
            </div>
            <span className="node-label">{data.label}</span>
        </div>
    );
}

export default EndNode;
