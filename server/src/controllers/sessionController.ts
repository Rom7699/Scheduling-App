import { Request, Response } from "express";
import Session from "../models/Session";
import User from "../models/User";
import mongoose from "mongoose";
import { sendSessionStatusEmail } from "../services/emailService";

export const createSession = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      isRecurring,
      recurrenceType,
      recurrenceEndDate,
    } = req.body;

    // Create the initial (parent) session
    const initialSession = await Session.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      user: req.user?._id,
      status: "pending",
      isRecurring,
      recurrenceType: isRecurring ? recurrenceType : null,
      recurrenceEndDate:
        isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate) : null,
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
      session: initialSession,
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
    case "weekly":
      intervalDays = 7;
      break;
    case "biweekly":
      intervalDays = 14;
      break;
    case "monthly":
      // For monthly, we'll use the same day of the month
      intervalDays = 0; // This will be handled differently
      break;
    default:
      throw new Error("Invalid recurrence type");
  }

  const sessions = [];
  let currentStartTime = new Date(startTime);

  // Create recurring sessions until the end date
  while (true) {
    // Calculate the next occurrence
    if (recurrenceType === "monthly") {
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
      status: "pending",
      isRecurring: true,
      recurrenceType,
      recurrenceEndDate,
      parentSessionId: parentId,
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
    const sessions = await Session.find(query).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is authorized to view this session
    if (
      !req.user?.isAdmin &&
      session.user.toString() !== req.user?._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this session" });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    const { status, reason } = req.body;

    if (!["pending", "approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Update session fields (we don't store the reason)
    session.status = status;
    session.statusUpdatedAt = new Date();
    session.statusUpdatedBy = req.user?._id;
    
    await session.save();

    // Send email notification to the user about the status change
    try {
      // Get the user's email
      const userDoc = await User.findById(session.user);
      
      if (userDoc && userDoc.email) {
        // Send the status update email (include reason in email only)
        await sendSessionStatusEmail(
          userDoc.email,
          userDoc.name,
          session.title,
          status as 'approved' | 'rejected' | 'cancelled',
          session.startTime,
          reason // Pass the reason to the email but don't store it
        );
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelSession = async (req: Request, res: Response) => {
  try {
    const { cancelFutureSessions, reason } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user is authorized to cancel this session
    if (
      !req.user?.isAdmin &&
      session.user.toString() !== req.user?._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this session" });
    }

    // Cancel the current session (without storing reason)
    session.status = "cancelled";
    session.statusUpdatedAt = new Date();
    session.statusUpdatedBy = req.user?._id;
    
    await session.save();

    // If this is a recurring session and user wants to cancel future occurrences
    if (session.isRecurring && cancelFutureSessions) {
      if (session.parentSessionId) {
        // This is a child session of a recurring series, cancel all future occurrences
        const currentDate = session.startTime;
        await Session.updateMany(
          {
            parentSessionId: session.parentSessionId,
            startTime: { $gte: currentDate },
          },
          { 
            status: "cancelled",
            statusUpdatedAt: new Date(),
            statusUpdatedBy: req.user?._id
          }
        );
      } else {
        // This is a parent session, cancel all its children
        await Session.updateMany(
          { parentSessionId: session._id },
          { 
            status: "cancelled",
            statusUpdatedAt: new Date(),
            statusUpdatedBy: req.user?._id
          }
        );
      }
    }

    // Send email notification to the user about the cancellation
    try {
      // Get the user's email
      const userDoc = await User.findById(session.user);
      
      if (userDoc && userDoc.email) {
        // Send the cancellation email (include reason in email only)
        await sendSessionStatusEmail(
          userDoc.email,
          userDoc.name,
          session.title,
          'cancelled',
          session.startTime,
          reason // Pass reason to email but don't store it
        );
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Permanently delete a session (admin only)
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { deleteAllRelated, reason } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only admins can permanently delete sessions
    if (!req.user?.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete sessions" });
    }

    // Store session information for notification before deleting
    const sessionInfo = {
      title: session.title,
      startTime: session.startTime,
      userId: session.user
    };

    // Delete the current session
    await Session.findByIdAndDelete(req.params.id);

    // If this is a recurring session and admin wants to delete all related sessions
    if (deleteAllRelated) {
      if (session.parentSessionId) {
        // This is a child session, delete all sessions with the same parent
        await Session.deleteMany({ parentSessionId: session.parentSessionId });
        // Also delete the parent if requested
        await Session.findByIdAndDelete(session.parentSessionId);
      } else if (session.isRecurring) {
        // This is a parent session, delete all its children
        await Session.deleteMany({ parentSessionId: session._id });
      }
    }

    // Notify the user that their session has been deleted
    try {
      const userDoc = await User.findById(sessionInfo.userId);
      
      if (userDoc && userDoc.email) {
        await sendSessionStatusEmail(
          userDoc.email,
          userDoc.name,
          sessionInfo.title,
          'cancelled', // Use cancelled status for deletion notification
          sessionInfo.startTime,
          reason || "This session has been permanently deleted by an administrator."
        );
      }
    } catch (emailError) {
      console.error('Error sending deletion notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: "Session(s) permanently deleted",
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
      ...(req.user?.isAdmin ? {} : { status: "approved" }),
    };

    const sessions = await Session.find(query).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
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
    const startDate = new Date(
      parseInt(year),
      0,
      1 + (parseInt(week) - 1) * 7 - dayOffset
    );
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const query = {
      startTime: { $gte: startDate, $lte: endDate },
      ...(req.user?.isAdmin ? {} : { status: "approved" }),
    };

    const sessions = await Session.find(query).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCalendarDay = async (req: Request, res: Response) => {
  try {
    const { year, month, day } = req.params;
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const endDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      23,
      59,
      59
    );

    const query = {
      startTime: { $gte: startDate, $lte: endDate },
      ...(req.user?.isAdmin ? {} : { status: "approved" }),
    };

    const sessions = await Session.find(query).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};