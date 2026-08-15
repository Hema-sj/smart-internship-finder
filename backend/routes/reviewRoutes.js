import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js';

const router = Router();

// Read — any authenticated user
router.get('/', requireAuth, getReviews);

// Create — students only
router.post('/', requireAuth, requireRole('student'), createReview);

// Delete — review owner (student) or admin — ownership checked inside controller
router.delete('/:id', requireAuth, requireRole('student', 'admin'), deleteReview);

export default router;
