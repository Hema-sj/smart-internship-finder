import { Router } from 'express';
import {
  listLocations,
  getLocation,
  listInternshipsForLocation,
} from '../controllers/locationController.js';

const router = Router();

router.get('/', listLocations);
router.get('/:location/internships', listInternshipsForLocation);
router.get('/:location', getLocation);

export default router;
