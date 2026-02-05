const express = require('express');
const router = express.Router();
const instanceController = require('../controllers/instanceController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/instances
 * @desc Get all instances for user's organization
 */
router.get('/', instanceController.getAll);

/**
 * @route POST /api/instances
 * @desc Start a new process instance
 */
router.post('/', instanceController.start);

/**
 * @route GET /api/instances/:id
 * @desc Get instance by ID
 */
router.get('/:id', instanceController.getById);

/**
 * @route PUT /api/instances/:id/status
 * @desc Update instance status
 */
router.put('/:id/status', instanceController.updateStatus);

/**
 * @route POST /api/instances/:id/next
 * @desc Move instance to next step
 */
router.post('/:id/next', instanceController.nextStep);

/**
 * @route GET /api/instances/:id/history
 * @desc Get execution history for an instance
 */
router.get('/:id/history', instanceController.getHistory);

/**
 * @route GET /api/instances/:id/summary
 * @desc Get AI summary for an instance
 */
router.get('/:id/summary', instanceController.getSummary);

module.exports = router;
