const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SALT_ROUNDS = 10;

/**
 * Register a new user with organization
 */
const register = async ({ email, password, organizationName, role = 'user' }) => {
    // Create organization first
    const orgResult = await db.query(
        'INSERT INTO organizations (name) VALUES ($1) RETURNING id, name',
        [organizationName]
    );
    const organization = orgResult.rows[0];

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userResult = await db.query(
        `INSERT INTO users (email, password_hash, role, organization_id) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, role, organization_id`,
        [email, passwordHash, role, organization.id]
    );
    const user = userResult.rows[0];

    // Generate token
    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organization_id,
            organizationName: organization.name,
        },
        token,
    };
};

/**
 * Login user with email and password
 */
const login = async ({ email, password }) => {
    // Find user with organization
    const result = await db.query(
        `SELECT u.id, u.email, u.password_hash, u.role, u.organization_id, o.name as org_name
     FROM users u
     JOIN organizations o ON u.organization_id = o.id
     WHERE u.email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organization_id,
            organizationName: user.org_name,
        },
        token,
    };
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organization_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = {
    register,
    login,
};
