import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getResources, getResourceById,
  createResource, updateResource, deleteResource,
} from '../controllers/resourceController.js';

const router = Router();

// Read — any authenticated user
router.get('/',    requireAuth, getResources);
router.get('/:id', requireAuth, getResourceById);

// Write — admin only
router.post('/',    requireAuth, requireRole('admin'), createResource);
router.put('/:id',  requireAuth, requireRole('admin'), updateResource);
router.delete('/:id', requireAuth, requireRole('admin'), deleteResource);

export default router;
