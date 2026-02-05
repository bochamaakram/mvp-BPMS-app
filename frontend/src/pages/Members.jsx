import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

/**
 * Members Page
 * Manage organization members
 */
function Members() {
    const { user } = useAuth();
    const [members, setMembers] = useState([
        { id: 1, email: 'admin@acme.com', role: 'admin', status: 'active', joinedAt: '2024-01-15' },
        { id: 2, email: 'user@acme.com', role: 'user', status: 'active', joinedAt: '2024-02-01' },
    ]);
    const [showInviteModal, setShowInviteModal] = useState(false);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Team Members</h1>
                    <p className="page-subtitle">Manage your organization's team members and roles</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
                    <UserPlus size={18} />
                    Invite Member
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="member-cell">
                                            <div className="member-avatar">
                                                {member.email.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{member.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${member.role}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${member.status === 'active' ? 'approved' : 'pending'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-secondary btn-sm">
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm">
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showInviteModal && (
                <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Invite Team Member</h2>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="colleague@company.com" />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="btn btn-primary">Send Invite</button>
                            <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Members;
