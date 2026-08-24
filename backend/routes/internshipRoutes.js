import { Router } from 'express';
import { getInternships, getInternshipById } from '../controllers/internshipController.js';

const router = Router();

// Public routes - no authentication required (but match scores calculated if authenticated)
router.get('/', getInternships);
router.get('/:id', getInternshipById);

export default router;
