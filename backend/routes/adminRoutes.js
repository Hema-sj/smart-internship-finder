import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getDashboardStats,
  listUsers, getUserById, deleteUser,
  listAllInternships, updateInternshipStatus, deleteInternshipAdmin, createInternship,
  listAllCompanies, verifyCompany,
  listAllApplications,
  getNewInternshipNotifications,
  getPendingCompanies, approveCompanyAccess, rejectCompanyAccess,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireRole('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users',      listUsers);
router.get('/users/:id',  getUserById);
router.delete('/users/:id', deleteUser);

// Internship management
router.get('/internships/notifications/new', getNewInternshipNotifications);
router.get('/internships',              listAllInternships);
router.post('/internships',             createInternship);
router.patch('/internships/:id/status', updateInternshipStatus);
router.delete('/internships/:id',       deleteInternshipAdmin);

// Company management
router.get('/companies/pending',      getPendingCompanies);
router.get('/companies',              listAllCompanies);
router.patch('/companies/:id/verify', verifyCompany);
router.post('/companies/:companyId/approve', approveCompanyAccess);
router.post('/companies/:companyId/reject', rejectCompanyAccess);

// Application oversight
router.get('/applications', listAllApplications);

export default router;
