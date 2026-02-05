import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Zap,
    Users,
    Building2,
    Settings,
    LogOut,
    FileText,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

/**
 * Sidebar Component
 * Collapsible navigation for the application
 */
function Sidebar({ collapsed, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/workflows', icon: Zap, label: 'Workflows' },
        { path: '/members', icon: Users, label: 'Members' },
        { path: '/organization', icon: Building2, label: 'Organization' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon-wrapper">
                        <FileText size={22} />
                    </div>
                    {!collapsed && <span className="logo-text">BPMS</span>}
                </div>
                <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={20} className="nav-icon" />
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!collapsed && (
                    <div className="user-card">
                        <div className="user-avatar">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.organizationName}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                    </div>
                )}
                {collapsed ? (
                    <button
                        className="btn-icon logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                ) : (
                    <button className="btn btn-dark btn-sm btn-block" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
