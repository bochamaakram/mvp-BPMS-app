import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { organizationAPI } from '../api';
import { UserPlus, Pencil, Trash2, Loader } from 'lucide-react';

/**
 * Members Page
 * Manage organization members - uses real API data
 */
function Members() {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const response = await organizationAPI.getMembers();
            setMembers(response.data);
        } catch (err) {
            console.error('Failed to load members:', err);
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await organizationAPI.removeMember(memberId);
            loadMembers();
        } catch (err) {
            console.error('Failed to remove member:', err);
            setError('Failed to remove member');
        }
    };

    const handleUpdateRole = async (memberId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await organizationAPI.updateMemberRole(memberId, newRole);
            loadMembers();
        } catch (err) {
            console.error('Failed to update role:', err);
            setError('Failed to update role');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Team Members</h1>
                    <p className="page-subtitle">
                        Manage your organization's team members and roles
                        ({members.length} member{members.length !== 1 ? 's' : ''})
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
                    <UserPlus size={18} />
                    Invite Member
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="card">
                {loading ? (
                    <div className="loading-state">
                        <Loader size={24} className="spin" />
                        Loading members...
                    </div>
                ) : members.length === 0 ? (
                    <div className="empty-state">
                        <h3>No team members yet</h3>
                        <p>Invite your first team member to get started</p>
                    </div>
                ) : (
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
                                                {member.id === user?.id && (
                                                    <span className="you-badge">You</span>
                                                )}
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
                                            {member.id !== user?.id && (
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleUpdateRole(member.id, member.role)}
                                                        title={`Make ${member.role === 'admin' ? 'user' : 'admin'}`}
                                                    >
                                                        <Pencil size={14} />
                                                        {member.role === 'admin' ? 'Demote' : 'Promote'}
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showInviteModal && (
                <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Invite Team Member</h2>
                        <p className="modal-note">
                            Note: Email invitations are not yet implemented.
                            New members can register and join your organization.
                        </p>
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
                            <button className="btn btn-primary" disabled>
                                Send Invite (Coming Soon)
                            </button>
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
