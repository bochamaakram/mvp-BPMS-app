import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProcessForm from './pages/ProcessForm';
import Workflows from './pages/Workflows';
import Members from './pages/Members';
import Settings from './pages/Settings';
import Organization from './pages/Organization';

/**
 * Protected Route wrapper
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

/**
 * Main App Component
 */
function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Protected Routes with Layout */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="members" element={<Members />} />
                <Route path="settings" element={<Settings />} />
                <Route path="organization" element={<Organization />} />
                <Route path="process/new" element={<ProcessForm />} />
                <Route path="process/:id" element={<ProcessForm />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default App;
