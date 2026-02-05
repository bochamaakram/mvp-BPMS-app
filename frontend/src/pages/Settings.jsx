import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Lock, Link } from 'lucide-react';

/**
 * Settings Page
 * User and application settings
 */
function Settings() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'integrations', label: 'Integrations', icon: Link },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="settings-layout">
                <div className="settings-nav">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <section.icon size={18} />
                            <span>{section.label}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-content">
                    {activeSection === 'profile' && (
                        <div className="card">
                            <h2 className="card-title">Profile Settings</h2>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={user?.email || ''} disabled />
                            </div>
                            <div className="form-group">
                                <label>Display Name</label>
                                <input type="text" placeholder="Your name" />
                            </div>
                            <div className="form-group">
                                <label>Timezone</label>
                                <select>
                                    <option>UTC</option>
                                    <option>Europe/Paris</option>
                                    <option>America/New_York</option>
                                </select>
                            </div>
                            <button className="btn btn-primary">Save Changes</button>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="card">
                            <h2 className="card-title">Notification Preferences</h2>
                            <div className="settings-toggle">
                                <div>
                                    <strong>Email Notifications</strong>
                                    <p>Receive updates via email</p>
                                </div>
                                <input type="checkbox" defaultChecked />
                            </div>
                            <div className="settings-toggle">
                                <div>
                                    <strong>Process Updates</strong>
                                    <p>Get notified when process status changes</p>
                                </div>
                                <input type="checkbox" defaultChecked />
                            </div>
                            <div className="settings-toggle">
                                <div>
                                    <strong>Team Activity</strong>
                                    <p>Notifications about team member actions</p>
                                </div>
                                <input type="checkbox" />
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="card">
                            <h2 className="card-title">Security Settings</h2>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <button className="btn btn-primary">Update Password</button>
                        </div>
                    )}

                    {activeSection === 'integrations' && (
                        <div className="card">
                            <h2 className="card-title">Integrations</h2>
                            <div className="integration-item">
                                <div className="integration-info">
                                    <div className="integration-icon-wrapper">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <strong>Slack</strong>
                                        <p>Send notifications to Slack channels</p>
                                    </div>
                                </div>
                                <button className="btn btn-secondary btn-sm">Connect</button>
                            </div>
                            <div className="integration-item">
                                <div className="integration-info">
                                    <div className="integration-icon-wrapper">
                                        <Link size={24} />
                                    </div>
                                    <div>
                                        <strong>Webhook</strong>
                                        <p>Custom webhook for process events</p>
                                    </div>
                                </div>
                                <button className="btn btn-secondary btn-sm">Configure</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
