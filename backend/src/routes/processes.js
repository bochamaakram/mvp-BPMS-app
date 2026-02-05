const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/processes
 * @desc Get all processes for user's organization
 */
router.get('/', processController.getAll);

/**
 * @route POST /api/processes
 * @desc Create a new process with steps
 */
router.post('/', processController.create);

/**
 * @route GET /api/processes/:id
 * @desc Get process by ID with steps
 */
router.get('/:id', processController.getById);

/**
 * @route PUT /api/processes/:id
 * @desc Update a process
 */
router.put('/:id', processController.update);

/**
 * @route DELETE /api/processes/:id
 * @desc Delete a process
 */
router.delete('/:id', processController.remove);

module.exports = router;
