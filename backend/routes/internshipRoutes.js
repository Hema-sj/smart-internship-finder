import { Router } from 'express';
import { getInternship, listInternships, listInternshipsByLocation, listPaidInternships, listUnpaidInternships } from '../controllers/internshipController.js';

const router = Router();
router.get('/', listInternships);
router.get('/search', listInternships);
router.get('/paid', listPaidInternships);
router.get('/unpaid', listUnpaidInternships);
router.get('/location/:location', listInternshipsByLocation);
router.get('/:id', getInternship);
export default router;
