const pool = require('../config/db');

/**
 * Stats Service
 * Provides organization-wide statistics
 */
const statsService = {
    /**
     * Get complete organization stats
     */
    async getOrganizationStats(organizationId) {
        // Get member count
        const memberResult = await pool.query(
            'SELECT COUNT(*) as count FROM users WHERE organization_id = $1',
            [organizationId]
        );

        // Get process count
        const processResult = await pool.query(
            'SELECT COUNT(*) as count FROM processes WHERE organization_id = $1',
            [organizationId]
        );

        // Get active instances (pending status)
        const activeResult = await pool.query(
            `SELECT COUNT(*) as count FROM process_instances pi
             JOIN processes p ON pi.process_id = p.id
             WHERE p.organization_id = $1 AND pi.status = 'pending'`,
            [organizationId]
        );

        // Get completed this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const completedResult = await pool.query(
            `SELECT COUNT(*) as count FROM process_instances pi
             JOIN processes p ON pi.process_id = p.id
             WHERE p.organization_id = $1 
               AND pi.status IN ('approved', 'completed')
               AND pi.completed_at >= $2`,
            [organizationId, startOfMonth]
        );

        // Get average completion time (in days) for completed instances
        const avgTimeResult = await pool.query(
            `SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 86400) as avg_days
             FROM process_instances pi
             JOIN processes p ON pi.process_id = p.id
             WHERE p.organization_id = $1 
               AND pi.status IN ('approved', 'completed')
               AND pi.completed_at IS NOT NULL`,
            [organizationId]
        );

        return {
            totalMembers: parseInt(memberResult.rows[0].count),
            totalProcesses: parseInt(processResult.rows[0].count),
            activeInstances: parseInt(activeResult.rows[0].count),
            completedThisMonth: parseInt(completedResult.rows[0].count),
            avgCompletionTime: avgTimeResult.rows[0].avg_days
                ? parseFloat(avgTimeResult.rows[0].avg_days).toFixed(1)
                : null,
        };
    },
};

module.exports = statsService;
