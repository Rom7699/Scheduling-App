// server/src/models/Session.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a session title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Session must belong to a user']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that endTime is after startTime
SessionSchema.pre('save', function(this: ISession, next) {
  if (this.endTime <= this.startTime) {
    throw new Error('End time must be after start time');
  }
  
  // Validate that session is in current or next month only
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
  
  if (this.startTime < startOfCurrentMonth || this.startTime > endOfNextMonth) {
    throw new Error('Sessions can only be scheduled for the current or next month');
  }
  
  next();
});

export default mongoose.model<ISession>('Session', SessionSchema);