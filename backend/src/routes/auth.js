const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route POST /api/auth/register
 * @desc Register a new user with organization
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
router.post('/login', authController.login);

module.exports = router;
