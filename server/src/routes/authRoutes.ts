import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);

export default router;