// client/src/context/SessionContext.tsx
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { Session, SessionState, User } from "../types";
import { useAuth } from "./AuthContext";

interface SessionContextType extends SessionState {
  getSessions: () => Promise<void>;
  getSessionById: (id: string) => Promise<void>;
  getAllUsers: () => Promise<void>;
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
  updateSessionPayment: (id: string) => Promise<void>;
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

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  users: [],
  loading: false,
  error: null,
};

// Create context
const SessionContext = createContext<SessionContextType>({
  ...initialState,
  getSessions: async () => {},
  getSessionById: async () => {},
  getAllUsers: async () => {},
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
  | { type: "GET_USERS"; payload: User[] }
  | { type: "CREATE_SESSION"; payload: Session }
  | { type: "UPDATE_SESSION"; payload: Session }
  | { type: "CANCEL_SESSION"; payload: Session }
  | { type: "DELETE_SESSION"; payload: string }
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
    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
        loading: false,
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

  // Sync auth token with axios - only runs when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Get all sessions - memoized to prevent infinite loops
  const getSessions = useCallback(async () => {
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
      console.error("Error fetching sessions:", err);
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching sessions",
      });
    }
  }, []);

  // Get a session by ID - memoized
  const getSessionById = useCallback(async (id: string) => {
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
  }, []);

  // Get all users - memoized
  const getAllUsers = useCallback(async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get("/api/users");

      dispatch({
        type: "GET_USERS",
        payload: res.data.users,
      });
    } catch (err: any) {
      dispatch({
        type: "SESSION_ERROR",
        payload: err.response?.data?.message || "Error fetching users",
      });
    }
  }, []);

  // Create new session - memoized to prevent infinite loops
  const createSession = useCallback(
    async (sessionData: Partial<Session>) => {
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

        // Always refresh the sessions list after creating to get the updated calendar
        // This handles both single and recurring sessions
        await getSessions();
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload: err.response?.data?.message || "Error creating session",
        });
      }
    },
    [getSessions]
  );

  // Update session status - memoized
  const updateSessionStatus = useCallback(
    async (id: string, status: Session["status"], reason?: string) => {
      dispatch({ type: "SET_LOADING" });
      try {
        const res = await axios.put(`/api/sessions/${id}/status`, {
          status,
          reason, // Pass reason to API but it won't be stored in DB
        });

        // Refresh sessions to ensure calendar shows updated status
        await getSessions();
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload:
            err.response?.data?.message || "Error updating session status",
        });
      }
    },
    [getSessions]
  );

  // Update session time (can only be done by the session owner) - memoized
  const updateSessionTime = useCallback(
    async (id: string, startTime: Date, endTime: Date) => {
      dispatch({ type: "SET_LOADING" });
      try {
        const res = await axios.put(`/api/sessions/${id}/reschedule`, {
          startTime,
          endTime,
        });

        // Refresh sessions to ensure calendar shows updated time
        await getSessions();

        return res.data.session;
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload: err.response?.data?.message || "Error updating session time",
        });
        throw err; // Rethrow for component handling
      }
    },
    [getSessions]
  );

  // Update session payment status (admin only) - memoized
  const updateSessionPayment = useCallback(
    async (id: string) => {
      dispatch({ type: "SET_LOADING" });
      try {
        const res = await axios.put(`/api/sessions/${id}/payment`);

        // Refresh sessions to ensure calendar shows updated payment status
        await getSessions();
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload:
            err.response?.data?.message || "Error updating payment status",
        });
      }
    },
    [getSessions]
  );

  // Cancel session with option for reason - memoized
  const cancelSession = useCallback(
    async (id: string, cancelFutureSessions = false, reason?: string) => {
      dispatch({ type: "SET_LOADING" });
      try {
        const res = await axios.delete(`/api/sessions/${id}`, {
          data: {
            cancelFutureSessions,
            reason, // Pass reason to API for email notification
          },
        });

        // Always refresh sessions to ensure calendar is up-to-date
        await getSessions();
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload: err.response?.data?.message || "Error cancelling session",
        });
      }
    },
    [getSessions]
  );

  // Delete session with option for reason - memoized
  const deleteSession = useCallback(
    async (id: string, deleteAllRelated = false, reason?: string) => {
      // Only admins can delete sessions
      if (!user?.isAdmin) {
        dispatch({
          type: "SESSION_ERROR",
          payload: "Not authorized to delete sessions",
        });
        return;
      }

      dispatch({ type: "SET_LOADING" });

      try {
        await axios.delete(`/api/sessions/${id}/permanent`, {
          data: {
            deleteAllRelated,
            reason, // Pass reason for email notification
          },
        });

        // Always refresh sessions to ensure calendar is up-to-date
        await getSessions();
      } catch (err: any) {
        dispatch({
          type: "SESSION_ERROR",
          payload: err.response?.data?.message || "Error deleting session",
        });
      }
    },
    [getSessions, user?.isAdmin]
  );

  // Get sessions for a specific month with option to include cancelled sessions - memoized
  const getCalendarMonth = useCallback(async (
    year: number,
    month: number,
    includeCancelled = false
  ) => {
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
  }, []);

  // Get sessions for a specific week with option to include cancelled sessions - memoized
  const getCalendarWeek = useCallback(async (
    year: number,
    week: number,
    includeCancelled = false
  ) => {
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
  }, []);

  // Get sessions for a specific day with option to include cancelled sessions - memoized
  const getCalendarDay = useCallback(async (
    year: number,
    month: number,
    day: number,
    includeCancelled = false
  ) => {
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
  }, []);

  // Clear errors - memoized
  const clearSessionErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" });
  }, []);

  // Memoize context value to prevent infinite re-renders
  // Only include state values in dependencies - memoized functions never change
  const contextValue = useMemo(
    () => ({
      sessions: state.sessions,
      currentSession: state.currentSession,
      users: state.users,
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
      getAllUsers,
    }),
    [
      state.sessions,
      state.currentSession,
      state.users,
      state.loading,
      state.error,
    ]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook
export const useSession = () => useContext(SessionContext);
