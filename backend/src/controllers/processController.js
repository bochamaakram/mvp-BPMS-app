const processService = require('../services/processService');

/**
 * Create a new process with steps
 */
const create = async (req, res) => {
    try {
        const { name, description, conditionalRule, steps } = req.body;
        const { organizationId, id: userId } = req.user;

        if (!name) {
            return res.status(400).json({ error: 'Process name is required' });
        }

        const process = await processService.create({
            name,
            description,
            conditionalRule,
            organizationId,
            createdBy: userId,
        });

        // Create steps if provided
        if (steps && steps.length > 0) {
            const createdSteps = await processService.createSteps(process.id, steps);
            process.steps = createdSteps;
        }

        res.status(201).json(process);
    } catch (error) {
        console.error('Create process error:', error);
        res.status(500).json({ error: 'Failed to create process' });
    }
};

/**
 * Get all processes for user's organization
 */
const getAll = async (req, res) => {
    try {
        const processes = await processService.getAll(req.user.organizationId);
        res.json(processes);
    } catch (error) {
        console.error('Get processes error:', error);
        res.status(500).json({ error: 'Failed to fetch processes' });
    }
};

/**
 * Get process by ID with steps
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const process = await processService.getById(id, req.user.organizationId);

        if (!process) {
            return res.status(404).json({ error: 'Process not found' });
        }

        const steps = await processService.getSteps(id);
        process.steps = steps;

        res.json(process);
    } catch (error) {
        console.error('Get process error:', error);
        res.status(500).json({ error: 'Failed to fetch process' });
    }
};

/**
 * Update a process
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, conditionalRule } = req.body;

        const process = await processService.update(id, { name, description, conditionalRule }, req.user.organizationId);

        if (!process) {
            return res.status(404).json({ error: 'Process not found' });
        }

        res.json(process);
    } catch (error) {
        console.error('Update process error:', error);
        res.status(500).json({ error: 'Failed to update process' });
    }
};

/**
 * Delete a process
 */
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await processService.remove(id, req.user.organizationId);

        if (!result) {
            return res.status(404).json({ error: 'Process not found' });
        }

        res.json({ message: 'Process deleted successfully' });
    } catch (error) {
        console.error('Delete process error:', error);
        res.status(500).json({ error: 'Failed to delete process' });
    }
};

/**
 * Toggle process active/inactive status
 */
const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const process = await processService.toggleActive(id, req.user.organizationId);

        if (!process) {
            return res.status(404).json({ error: 'Process not found' });
        }

        res.json(process);
    } catch (error) {
        console.error('Toggle process error:', error);
        res.status(500).json({ error: 'Failed to toggle process status' });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    toggleActive,
};
