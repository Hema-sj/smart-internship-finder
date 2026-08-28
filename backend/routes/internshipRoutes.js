import { Router } from 'express';
import { getInternships, getInternshipById, getApplicationLink, getInternshipStats, getLocationStats } from '../controllers/internshipController.js';

const router = Router();

// Public routes - no authentication required (but match scores calculated if authenticated)
// IMPORTANT: Specific routes must come BEFORE parameterized routes
router.get('/stats', getInternshipStats);  // General stats route
router.get('/locations/stats', getLocationStats);  // Location-specific stats
router.get('/', getInternships);
router.get('/:id/apply-link', getApplicationLink);
router.get('/:id', getInternshipById);  // This catches everything else, so it goes last

export default router;
