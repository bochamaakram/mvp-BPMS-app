import { useAuth } from '../context/AuthContext';
import { Users, Zap, CheckCircle, Clock, Trash2 } from 'lucide-react';

/**
 * Organization Page
 * Organization settings and details
 */
function Organization() {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Members', value: '12', icon: Users },
        { label: 'Active Processes', value: '8', icon: Zap },
        { label: 'Completed This Month', value: '47', icon: CheckCircle },
        { label: 'Avg. Completion Time', value: '2.3 days', icon: Clock },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Organization</h1>
                    <p className="page-subtitle">Manage your organization settings</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <span className="stat-icon">
                            <stat.icon size={24} />
                        </span>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Organization Details Card */}
            <div className="card mt-3">
                <h2 className="card-title">Organization Details</h2>
                <div className="org-details-grid">
                    <div className="form-group">
                        <label>Organization Name</label>
                        <input type="text" defaultValue={user?.organizationName || 'Acme Corporation'} />
                    </div>
                    <div className="form-group">
                        <label>Industry</label>
                        <select>
                            <option>Technology</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Manufacturing</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Organization Size</label>
                        <select>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>201-500</option>
                            <option>500+</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Website</label>
                        <input type="url" placeholder="https://yourcompany.com" />
                    </div>
                </div>
                <button className="btn btn-primary mt-2">Save Changes</button>
            </div>

            {/* Billing Card */}
            <div className="card mt-3">
                <h2 className="card-title">Billing & Plan</h2>
                <div className="plan-card">
                    <div className="plan-info">
                        <span className="plan-badge">Pro Plan</span>
                        <h3>$49/month</h3>
                        <p>Unlimited processes, 50 team members, API access</p>
                    </div>
                    <button className="btn btn-secondary">Manage Subscription</button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card mt-3 danger-card">
                <h2 className="card-title">Danger Zone</h2>
                <div className="danger-actions">
                    <div>
                        <strong>Delete Organization</strong>
                        <p>This action is irreversible. All data will be permanently deleted.</p>
                    </div>
                    <button className="btn btn-danger">
                        <Trash2 size={16} />
                        Delete Organization
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Organization;
