// client/src/context/AuthContext.tsx
import React, { createContext, useReducer, useContext, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Create context
const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearErrors: () => {}
});

// Types for actions
type AuthAction =
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' | 'LOGIN_FAIL' | 'REGISTER_FAIL' | 'LOGOUT'; payload?: string }
  | { type: 'CLEAR_ERRORS' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload || null
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
        try {
          const res = await axios.get('/api/auth/me');
          dispatch({
            type: 'USER_LOADED',
            payload: res.data.user
          });
        } catch (err) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
  
    loadUser();
  }, []); // Empty dependency array is correct here

  // Register user - memoized
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed'
      });
    }
  }, []);

  // Login user - memoized
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed'
      });
    }
  }, []);

  // Logout - memoized
  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Clear errors - memoized
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  // Only include state values in dependencies - memoized functions never change
  const contextValue = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      register,
      login,
      logout,
      clearErrors
    }),
    [state.user, state.token, state.isAuthenticated, state.loading, state.error]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);