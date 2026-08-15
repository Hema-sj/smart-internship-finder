import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getMyCompany, updateMyCompany,
  getMyInternships, createInternship, updateInternship, deleteInternship,
  getInternshipApplications, updateApplicationStatus,
} from '../controllers/companyController.js';

const router = Router();

// All company routes require auth + company role
router.use(requireAuth, requireRole('company'));

// Company profile
router.get('/',   getMyCompany);
router.put('/',   updateMyCompany);

// Internship management
router.get('/internships',        getMyInternships);
router.post('/internships',       createInternship);
router.put('/internships/:id',    updateInternship);
router.delete('/internships/:id', deleteInternship);

// Application management
router.get('/internships/:internshipId/applications', getInternshipApplications);
router.patch('/applications/:id/status',             updateApplicationStatus);

export default router;
