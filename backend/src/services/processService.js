const db = require('../config/db');

/**
 * Create a new process
 */
const create = async ({ name, description, conditionalRule, organizationId, createdBy }) => {
    const result = await db.query(
        `INSERT INTO processes (name, description, conditional_rule, organization_id, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [name, description, JSON.stringify(conditionalRule), organizationId, createdBy]
    );
    return result.rows[0];
};

/**
 * Get all processes for an organization
 */
const getAll = async (organizationId) => {
    const result = await db.query(
        `SELECT p.*, 
            (SELECT COUNT(*) FROM steps WHERE process_id = p.id) as step_count,
            (SELECT COUNT(*) FROM process_instances WHERE process_id = p.id) as instance_count,
            (SELECT MAX(started_at) FROM process_instances WHERE process_id = p.id) as last_run_at
     FROM processes p
     WHERE p.organization_id = $1
     ORDER BY p.created_at DESC`,
        [organizationId]
    );
    return result.rows;
};

/**
 * Get process by ID
 */
const getById = async (id, organizationId) => {
    const result = await db.query(
        `SELECT * FROM processes WHERE id = $1 AND organization_id = $2`,
        [id, organizationId]
    );
    return result.rows[0];
};

/**
 * Update a process
 */
const update = async (id, { name, description, conditionalRule }, organizationId) => {
    const result = await db.query(
        `UPDATE processes 
     SET name = $1, description = $2, conditional_rule = $3
     WHERE id = $4 AND organization_id = $5
     RETURNING *`,
        [name, description, JSON.stringify(conditionalRule), id, organizationId]
    );
    return result.rows[0];
};

/**
 * Delete a process
 */
const remove = async (id, organizationId) => {
    const result = await db.query(
        `DELETE FROM processes WHERE id = $1 AND organization_id = $2 RETURNING id`,
        [id, organizationId]
    );
    return result.rows[0];
};

/**
 * Toggle process active status
 */
const toggleActive = async (id, organizationId) => {
    const result = await db.query(
        `UPDATE processes 
         SET is_active = NOT COALESCE(is_active, true)
         WHERE id = $1 AND organization_id = $2
         RETURNING *`,
        [id, organizationId]
    );
    return result.rows[0];
};

/**
 * Create steps for a process
 */
const createSteps = async (processId, steps) => {
    const results = [];
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const result = await db.query(
            `INSERT INTO steps (process_id, name, description, step_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [processId, step.name, step.description, i + 1]
        );
        results.push(result.rows[0]);
    }
    return results;
};

/**
 * Get steps for a process
 */
const getSteps = async (processId) => {
    const result = await db.query(
        `SELECT * FROM steps WHERE process_id = $1 ORDER BY step_order`,
        [processId]
    );
    return result.rows;
};

/**
 * Update a step
 */
const updateStep = async (stepId, { name, description }) => {
    const result = await db.query(
        `UPDATE steps SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
        [name, description, stepId]
    );
    return result.rows[0];
};

/**
 * Delete a step
 */
const removeStep = async (stepId) => {
    const result = await db.query(
        `DELETE FROM steps WHERE id = $1 RETURNING id`,
        [stepId]
    );
    return result.rows[0];
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    toggleActive,
    createSteps,
    getSteps,
    updateStep,
    removeStep,
};
