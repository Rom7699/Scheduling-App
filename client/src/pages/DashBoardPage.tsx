// client/src/pages/DashboardPage.tsx
import React, { useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";
import CalendarView from "../components/Calendar/CalendarView";
import PaymentSummary from "../components/DashBoard/PaymentSummary";

const DashboardPage: React.FC = () => {
  const { sessions, getSessions, loading, error } = useSession();
  const { user } = useAuth();

  useEffect(() => {
    getSessions();
  }, []);

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
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Welcome, {user?.name}</h1>
          <p>Manage your sessions and schedule new ones.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Pending Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{pendingSessions.length}</h5>
              <p className="card-text">Sessions awaiting approval</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Approved Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{approvedSessions.length}</h5>
              <p className="card-text">Sessions ready to go</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Rejected Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{rejectedSessions.length}</h5>
              <p className="card-text">Sessions not approved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <CalendarView />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="row">
        <div className="col-12">
          <PaymentSummary sessions={sessions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
