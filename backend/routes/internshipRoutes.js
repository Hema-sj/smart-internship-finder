import { Router } from 'express';
import {
  listInternships,
  getInternship,
  listPaidInternships,
  listUnpaidInternships,
  listInternshipsByLocation,
  listLocations,
  listCourses,
  getStats,
} from '../controllers/internshipController.js';

const router = Router();

// ── Specific named routes MUST come before /:id ──────────────────────────────
router.get('/locations',          listLocations);
router.get('/courses',            listCourses);
router.get('/stats',              getStats);
router.get('/paid',               listPaidInternships);
router.get('/unpaid',             listUnpaidInternships);
router.get('/search',             listInternships);
router.get('/location/:location', listInternshipsByLocation);

// ── Generic list & detail ─────────────────────────────────────────────────────
router.get('/',    listInternships);
router.get('/:id', getInternship);

export default router;
