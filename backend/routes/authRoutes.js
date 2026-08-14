import { Router } from 'express';
import { getCurrentUser, login, loginAdmin, loginCompany, logout, register, registerCompany } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/company/register', registerCompany);
router.post('/company/login', loginCompany);
router.post('/admin/login', loginAdmin);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', logout);
export default router;
