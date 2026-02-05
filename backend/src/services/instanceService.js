const db = require('../config/db');

/**
 * Start a new process instance
 */
const start = async ({ processId, startedBy }) => {
    // Get first step of the process
    const stepResult = await db.query(
        `SELECT id FROM steps WHERE process_id = $1 ORDER BY step_order LIMIT 1`,
        [processId]
    );
    const firstStepId = stepResult.rows[0]?.id || null;

    // Create instance
    const result = await db.query(
        `INSERT INTO process_instances (process_id, current_step_id, status, started_by)
     VALUES ($1, $2, 'pending', $3)
     RETURNING *`,
        [processId, firstStepId, startedBy]
    );
    const instance = result.rows[0];

    // Log initial history
    await logHistory(instance.id, firstStepId, 'pending', 'Process started', startedBy);

    return instance;
};

/**
 * Get all instances for an organization
 */
const getAll = async (organizationId) => {
    const result = await db.query(
        `SELECT pi.*, p.name as process_name, s.name as current_step_name, u.email as started_by_email
     FROM process_instances pi
     JOIN processes p ON pi.process_id = p.id
     LEFT JOIN steps s ON pi.current_step_id = s.id
     LEFT JOIN users u ON pi.started_by = u.id
     WHERE p.organization_id = $1
     ORDER BY pi.started_at DESC`,
        [organizationId]
    );
    return result.rows;
};

/**
 * Get instance by ID
 */
const getById = async (id) => {
    const result = await db.query(
        `SELECT pi.*, p.name as process_name, p.conditional_rule, s.name as current_step_name
     FROM process_instances pi
     JOIN processes p ON pi.process_id = p.id
     LEFT JOIN steps s ON pi.current_step_id = s.id
     WHERE pi.id = $1`,
        [id]
    );
    return result.rows[0];
};

/**
 * Update instance status
 */
const updateStatus = async (id, { status, notes, performedBy }) => {
    // Use separate queries to avoid parameter type inference issues
    let completedAt = null;
    if (status === 'approved' || status === 'rejected') {
        completedAt = new Date();
    }

    const result = await db.query(
        `UPDATE process_instances 
     SET status = $1, completed_at = $2
     WHERE id = $3
     RETURNING *`,
        [status, completedAt, id]
    );
    const instance = result.rows[0];

    // Log history
    await logHistory(id, instance.current_step_id, status, notes, performedBy);

    return instance;
};

/**
 * Move to next step (with conditional rule evaluation)
 */
const moveToNextStep = async (id, { value, performedBy }) => {
    const instance = await getById(id);
    if (!instance) throw new Error('Instance not found');

    // Get all steps
    const stepsResult = await db.query(
        `SELECT * FROM steps WHERE process_id = $1 ORDER BY step_order`,
        [instance.process_id]
    );
    const steps = stepsResult.rows;

    // Find current step index
    const currentIndex = steps.findIndex(s => s.id === instance.current_step_id);

    // Evaluate conditional rule if exists
    let nextIndex = currentIndex + 1;
    if (instance.conditional_rule) {
        const rule = instance.conditional_rule;
        // Simple rule: { field: 'value', operator: '>', threshold: X, targetStep: Y }
        if (rule.operator === '>' && value > rule.threshold) {
            nextIndex = steps.findIndex(s => s.step_order === rule.targetStep);
        } else if (rule.operator === '<' && value < rule.threshold) {
            nextIndex = steps.findIndex(s => s.step_order === rule.targetStep);
        }
    }

    // If no more steps, mark as completed
    if (nextIndex >= steps.length) {
        return updateStatus(id, { status: 'approved', notes: 'Process completed', performedBy });
    }

    // Move to next step
    const nextStep = steps[nextIndex];
    const result = await db.query(
        `UPDATE process_instances SET current_step_id = $1 WHERE id = $2 RETURNING *`,
        [nextStep.id, id]
    );

    await logHistory(id, nextStep.id, 'pending', `Moved to step: ${nextStep.name}`, performedBy);

    return result.rows[0];
};

/**
 * Get execution history for an instance
 */
const getHistory = async (instanceId) => {
    const result = await db.query(
        `SELECT eh.*, s.name as step_name, u.email as performed_by_email
     FROM execution_history eh
     LEFT JOIN steps s ON eh.step_id = s.id
     LEFT JOIN users u ON eh.performed_by = u.id
     WHERE eh.instance_id = $1
     ORDER BY eh.performed_at DESC`,
        [instanceId]
    );
    return result.rows;
};

/**
 * Log execution history
 */
const logHistory = async (instanceId, stepId, status, notes, performedBy) => {
    await db.query(
        `INSERT INTO execution_history (instance_id, step_id, status, notes, performed_by)
     VALUES ($1, $2, $3, $4, $5)`,
        [instanceId, stepId, status, notes, performedBy]
    );
};

module.exports = {
    start,
    getAll,
    getById,
    updateStatus,
    moveToNextStep,
    getHistory,
};
