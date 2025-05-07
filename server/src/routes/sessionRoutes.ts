import express from 'express';
import { 
  createSession, 
  getSessions, 
  getSessionById, 
  updateSessionStatus, 
  cancelSession,
  deleteSession,  
  getCalendarMonth,
  getCalendarWeek,
  getCalendarDay,
  updateSessionTime,
  updateSessionPayment 
} from '../controllers/sessionController';
import { auth, adminOnly } from '../middleware/auth';

const router = express.Router();

// Session routes
router.post('/', auth, createSession);
router.get('/', auth, getSessions);
router.get('/:id', auth, getSessionById);
router.put('/:id/status', auth, adminOnly, updateSessionStatus);
router.put('/:id/reschedule', auth, updateSessionTime); // New route for updating session time
router.put('/:id/payment', auth, adminOnly, updateSessionPayment); // New route for updating session payment status
router.delete('/:id', auth, cancelSession); 
router.delete('/:id/permanent', auth, adminOnly, deleteSession); // New route for permanent deletion

// Calendar routes
router.get('/calendar/month/:year/:month', auth, getCalendarMonth);
router.get('/calendar/week/:year/:week', auth, getCalendarWeek);
router.get('/calendar/day/:year/:month/:day', auth, getCalendarDay);

export default router;