import express from 'express';
import { 
  createSession, 
  getSessions, 
  getSessionById, 
  updateSessionStatus, 
  cancelSession,
  getCalendarMonth,
  getCalendarWeek,
  getCalendarDay
} from '../controllers/sessionController';
import { auth, adminOnly } from '../middleware/auth';

const router = express.Router();

// Session routes
router.post('/', auth, createSession);
router.get('/', auth, getSessions);
router.get('/:id', auth, getSessionById);
router.put('/:id/status', auth, adminOnly, updateSessionStatus);
router.delete('/:id', auth, cancelSession); // No change needed here, we'll handle the cancellation option in the controller

// Calendar routes
router.get('/calendar/month/:year/:month', auth, getCalendarMonth);
router.get('/calendar/week/:year/:week', auth, getCalendarWeek);
router.get('/calendar/day/:year/:month/:day', auth, getCalendarDay);

export default router;