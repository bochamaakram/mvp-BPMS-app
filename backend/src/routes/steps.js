const express = require('express');
const router = express.Router();
const stepController = require('../controllers/stepController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/processes/:id/steps
 * @desc Get all steps for a process
 */
router.get('/:id/steps', stepController.getSteps);

/**
 * @route POST /api/processes/:id/steps
 * @desc Add a step to a process
 */
router.post('/:id/steps', stepController.addStep);

/**
 * @route PUT /api/processes/:id/steps/:stepId
 * @desc Update a step
 */
router.put('/:id/steps/:stepId', stepController.updateStep);

/**
 * @route DELETE /api/processes/:id/steps/:stepId
 * @desc Delete a step
 */
router.delete('/:id/steps/:stepId', stepController.removeStep);

module.exports = router;
