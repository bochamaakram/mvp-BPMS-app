/**
 * Instance List Component
 * Displays a table of process instances with actions
 */
function InstanceList({ instances, onUpdateStatus, onGetSummary }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Process</th>
                        <th>Current Step</th>
                        <th>Status</th>
                        <th>Started</th>
                        <th>Started By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instances.map((instance) => (
                        <tr key={instance.id}>
                            <td>#{instance.id}</td>
                            <td><strong>{instance.process_name}</strong></td>
                            <td>{instance.current_step_name || 'N/A'}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(instance.status)}`}>
                                    {instance.status}
                                </span>
                            </td>
                            <td>{formatDate(instance.started_at)}</td>
                            <td>{instance.started_by_email}</td>
                            <td>
                                <div className="flex gap-2">
                                    {instance.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => onUpdateStatus(instance.id, 'approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => onUpdateStatus(instance.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => onGetSummary(instance.id)}
                                    >
                                        AI Summary
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InstanceList;
