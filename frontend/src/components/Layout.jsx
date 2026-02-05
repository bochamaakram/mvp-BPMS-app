import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Create context for sidebar state
export const SidebarContext = createContext();

export function useSidebar() {
    return useContext(SidebarContext);
}

/**
 * Main Layout Component
 * Wraps authenticated pages with collapsible sidebar
 */
function Layout() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
            <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </SidebarContext.Provider>
    );
}

export default Layout;
