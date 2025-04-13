// server/src/controllers/sessionController.ts
import { Request, Response } from 'express';
import Session from '../models/Session';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    
    const session = await Session.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      user: req.user?._id,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      session
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is authorized to cancel this session
    if (!req.user?.isAdmin && session.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this session' });
    }
    
    session.status = 'cancelled';
    await session.save();
    
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