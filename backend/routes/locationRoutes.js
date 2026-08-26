import { Router } from 'express';
import {
  getAllLocations,
  getLocationStats,
  getLocationInternships,
  getCompanyProfile,
} from '../controllers/locationController.js';

const router = Router();

// Get all locations
router.get('/', getAllLocations);

// Location statistics and data
router.get('/:location/stats', getLocationStats);
router.get('/:location/internships', getLocationInternships);

// Company profile (added here for convenience)
router.get('/company/:id', getCompanyProfile);

export default router;
