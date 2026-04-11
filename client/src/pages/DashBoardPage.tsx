// client/src/pages/DashboardPage.tsx
import React, { useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";
import CalendarView from "../components/Calendar/CalendarView";
import PaymentSummary from "../components/DashBoard/PaymentSummary";
import "./DashBoardPage.css";

const DashboardPage: React.FC = () => {
  const { sessions, getSessions, loading, error } = useSession();
  const { user } = useAuth();

  useEffect(() => {
    getSessions();
  }, [getSessions]);

  const handleRetry = () => {
    getSessions();
  };

  // Filter sessions by status
  const pendingSessions = sessions.filter(
    (session) => session.status === "pending"
  );
  const approvedSessions = sessions.filter(
    (session) => session.status === "approved"
  );
  const rejectedSessions = sessions.filter(
    (session) => session.status === "rejected"
  );

  const renderSessionsArea = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your sessions…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <div className="error-state-icon">⚠️</div>
          <h3 className="error-state-title">Something went wrong</h3>
          <p className="error-state-message">
            We couldn't load your sessions. Please check your connection and try again.
          </p>
          <button className="btn btn-primary retry-btn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No sessions yet</h3>
          <p className="empty-state-message">
            You don't have any scheduled sessions. Book your first session to get started.
          </p>
          <a href="/home" className="btn btn-primary">
            Book your first session
          </a>
        </div>
      );
    }

    return <CalendarView />;
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="dashboard-title">
                Welcome back, <span className="text-gradient">{user?.name}</span>!
              </h1>
              <p className="dashboard-subtitle">
                Manage your sessions and schedule new ones with ease.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stat-card stat-card-warning">
              <div className="stat-card-icon">
                <span>⏳</span>
              </div>
              <div className="stat-card-content">
                <h3 className="stat-card-number">{pendingSessions.length}</h3>
                <p className="stat-card-label">Pending Sessions</p>
                <p className="stat-card-description">Awaiting approval</p>
              </div>
              <div className="stat-card-decoration"></div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card stat-card-success">
              <div className="stat-card-icon">
                <span>✓</span>
              </div>
              <div className="stat-card-content">
                <h3 className="stat-card-number">{approvedSessions.length}</h3>
                <p className="stat-card-label">Approved Sessions</p>
                <p className="stat-card-description">Ready to go</p>
              </div>
              <div className="stat-card-decoration"></div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card stat-card-danger">
              <div className="stat-card-icon">
                <span>✕</span>
              </div>
              <div className="stat-card-content">
                <h3 className="stat-card-number">{rejectedSessions.length}</h3>
                <p className="stat-card-label">Rejected Sessions</p>
                <p className="stat-card-description">Not approved</p>
              </div>
              <div className="stat-card-decoration"></div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="dashboard-card calendar-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="card-title-icon">📅</span>
                  Your Schedule
                </h2>
                <p className="dashboard-card-subtitle">
                  View and manage your upcoming sessions
                </p>
              </div>
              <div className="dashboard-card-body">
                {renderSessionsArea()}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Section */}
        {!loading && !error && sessions.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <PaymentSummary sessions={sessions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
