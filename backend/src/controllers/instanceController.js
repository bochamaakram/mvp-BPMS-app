const instanceService = require('../services/instanceService');
const aiService = require('../services/aiService');

/**
 * Start a new process instance
 */
const start = async (req, res) => {
    try {
        const { processId } = req.body;
        const { id: userId } = req.user;

        if (!processId) {
            return res.status(400).json({ error: 'Process ID is required' });
        }

        const instance = await instanceService.start({ processId, startedBy: userId });
        res.status(201).json(instance);
    } catch (error) {
        console.error('Start instance error:', error);
        res.status(500).json({ error: 'Failed to start process instance' });
    }
};

/**
 * Get all instances for user's organization
 */
const getAll = async (req, res) => {
    try {
        const instances = await instanceService.getAll(req.user.organizationId);
        res.json(instances);
    } catch (error) {
        console.error('Get instances error:', error);
        res.status(500).json({ error: 'Failed to fetch instances' });
    }
};

/**
 * Get instance by ID
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const instance = await instanceService.getById(id);

        if (!instance) {
            return res.status(404).json({ error: 'Instance not found' });
        }

        res.json(instance);
    } catch (error) {
        console.error('Get instance error:', error);
        res.status(500).json({ error: 'Failed to fetch instance' });
    }
};

/**
 * Update instance status
 */
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const { id: userId } = req.user;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (pending, approved, rejected)' });
        }

        const instance = await instanceService.updateStatus(id, { status, notes, performedBy: userId });
        res.json(instance);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update instance status' });
    }
};

/**
 * Move instance to next step
 */
const nextStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const { id: userId } = req.user;

        const instance = await instanceService.moveToNextStep(id, { value, performedBy: userId });
        res.json(instance);
    } catch (error) {
        console.error('Next step error:', error);
        res.status(500).json({ error: 'Failed to move to next step' });
    }
};

/**
 * Get execution history for an instance
 */
const getHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await instanceService.getHistory(id);
        res.json(history);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

/**
 * Get AI summary for an instance
 */
const getSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const summary = await aiService.generateSummary(id);
        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
};

module.exports = {
    start,
    getAll,
    getById,
    updateStatus,
    nextStep,
    getHistory,
    getSummary,
};
