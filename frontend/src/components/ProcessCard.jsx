import { Link } from 'react-router-dom';

/**
 * Process Card Component
 * Displays a process with actions
 */
function ProcessCard({ process, onStart, onDelete }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div style={{
            border: '2px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '16px',
            background: 'var(--bg-secondary)',
        }}>
            <div className="flex justify-between items-center mb-1">
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--primary-green)' }}>{process.name}</h3>
                <span style={{
                    fontSize: '12px',
                    color: 'var(--text-on-lime)',
                    background: 'var(--accent-lime)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                }}>
                    {process.step_count || 0} steps
                </span>
            </div>

            {process.description && (
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    marginBottom: '16px',
                }}>
                    {process.description}
                </p>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-light)',
            }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Created {formatDate(process.created_at)} • {process.instance_count || 0} instances
                </span>

                <div className="flex gap-2">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={onStart}
                    >
                        ▶ Start
                    </button>
                    <Link
                        to={`/process/${process.id}`}
                        className="btn btn-secondary btn-sm"
                    >
                        Edit
                    </Link>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProcessCard;
