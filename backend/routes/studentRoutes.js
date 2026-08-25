import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth }    from '../middleware/authMiddleware.js';
import { requireRole }    from '../middleware/roleMiddleware.js';
import {
  getMyProfile, updateMyProfile,
  getMyApplications, applyToInternship, withdrawApplication,
  getSaved, saveInternship, unsaveInternship,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getResumes, getResumeById, uploadResume, updateResume, deleteResume, generateAIResume,
} from '../controllers/studentController.js';

const router = Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
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
router.get('/me/resumes',           getResumes);
router.get('/me/resumes/:id',       getResumeById);
router.post('/me/resumes/upload',   upload.single('file'), uploadResume);
router.put('/me/resumes/:id',       updateResume);
router.delete('/me/resumes/:id',    deleteResume);
router.post('/me/resumes/generate', generateAIResume);

export default router;
