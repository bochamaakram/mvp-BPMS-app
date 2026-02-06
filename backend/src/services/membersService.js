const pool = require('../config/db');

/**
 * Members Service
 * Handles member CRUD operations within an organization
 */
const membersService = {
    /**
     * Get all members for an organization
     */
    async getByOrganization(organizationId) {
        const result = await pool.query(
            `SELECT id, email, role, created_at as "joinedAt",
                    CASE WHEN created_at IS NOT NULL THEN 'active' ELSE 'pending' END as status
             FROM users
             WHERE organization_id = $1
             ORDER BY created_at DESC`,
            [organizationId]
        );
        return result.rows;
    },

    /**
     * Get member count for an organization
     */
    async getMemberCount(organizationId) {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM users WHERE organization_id = $1',
            [organizationId]
        );
        return parseInt(result.rows[0].count);
    },

    /**
     * Update a member's role
     */
    async updateRole(memberId, organizationId, role) {
        const result = await pool.query(
            `UPDATE users SET role = $1
             WHERE id = $2 AND organization_id = $3
             RETURNING id, email, role`,
            [role, memberId, organizationId]
        );
        return result.rows[0];
    },

    /**
     * Remove a member from organization (delete user)
     */
    async remove(memberId, organizationId) {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 AND organization_id = $2 RETURNING id`,
            [memberId, organizationId]
        );
        return result.rows[0];
    },
};

module.exports = membersService;
