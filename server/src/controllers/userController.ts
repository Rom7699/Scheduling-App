import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Only admins can access the full list of users
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access user list' });
    }

    // Get all users - exclude sensitive fields like password
    const users = await User.find().select('-password');
    
    // Transform users to match the expected format in the frontend
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      users: transformedUsers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};