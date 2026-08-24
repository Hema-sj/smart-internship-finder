import { Router } from 'express';
import multer from 'multer';
import { requireAuth }    from '../middleware/authMiddleware.js';
import { requireRole }    from '../middleware/roleMiddleware.js';
import {
  getMyProfile, updateMyProfile,
  getMyApplications, applyToInternship, withdrawApplication,
  getSaved, saveInternship, unsaveInternship,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getResumes, uploadResume, deleteResume,
} from '../controllers/studentController.js';

const router = Router();

// Configure multer for resume uploads (memory storage for AI service processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// All student routes require auth + student role
router.use(requireAuth, requireRole('student'));

// Profile
router.get('/me/profile',   getMyProfile);
router.put('/me/profile',   updateMyProfile);

// Applications
router.get('/me/applications',        getMyApplications);
router.post('/me/applications',       applyToInternship);
router.delete('/me/applications/:id', withdrawApplication);

// Saved internships
router.get('/me/saved',        getSaved);
router.post('/me/saved',       saveInternship);
router.delete('/me/saved/:id', unsaveInternship);

// Notifications
router.get('/me/notifications',               getNotifications);
router.patch('/me/notifications/read-all',    markAllNotificationsRead);
router.patch('/me/notifications/:id/read',    markNotificationRead);

// Resumes
router.get('/me/resumes',        getResumes);
router.post('/me/resumes',       upload.single('file'), uploadResume);
router.delete('/me/resumes/:id', deleteResume);

export default router;
