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
  // New recurrence fields
  isRecurring: boolean;
  recurrenceType: 'weekly' | 'biweekly' | 'monthly' | null;
  recurrenceEndDate: Date | null;
  parentSessionId: mongoose.Types.ObjectId | null; // Links child sessions to their parent
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
  },
  // New recurrence fields
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceType: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', null],
    default: null
  },
  recurrenceEndDate: {
    type: Date,
    default: null
  },
  parentSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null
  }
});

// Validate that endTime is after startTime
SessionSchema.pre('save', function(this: ISession, next) {
  if (this.endTime <= this.startTime) {
    throw new Error('End time must be after start time');
  }
  
  // Validate that session is in current or next month only
  // We'll modify this validation for recurring events
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
  
  if (this.startTime < startOfCurrentMonth || 
      (!this.isRecurring && this.startTime > endOfNextMonth)) {
    throw new Error('Sessions can only be scheduled for the current or next month');
  }
  
  // For recurring events, validate that recurrenceEndDate is after startTime and within a reasonable timeframe
  if (this.isRecurring && this.recurrenceEndDate) {
    if (this.recurrenceEndDate <= this.startTime) {
      throw new Error('Recurrence end date must be after the start time');
    }
    
    // Limit recurring events to one year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (this.recurrenceEndDate > oneYearFromNow) {
      throw new Error('Recurring events cannot be scheduled more than one year in advance');
    }
  }
  
  next();
});

export default mongoose.model<ISession>('Session', SessionSchema);