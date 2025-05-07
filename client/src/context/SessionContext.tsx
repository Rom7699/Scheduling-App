// client/src/context/SessionContext.tsx
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { Session, SessionState } from "../types";
import { useAuth } from "./AuthContext";

interface SessionContextType extends SessionState {
  getSessions: () => Promise<void>;
  getSessionById: (id: string) => Promise<void>;
  createSession: (sessionData: Partial<Session>) => Promise<void>;
  updateSessionStatus: (
    id: string,
    status: Session["status"],
    reason?: string
  ) => Promise<void>;
  updateSessionTime: (
    id: string,
    startTime: Date,
    endTime: Date
  ) => Promise<void>;
  updateSessionPayment: (id: string) => Promise<void>; // Add this new method
  cancelSession: (
    id: string,
    cancelFutureSessions?: boolean,
    reason?: string
  ) => Promise<void>;
  deleteSession: (
    id: string,
    deleteAllRelated?: boolean,
    reason?: string
  ) => Promise<void>;
  getCalendarMonth: (
    year: number,
    month: number,
    includeCancelled?: boolean
  ) => Promise<void>;
  getCalendarWeek: (
    year: number,
    week: number,
    includeCancelled?: boolean
  ) => Promise<void>;
  getCalendarDay: (
    year: number,
    month: number,
    day: number,
    includeCancelled?: boolean
  ) => Promise<void>;
  clearSessionErrors: () => void;
}

// Initial state
const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

// Create context
const SessionContext = createContext<SessionContextType>({
  ...initialState,
  getSessions: async () => {},
  getSessionById: async () => {},
  createSession: async () => {},
  updateSessionStatus: async () => {},
  updateSessionTime: async () => {},
  updateSessionPayment: async () => {},
  cancelSession: async () => {},
  getCalendarMonth: async () => {},
  deleteSession: async () => {},
  getCalendarWeek: async () => {},
  getCalendarDay: async () => {},
  clearSessionErrors: () => {},
});

// Types for actions
type SessionAction =
  | { type: "GET_SESSIONS"; payload: Session[] }
  | { type: "GET_SESSION"; payload: Session }
  | { type: "CREATE_SESSION"; payload: Session }
  | { type: "UPDATE_SESSION"; payload: Session }
  | { type: "CANCEL_SESSION"; payload: Session }
  | { type: "DELETE_SESSION"; payload: string } // New action type
  | { type: "SESSION_ERROR"; payload: string }
  | { type: "SET_LOADING" }
  | { type: "CLEAR_ERRORS" };

// Reducer
const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case "GET_SESSIONS":
      return {
        ...state,
        sessions: action.payload,
        loading: false,
      };
    case "GET_SESSION":
      return {
        ...state,
        currentSession: action.payload,
        loading: false,
      };
    case "CREATE_SESSION":
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
        loading: false,
      };
    case "UPDATE_SESSION":
    case "CANCEL_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session._id === action.payload._id ? action.payload : session
        ),
        currentSession:
          state.currentSession?._id === action.payload._id
            ? action.payload
            : state.currentSession,
        loading: false,
      };
    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session._id !== action.payload
        ),
        currentSession:
          state.currentSession?._id === action.payload
            ? null
            : state.currentSession,
        loading: false,
      };
    case "SESSION_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const { token, user } = useAuth();

  // Set auth token for requests - memoize to prevent unnecessary re-renders
  const setAuthToken = useCallback(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Get all sessions
  const getSessions = async () => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get("/api/sessions");

      // Convert date strings to Date objects
      const sessions = res.data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        createdAt: new Date(session.createdAt),
        recurrenceEndDate: session.recurrenceEndDate
          ? new Date(session.recurrenceEndDate)
          : null,
      }));

      dispatch({
        type: "GET_SESSIONS",
        payload: sessions,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching sessions",
      });
    }
  };

  // Get a session by ID
  const getSessionById = async (id: string) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(`/api/sessions/${id}`);

      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };

      dispatch({
        type: "GET_SESSION",
        payload: session,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching session",
      });
    }
  };

  // Create new session
  const createSession = async (sessionData: Partial<Session>) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.post("/api/sessions", sessionData);

      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };

      dispatch({
        type: "CREATE_SESSION",
        payload: session,
      });

      // Automatically refresh the sessions list to get all recurring instances
      if (session.isRecurring) {
        getSessions();
      }
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error creating session",
      });
    }
  };

  const updateSessionStatus = async (
    id: string,
    status: Session["status"],
    reason?: string
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.put(`/api/sessions/${id}/status`, {
        status,
        reason, // Pass reason to API but it won't be stored in DB
      });

      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };

      dispatch({
        type: "UPDATE_SESSION",
        payload: session,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error updating session status",
      });
    }
  };

  // Update session time (can only be done by the session owner)
  const updateSessionTime = async (
    id: string,
    startTime: Date,
    endTime: Date
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.put(`/api/sessions/${id}/reschedule`, {
        startTime,
        endTime,
      });

      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };

      dispatch({
        type: "UPDATE_SESSION",
        payload: session,
      });

      return res.data.session;
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error updating session time",
      });
      throw err; // Rethrow for component handling
    }
  };

  // Update session payment status (admin only)
  const updateSessionPayment = async (id: string) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.put(`/api/sessions/${id}/payment`);
  
      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };
  
      dispatch({
        type: "UPDATE_SESSION",
        payload: session,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error updating payment status",
      });
    }
  };  

  // Cancel session with option for reason
  const cancelSession = async (
    id: string,
    cancelFutureSessions = false,
    reason?: string
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.delete(`/api/sessions/${id}`, {
        data: {
          cancelFutureSessions,
          reason, // Pass reason to API for email notification
        },
      });

      // Convert date strings to Date objects
      const session = {
        ...res.data.session,
        startTime: new Date(res.data.session.startTime),
        endTime: new Date(res.data.session.endTime),
        createdAt: new Date(res.data.session.createdAt),
        recurrenceEndDate: res.data.session.recurrenceEndDate
          ? new Date(res.data.session.recurrenceEndDate)
          : null,
      };

      dispatch({
        type: "CANCEL_SESSION",
        payload: session,
      });

      // If cancelling future occurrences, refresh sessions to update the UI
      if (cancelFutureSessions) {
        getSessions();
      }
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error cancelling session",
      });
    }
  };

  // Delete session with option for reason
  const deleteSession = async (
    id: string,
    deleteAllRelated = false,
    reason?: string
  ) => {
    // Only admins can delete sessions
    if (!user?.isAdmin) {
      dispatch({
        type: "SESSION_ERROR",
        payload: "Not authorized to delete sessions",
      });
      return;
    }

    setAuthToken();
    dispatch({ type: "SET_LOADING" });

    try {
      await axios.delete(`/api/sessions/${id}/permanent`, {
        data: {
          deleteAllRelated,
          reason, // Pass reason for email notification
        },
      });

      dispatch({
        type: "DELETE_SESSION",
        payload: id,
      });

      // If we're deleting all related sessions, refresh the session list
      if (deleteAllRelated) {
        getSessions();
      }
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error deleting session",
      });
    }
  };

  // Get sessions for a specific month with option to include cancelled sessions
  const getCalendarMonth = async (
    year: number,
    month: number,
    includeCancelled = false
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(
        `/api/sessions/calendar/month/${year}/${month}`,
        {
          params: { includeCancelled },
        }
      );

      // Convert date strings to Date objects
      const sessions = res.data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        createdAt: new Date(session.createdAt),
        recurrenceEndDate: session.recurrenceEndDate
          ? new Date(session.recurrenceEndDate)
          : null,
      }));

      dispatch({
        type: "GET_SESSIONS",
        payload: sessions,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching calendar data",
      });
    }
  };

  // Get sessions for a specific week with option to include cancelled sessions
  const getCalendarWeek = async (
    year: number,
    week: number,
    includeCancelled = false
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(
        `/api/sessions/calendar/week/${year}/${week}`,
        {
          params: { includeCancelled },
        }
      );

      // Convert date strings to Date objects
      const sessions = res.data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        createdAt: new Date(session.createdAt),
        recurrenceEndDate: session.recurrenceEndDate
          ? new Date(session.recurrenceEndDate)
          : null,
      }));

      dispatch({
        type: "GET_SESSIONS",
        payload: sessions,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching calendar data",
      });
    }
  };

  // Get sessions for a specific day with option to include cancelled sessions
  const getCalendarDay = async (
    year: number,
    month: number,
    day: number,
    includeCancelled = false
  ) => {
    setAuthToken();
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(
        `/api/sessions/calendar/day/${year}/${month}/${day}`,
        {
          params: { includeCancelled },
        }
      );

      // Convert date strings to Date objects
      const sessions = res.data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        createdAt: new Date(session.createdAt),
        recurrenceEndDate: session.recurrenceEndDate
          ? new Date(session.recurrenceEndDate)
          : null,
      }));

      dispatch({
        type: "GET_SESSIONS",
        payload: sessions,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching calendar data",
      });
    }
  };

  // Clear errors
  const clearSessionErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  return (
    <SessionContext.Provider
      value={{
        sessions: state.sessions,
        currentSession: state.currentSession,
        loading: state.loading,
        error: state.error,
        getSessions,
        getSessionById,
        createSession,
        updateSessionStatus,
        updateSessionTime, 
        updateSessionPayment,
        cancelSession,
        getCalendarMonth,
        deleteSession,
        getCalendarWeek,
        getCalendarDay,
        clearSessionErrors,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook
export const useSession = () => useContext(SessionContext);
