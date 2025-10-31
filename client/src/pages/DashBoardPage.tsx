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

        {error && (
          <div className="alert alert-danger rounded-warm mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

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
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your sessions...</p>
                  </div>
                ) : (
                  <CalendarView />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Section */}
        <div className="row mb-5">
          <div className="col-12">
            <PaymentSummary sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
