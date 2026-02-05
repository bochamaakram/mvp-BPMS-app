import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

/**
 * Start Node Component
 * Represents the beginning of a workflow
 * Supports both horizontal and vertical layouts
 */
function StartNode({ data }) {
    const isHorizontal = data.direction === 'horizontal';

    return (
        <div className="flow-node start-node">
            <div className="node-icon">
                <Play size={20} />
            </div>
            <span className="node-label">{data.label}</span>
            <Handle
                type="source"
                position={isHorizontal ? Position.Right : Position.Bottom}
                className="node-handle"
            />
        </div>
    );
}

export default StartNode;
