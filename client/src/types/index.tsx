// client/src/types/index.ts

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Session interface
export interface Session {
  _id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  user: User | string; 
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  isPaid: boolean; 
  createdAt: Date;
  isRecurring?: boolean;
  recurrenceType?: 'weekly' | 'biweekly' | 'monthly' | null;
  recurrenceEndDate?: Date | null;
  parentSessionId?: string | null;
}

// Auth Context State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Session Context State
export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  error: string | null;
}

// You might also want to include form input types for your forms
export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SessionFormInputs {
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  isRecurring?: boolean;
  recurrenceType?: 'weekly' | 'biweekly' | 'monthly';
  recurrenceEndDate?: string | Date;
}

// Calendar event type for React Big Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: Session['status'];
  isPaid: boolean; // Add payment status to calendar events
  resource: Session;
  isRecurring?: boolean;
}