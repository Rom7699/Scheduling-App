// client/src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import moment from 'moment';
import SessionModal from '../components/Calendar/SessionModal';
import { Session } from '../types';

const AdminPage: React.FC = () => {
  const { sessions, getSessions, loading, error } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');

  useEffect(() => {
    getSessions();
  }, []);

  // Filter sessions based on selected filter
  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(session => session.status === filter);

  // Handle session click
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Admin Dashboard</h1>
          <p>Manage and approve session requests.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Session Requests</h5>
              <div className="btn-group">
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('approved')}
                >
                  Approved
                </button>
                <button 
                  className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('rejected')}
                >
                  Rejected
                </button>
                <button 
                  className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>User</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.length === 0 ? (
                        <tr>
                          <td colSpan={6}>No sessions found</td>
                        </tr>
                      ) : (
                        filteredSessions.map(session => (
                          <tr key={session._id}>
                            <td>{session.title}</td>
                            <td>
                              {typeof session.user !== 'string' ? session.user.name : 'Unknown User'}
                            </td>
                            <td>{moment(session.startTime).format('MMM D, YYYY h:mm A')}</td>
                            <td>{moment(session.endTime).format('MMM D, YYYY h:mm A')}</td>
                            <td>
                              <span className={`badge ${
                                session.status === 'approved' ? 'bg-success' :
                                session.status === 'pending' ? 'bg-warning' :
                                session.status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => handleSessionClick(session)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSession(null);
            // Refresh sessions list
            getSessions();
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;