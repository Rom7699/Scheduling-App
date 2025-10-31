// server/src/routes/userRoutes.ts
import express from 'express';
import { getAllUsers } from '../controllers/userController';
import { auth, adminOnly } from '../middleware/auth';

const router = express.Router();

// Get all users - admin only
router.get('/', auth, adminOnly, getAllUsers);

export default router;