import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { processAPI } from '../api';
import { ArrowLeft, Save, GitBranch } from 'lucide-react';
import WorkflowBuilder from '../components/flow/WorkflowBuilder';
import '../components/flow/flow.css';

/**
 * Process Form Page
 * Create or edit a process with visual workflow builder
 */
function ProcessForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([{ name: '', description: '' }]);
    const [conditionalRule, setConditionalRule] = useState({
        field: 'value',
        operator: '>',
        threshold: 0,
        targetStep: 1,
    });
    const [enableRule, setEnableRule] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadProcess();
        }
    }, [id]);

    const loadProcess = async () => {
        try {
            const response = await processAPI.getById(id);
            const process = response.data;
            setName(process.name);
            setDescription(process.description || '');
            if (process.steps?.length > 0) {
                setSteps(process.steps.map(s => ({ name: s.name, description: s.description || '' })));
            }
            if (process.conditional_rule) {
                setConditionalRule(process.conditional_rule);
                setEnableRule(true);
            }
        } catch (error) {
            console.error('Failed to load process:', error);
            setError('Failed to load process');
        }
    };

    const handleStepsChange = (newSteps) => {
        setSteps(newSteps);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate
        if (!name.trim()) {
            setError('Process name is required');
            setLoading(false);
            return;
        }

        const validSteps = steps.filter(s => s.name.trim());
        if (validSteps.length === 0) {
            setError('At least one step with a name is required');
            setLoading(false);
            return;
        }

        try {
            const data = {
                name,
                description,
                steps: validSteps,
                conditionalRule: enableRule ? conditionalRule : null,
            };

            if (isEditing) {
                await processAPI.update(id, data);
            } else {
                await processAPI.create(data);
            }

            navigate('/workflows');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save process');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{isEditing ? 'Edit Workflow' : 'Create Workflow'}</h1>
                    <p className="page-subtitle">
                        {isEditing ? 'Modify your workflow steps and settings' : 'Design your workflow visually'}
                    </p>
                </div>
                <Link to="/workflows" className="btn btn-secondary">
                    <ArrowLeft size={16} />
                    Back to Workflows
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="workflow-form-layout">
                {/* Left Panel - Settings */}
                <div className="workflow-settings-panel">
                    <div className="card">
                        <h2 className="card-title">Workflow Details</h2>

                        <div className="form-group">
                            <label htmlFor="name">Workflow Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Expense Approval"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this workflow does..."
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={enableRule}
                                    onChange={(e) => setEnableRule(e.target.checked)}
                                />
                                <GitBranch size={16} />
                                Enable Conditional Logic
                            </label>
                        </div>

                        {enableRule && (
                            <div className="conditional-rule-panel">
                                <p className="rule-preview">
                                    If value is <strong>{conditionalRule.operator}</strong> {conditionalRule.threshold},
                                    jump to step {conditionalRule.targetStep}
                                </p>
                                <div className="rule-inputs">
                                    <div className="form-group">
                                        <label>Operator</label>
                                        <select
                                            value={conditionalRule.operator}
                                            onChange={(e) => setConditionalRule({ ...conditionalRule, operator: e.target.value })}
                                        >
                                            <option value=">">Greater than (&gt;)</option>
                                            <option value="<">Less than (&lt;)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Threshold</label>
                                        <input
                                            type="number"
                                            value={conditionalRule.threshold}
                                            onChange={(e) => setConditionalRule({ ...conditionalRule, threshold: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Target Step</label>
                                        <input
                                            type="number"
                                            value={conditionalRule.targetStep}
                                            min={1}
                                            max={steps.length}
                                            onChange={(e) => setConditionalRule({ ...conditionalRule, targetStep: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                className="btn btn-primary btn-block"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                <Save size={16} />
                                {loading ? 'Saving...' : (isEditing ? 'Update Workflow' : 'Create Workflow')}
                            </button>
                        </div>
                    </div>

                    {/* Steps List */}
                    <div className="card mt-3">
                        <h2 className="card-title">Steps ({steps.filter(s => s.name).length})</h2>
                        <div className="steps-summary">
                            {steps.map((step, index) => (
                                <div key={index} className="step-summary-item">
                                    <span className="step-number">{index + 1}</span>
                                    <span className="step-name">{step.name || 'Untitled'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Visual Builder */}
                <div className="workflow-builder-panel">
                    <WorkflowBuilder
                        initialSteps={steps}
                        onStepsChange={handleStepsChange}
                        processName={name}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProcessForm;
