const processService = require('../services/processService');

/**
 * Get steps for a process
 */
const getSteps = async (req, res) => {
    try {
        const { id } = req.params;
        const steps = await processService.getSteps(id);
        res.json(steps);
    } catch (error) {
        console.error('Get steps error:', error);
        res.status(500).json({ error: 'Failed to fetch steps' });
    }
};

/**
 * Add a step to a process
 */
const addStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Step name is required' });
        }

        const steps = await processService.createSteps(id, [{ name, description }]);
        res.status(201).json(steps[0]);
    } catch (error) {
        console.error('Add step error:', error);
        res.status(500).json({ error: 'Failed to add step' });
    }
};

/**
 * Update a step
 */
const updateStep = async (req, res) => {
    try {
        const { stepId } = req.params;
        const { name, description } = req.body;

        const step = await processService.updateStep(stepId, { name, description });

        if (!step) {
            return res.status(404).json({ error: 'Step not found' });
        }

        res.json(step);
    } catch (error) {
        console.error('Update step error:', error);
        res.status(500).json({ error: 'Failed to update step' });
    }
};

/**
 * Delete a step
 */
const removeStep = async (req, res) => {
    try {
        const { stepId } = req.params;
        const result = await processService.removeStep(stepId);

        if (!result) {
            return res.status(404).json({ error: 'Step not found' });
        }

        res.json({ message: 'Step deleted successfully' });
    } catch (error) {
        console.error('Delete step error:', error);
        res.status(500).json({ error: 'Failed to delete step' });
    }
};

module.exports = {
    getSteps,
    addStep,
    updateStep,
    removeStep,
};
