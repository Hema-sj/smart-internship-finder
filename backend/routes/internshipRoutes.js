import { Router } from 'express';
import { getInternships, getInternshipById, getApplicationLink, getLocationStats } from '../controllers/internshipController.js';

const router = Router();

// Public routes - no authentication required (but match scores calculated if authenticated)
// IMPORTANT: Specific routes must come BEFORE parameterized routes
router.get('/stats', getLocationStats);  // Stats route must be before /:id
router.get('/', getInternships);
router.get('/:id/apply-link', getApplicationLink);
router.get('/:id', getInternshipById);  // This catches everything else, so it goes last

export default router;
