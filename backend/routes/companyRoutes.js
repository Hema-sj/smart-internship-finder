import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getMyProfile,
  updateMyProfile,
  getMyInternships,
  getMyInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  disableInternship,
  getApplications,
  updateApplicationStatus,
  getDashboardStats,
} from '../controllers/companyController.js';
import {
  validate,
  validateCompanyProfile,
  validateInternship,
  validateApplicationStatus,
} from '../middleware/validateRequest.js';

const router = Router();

// All company routes require auth + company role
router.use(requireAuth, requireRole('company'));

// ─── Company Profile ──────────────────────────────────────────────────────────
router.get('/profile', getMyProfile);
router.put('/profile', validateCompanyProfile, validate, updateMyProfile);

// ─── Internship Management ────────────────────────────────────────────────────
router.get('/internships', getMyInternships);
router.get('/internships/:id', getMyInternshipById);
router.post('/internships', validateInternship, validate, createInternship);
router.put('/internships/:id', validateInternship, validate, updateInternship);
router.delete('/internships/:id', deleteInternship);
router.patch('/internships/:id/disable', disableInternship);

// ─── Application Management ───────────────────────────────────────────────────
router.get('/applications', getApplications);
router.put('/applications/:id/status', validateApplicationStatus, validate, updateApplicationStatus);

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
router.get('/dashboard/stats', getDashboardStats);

export default router;
