// server/src/controllers/sessionController.ts
import { Request, Response } from 'express';
import Session from '../models/Session';
import mongoose from 'mongoose';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      startTime, 
      endTime,
      isRecurring,
      recurrenceType,
      recurrenceEndDate
    } = req.body;
    
    // Create the initial (parent) session
    const initialSession = await Session.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      user: req.user?._id,
      status: 'pending',
      isRecurring,
      recurrenceType: isRecurring ? recurrenceType : null,
      recurrenceEndDate: isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate) : null
    });
    
    // If this is a recurring session, create the child sessions
    if (isRecurring && recurrenceType && recurrenceEndDate) {
      await createRecurringSessions(
        initialSession._id,
        new Date(startTime),
        new Date(endTime),
        recurrenceType,
        new Date(recurrenceEndDate),
        req.user?._id,
        title,
        description
      );
    }
    
    res.status(201).json({
      success: true,
      session: initialSession
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to create recurring sessions
const createRecurringSessions = async (
  parentId: mongoose.Types.ObjectId,
  startTime: Date,
  endTime: Date,
  recurrenceType: string,
  recurrenceEndDate: Date,
  userId: mongoose.Types.ObjectId | undefined,
  title: string,
  description: string
) => {
  // Calculate the time difference between startTime and endTime
  const durationMs = endTime.getTime() - startTime.getTime();
  
  // Calculate interval based on recurrence type
  let intervalDays = 0;
  switch (recurrenceType) {
    case 'weekly':
      intervalDays = 7;
      break;
    case 'biweekly':
      intervalDays = 14;
      break;
    case 'monthly':
      // For monthly, we'll use the same day of the month
      intervalDays = 0; // This will be handled differently
      break;
    default:
      throw new Error('Invalid recurrence type');
  }
  
  const sessions = [];
  let currentStartTime = new Date(startTime);
  
  // Create recurring sessions until the end date
  while (true) {
    // Calculate the next occurrence
    if (recurrenceType === 'monthly') {
      // For monthly recurrence, move to the same day in the next month
      currentStartTime = new Date(currentStartTime);
      currentStartTime.setMonth(currentStartTime.getMonth() + 1);
    } else {
      // For weekly and biweekly, add the appropriate number of days
      currentStartTime = new Date(currentStartTime);
      currentStartTime.setDate(currentStartTime.getDate() + intervalDays);
    }
    
    // Stop if we've passed the recurrence end date
    if (currentStartTime > recurrenceEndDate) {
      break;
    }
    
    // Calculate the corresponding end time
    const currentEndTime = new Date(currentStartTime.getTime() + durationMs);
    
    // Create the recurring session
    sessions.push({
      title,
      description,
      startTime: currentStartTime,
      endTime: currentEndTime,
      user: userId,
      status: 'pending',
      isRecurring: true,
      recurrenceType,
      recurrenceEndDate,
      parentSessionId: parentId
    });
  }
  
  // Bulk insert all the recurring sessions
  if (sessions.length > 0) {
    await Session.insertMany(sessions);
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const query = req.user?.isAdmin ? {} : { user: req.user?._id };
    const sessions = await Session.find(query).populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id).populate('user', 'name email');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is authorized to view this session
    if (!req.user?.isAdmin && session.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this session' });
    }
    
    res.status(200).json({
      success: true,
      session
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.status = status;
    await session.save();
    
    res.status(200).json({
      success: true,
      session
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelSession = async (req: Request, res: Response) => {
  try {
    const { cancelFutureSessions } = req.body;
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is authorized to cancel this session
    if (!req.user?.isAdmin && session.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this session' });
    }
    
    // Cancel the current session
    session.status = 'cancelled';
    await session.save();
    
    // If this is a recurring session and user wants to cancel future occurrences
    if (session.isRecurring && cancelFutureSessions) {
      if (session.parentSessionId) {
        // This is a child session of a recurring series, cancel all future occurrences
        const currentDate = session.startTime;
        await Session.updateMany(
          { 
            parentSessionId: session.parentSessionId,
            startTime: { $gte: currentDate }
          },
          { status: 'cancelled' }
        );
      } else {
        // This is a parent session, cancel all its children
        await Session.updateMany(
          { parentSessionId: session._id },
          { status: 'cancelled' }
        );
      }
    }
    
    res.status(200).json({
      success: true,
      session
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCalendarMonth = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    
    const query = {
      startTime: { $gte: startDate, $lte: endDate },
      ...(req.user?.isAdmin ? {} : { status: 'approved' })
    };
    
    const sessions = await Session.find(query).populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCalendarWeek = async (req: Request, res: Response) => {
  try {
    const { year, week } = req.params;
    
    // Calculate the first day of the given week
    const firstDayOfYear = new Date(parseInt(year), 0, 1);
    const dayOffset = firstDayOfYear.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Calculate the first day of the week (assuming week 1 is the week containing Jan 1)
    const startDate = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7 - dayOffset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    const query = {
      startTime: { $gte: startDate, $lte: endDate },
      ...(req.user?.isAdmin ? {} : { status: 'approved' })
    };
    
    const sessions = await Session.find(query).populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCalendarDay = async (req: Request, res: Response) => {
  try {
    const { year, month, day } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
    
    const query = {
      startTime: { $gte: startDate, $lte: endDate },
      ...(req.user?.isAdmin ? {} : { status: 'approved' })
    };
    
    const sessions = await Session.find(query).populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};