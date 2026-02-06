const express = require('express');
const membersService = require('../services/membersService');
const statsService = require('../services/statsService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/organization/members
 * Get all members in the current user's organization
 */
router.get('/members', authMiddleware, async (req, res) => {
    try {
        const members = await membersService.getByOrganization(req.user.organizationId);
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

/**
 * PUT /api/organization/members/:id/role
 * Update a member's role
 */
router.put('/members/:id/role', authMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const member = await membersService.updateRole(
            req.params.id,
            req.user.organizationId,
            role
        );

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        console.error('Error updating member role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

/**
 * DELETE /api/organization/members/:id
 * Remove a member from the organization
 */
router.delete('/members/:id', authMiddleware, async (req, res) => {
    try {
        // Prevent self-deletion
        if (req.params.id === req.user.id) {
            return res.status(400).json({ error: 'Cannot remove yourself' });
        }

        const result = await membersService.remove(req.params.id, req.user.organizationId);

        if (!result) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

/**
 * GET /api/organization/stats
 * Get organization statistics
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await statsService.getOrganizationStats(req.user.organizationId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
