// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashBoardPage';
import AdminPage from './pages/AdminPage';
import axios from 'axios';
import './index.css';

const apiUrl = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_PRODUCTION_URL
  : import.meta.env.VITE_API_DEVELOPMENT_URL;

axios.defaults.baseURL = apiUrl || 'http://localhost:5500';
console.log(`Running in ${import.meta.env.MODE} mode with API URL: ${axios.defaults.baseURL}`);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </SessionProvider>
    </AuthProvider>
  );
};

export default App;