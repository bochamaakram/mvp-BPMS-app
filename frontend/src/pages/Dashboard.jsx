import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { processAPI, instanceAPI } from '../api';
import InstanceList from '../components/InstanceList';
import AISummary from '../components/AISummary';
import { Clock, CheckCircle, XCircle, Zap } from 'lucide-react';

/**
 * Dashboard Page
 */
function Dashboard() {
    const { user } = useAuth();
    const [instances, setInstances] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [instancesRes, processesRes] = await Promise.all([
                instanceAPI.getAll(),
                processAPI.getAll(),
            ]);
            setInstances(instancesRes.data);
            setProcesses(processesRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (instanceId, status) => {
        try {
            await instanceAPI.updateStatus(instanceId, { status });
            loadData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleGetSummary = async (instanceId) => {
        try {
            setSummaryLoading(true);
            const response = await instanceAPI.getSummary(instanceId);
            setSummary(response.data);
        } catch (error) {
            console.error('Failed to get summary:', error);
        } finally {
            setSummaryLoading(false);
        }
    };

    // Calculate stats
    const stats = [
        {
            label: 'Active Instances',
            value: instances.filter(i => i.status === 'pending').length,
            icon: Clock,
            color: 'var(--status-pending)'
        },
        {
            label: 'Approved',
            value: instances.filter(i => i.status === 'approved').length,
            icon: CheckCircle,
            color: 'var(--status-approved)'
        },
        {
            label: 'Rejected',
            value: instances.filter(i => i.status === 'rejected').length,
            icon: XCircle,
            color: 'var(--status-rejected)'
        },
        {
            label: 'Total Workflows',
            value: processes.length,
            icon: Zap,
            color: 'var(--accent-lime)'
        },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="page-subtitle">Overview of your business processes</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <span className="stat-icon" style={{ background: stat.color }}>
                            <stat.icon size={24} />
                        </span>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Process Instances */}
            <div className="card mt-3">
                <div className="card-header">
                    <h2>Recent Process Instances</h2>
                </div>

                {loading ? (
                    <p className="loading-state">Loading...</p>
                ) : instances.length === 0 ? (
                    <div className="empty-state">
                        <h3>No process instances yet</h3>
                        <p>Start a workflow from the Workflows page</p>
                    </div>
                ) : (
                    <InstanceList
                        instances={instances.slice(0, 10)}
                        onUpdateStatus={handleUpdateStatus}
                        onGetSummary={handleGetSummary}
                    />
                )}

                {summary && (
                    <div className="mt-3">
                        <AISummary
                            summary={summary}
                            loading={summaryLoading}
                            onClose={() => setSummary(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
