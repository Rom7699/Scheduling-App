// client/src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import moment from 'moment';
import SessionModal from '../components/Calendar/SessionModal';
import { Session } from '../types';

const AdminPage: React.FC = () => {
  const { sessions, getSessions, updateSessionPayment, loading, error } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  useEffect(() => {
    getSessions();
  }, []);

  // Filter sessions based on selected filter
  const filteredSessions = sessions
    .filter(session => filter === 'all' ? true : session.status === filter)
    .filter(session => {
      if (paymentFilter === 'all') return true;
      return paymentFilter === 'paid' ? session.isPaid : !session.isPaid;
    });

  // Handle session click
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  // Handle payment toggle
  const handlePaymentToggle = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    console.log("Toggling payment for session:", sessionId);

    try {
      await updateSessionPayment(sessionId);
      console.log("Payment updated successfully");
      // Refresh the sessions list to show updated payment status
      await getSessions();
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
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
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="btn-group mb-2 me-3">
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
                
                <div className="btn-group mb-2">
                  <button 
                    className={`btn ${paymentFilter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setPaymentFilter('all')}
                  >
                    All Payments
                  </button>
                  <button 
                    className={`btn ${paymentFilter === 'paid' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setPaymentFilter('paid')}
                  >
                    Paid
                  </button>
                  <button 
                    className={`btn ${paymentFilter === 'unpaid' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setPaymentFilter('unpaid')}
                  >
                    Unpaid
                  </button>
                </div>
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
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.length === 0 ? (
                        <tr>
                          <td colSpan={7}>No sessions found</td>
                        </tr>
                      ) : (
                        filteredSessions.map(session => (
                          <tr key={session._id} onClick={() => handleSessionClick(session)} style={{ cursor: 'pointer' }}>
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
                            <td onClick={(e) => e.stopPropagation()}>
                              <button 
                                className={`btn btn-sm ${session.isPaid ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={(e) => handlePaymentToggle(session._id, e)}
                                disabled={session.status !== 'approved'}
                                title={session.status !== 'approved' ? 'Session must be approved to mark as paid' : ''}
                              >
                                {session.isPaid ? (
                                  <><i className="fas fa-check-circle me-1"></i>Paid</>
                                ) : (
                                  <><i className="fas fa-dollar-sign me-1"></i>Mark Paid</>
                                )}
                              </button>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionClick(session);
                                }}
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