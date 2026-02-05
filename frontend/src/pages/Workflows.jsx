import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { processAPI, instanceAPI } from '../api';
import { Plus, Play, Pencil, Trash2, Zap, Eye, X } from 'lucide-react';
import WorkflowEditor from '../components/flow/WorkflowEditor';
import '../components/flow/flow.css';

/**
 * Workflows Page
 * Manage and view all workflows/processes
 */
function Workflows() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewingWorkflow, setViewingWorkflow] = useState(null);

    useEffect(() => {
        loadProcesses();
    }, []);

    const loadProcesses = async () => {
        try {
            setLoading(true);
            const response = await processAPI.getAll();
            setProcesses(response.data);
        } catch (error) {
            console.error('Failed to load processes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartInstance = async (processId) => {
        try {
            await instanceAPI.start(processId);
            loadProcesses();
        } catch (error) {
            console.error('Failed to start instance:', error);
        }
    };

    const handleDelete = async (processId) => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;
        try {
            await processAPI.delete(processId);
            loadProcesses();
        } catch (error) {
            console.error('Failed to delete process:', error);
        }
    };

    const handleViewWorkflow = async (process) => {
        try {
            const response = await processAPI.getById(process.id);
            setViewingWorkflow(response.data);
        } catch (error) {
            console.error('Failed to load workflow:', error);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Workflows</h1>
                    <p className="page-subtitle">Create and manage your business workflows</p>
                </div>
                <Link to="/process/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Workflow
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Workflows
                </button>
                <button
                    className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button
                    className={`filter-tab ${filter === 'draft' ? 'active' : ''}`}
                    onClick={() => setFilter('draft')}
                >
                    Drafts
                </button>
            </div>

            {loading ? (
                <div className="loading-state">Loading workflows...</div>
            ) : processes.length === 0 ? (
                <div className="empty-state-card">
                    <div className="empty-icon">
                        <Zap size={56} />
                    </div>
                    <h3>No workflows yet</h3>
                    <p>Create your first workflow to automate your business processes</p>
                    <Link to="/process/new" className="btn btn-primary mt-2">
                        Create Workflow
                    </Link>
                </div>
            ) : (
                <div className="workflow-grid">
                    {processes.map((process) => (
                        <div key={process.id} className="workflow-card">
                            <div className="workflow-header">
                                <div className="workflow-icon">
                                    <Zap size={22} />
                                </div>
                                <div className="workflow-meta">
                                    <h3>{process.name}</h3>
                                    <span className="workflow-steps">{process.step_count || 0} steps</span>
                                </div>
                            </div>
                            {process.description && (
                                <p className="workflow-description">{process.description}</p>
                            )}
                            <div className="workflow-stats">
                                <div className="workflow-stat">
                                    <span className="stat-number">{process.instance_count || 0}</span>
                                    <span className="stat-text">Instances</span>
                                </div>
                                <div className="workflow-stat">
                                    <span className="stat-number">
                                        {new Date(process.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="stat-text">Created</span>
                                </div>
                            </div>
                            <div className="workflow-actions">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleViewWorkflow(process)}
                                    title="View Flow"
                                >
                                    <Eye size={14} />
                                    View
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleStartInstance(process.id)}
                                >
                                    <Play size={14} />
                                    Start
                                </button>
                                <Link to={`/process/${process.id}`} className="btn btn-secondary btn-sm">
                                    <Pencil size={14} />
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(process.id)}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Workflow Viewer Modal */}
            {viewingWorkflow && (
                <div className="workflow-modal" onClick={() => setViewingWorkflow(null)}>
                    <div className="workflow-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="workflow-modal-header">
                            <h2>{viewingWorkflow.name}</h2>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setViewingWorkflow(null)}
                            >
                                <X size={16} />
                                Close
                            </button>
                        </div>
                        <div className="workflow-editor-full">
                            <WorkflowEditor
                                steps={viewingWorkflow.steps || []}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Workflows;
