import { Router } from 'express';
import {
  getLocationStats,
  getLocationInternships,
  getCompanyProfile,
} from '../controllers/locationController.js';

const router = Router();

// Location statistics and data
router.get('/:location/stats', getLocationStats);
router.get('/:location/internships', getLocationInternships);

// Company profile (added here for convenience)
router.get('/company/:id', getCompanyProfile);

export default router;
