const authService = require('../services/authService');

/**
 * Register a new user with organization
 */
const register = async (req, res) => {
    try {
        const { email, password, organizationName, role } = req.body;

        if (!email || !password || !organizationName) {
            return res.status(400).json({ error: 'Email, password, and organization name are required' });
        }

        const result = await authService.register({ email, password, organizationName, role });
        res.status(201).json(result);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await authService.login({ email, password });
        res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

module.exports = {
    register,
    login,
};
