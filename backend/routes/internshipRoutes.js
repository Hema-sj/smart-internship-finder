import { Router } from 'express';
import {
  listInternships,
  getInternship,
  listPaidInternships,
  listUnpaidInternships,
  listInternshipsByLocation,
  listLocations,
} from '../controllers/internshipController.js';

const router = Router();

// Stats endpoints — must come before /:id
router.get('/locations',          listLocations);
router.get('/search',             listInternships);
router.get('/paid',               listPaidInternships);
router.get('/unpaid',             listUnpaidInternships);
router.get('/location/:location', listInternshipsByLocation);

// List & detail
router.get('/',    listInternships);
router.get('/:id', getInternship);

export default router;
