// client/src/pages/AdminPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from '../context/SessionContext';
import moment from 'moment';
import SessionModal from '../components/Calendar/SessionModal';
import { Session, User } from '../types';

const AdminPage: React.FC = () => {
  const { 
    sessions, 
    users,
    getCalendarMonth, 
    getAllUsers,
    updateSessionPayment, 
    loading, 
    error 
  } = useSession();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Add state for current month/year
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());

  // Load sessions for the current month when component mounts or month changes
  useEffect(() => {
    loadSessionsForMonth(currentDate.year(), currentDate.month() + 1);
    
    // Fetch all users once when the component mounts
    if (users.length === 0) {
      getAllUsers();
    }
  }, [currentDate]);

  // Function to load sessions for a specific month
  const loadSessionsForMonth = (year: number, month: number) => {
    getCalendarMonth(year, month, true); // true to include cancelled sessions
  };

  // Functions to navigate between months
  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(moment());
  };

  // Get sorted and filtered users for dropdown
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);
  
  // Filter sessions based on selected filters
  const filteredSessions = sessions
    // Filter by status
    .filter(session => filter === 'all' ? true : session.status === filter)
    // Filter by payment status
    .filter(session => {
      if (paymentFilter === 'all') return true;
      return paymentFilter === 'paid' ? session.isPaid : !session.isPaid;
    })
    // Filter by user
    .filter(session => {
      if (userFilter === 'all') return true;
      if (typeof session.user === 'string') return false;
      return session.user.id === userFilter;
    })
    // Filter by search query (user name or session title)
    .filter(session => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const title = session.title.toLowerCase();
      const userName = typeof session.user !== 'string' 
        ? session.user.name.toLowerCase() 
        : '';
        
      return title.includes(query) || userName.includes(query);
    });

  // Handle session click
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  // Handle payment toggle
  const handlePaymentToggle = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    
    try {
      await updateSessionPayment(sessionId);
      // We don't need to call getSessions() because the context already updates the state
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
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-0">
                  Sessions for {currentDate.format('MMMM YYYY')}
                </h5>
                <div className="btn-group">
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={goToPreviousMonth}
                    title="Previous Month"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={goToCurrentMonth}
                    title="Current Month"
                  >
                    Today
                  </button>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={goToNextMonth}
                    title="Next Month"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              {/* Search bar for filtering by name or title */}
              <div className="input-group mb-3 mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by user name or session title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              {/* User filter dropdown */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="userFilter" className="form-label">Filter by User:</label>
                  <select 
                    className="form-select"
                    id="userFilter"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    {sortedUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
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
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
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
                          <td colSpan={7} className="text-center">
                            No sessions found for {currentDate.format('MMMM YYYY')}
                          </td>
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
            <div className="card-footer text-muted">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {userFilter !== 'all' && (
                    <span className="badge bg-info me-2">
                      User: {users.find(u => u.id === userFilter)?.name || 'Unknown'}
                      <button 
                        className="btn btn-sm ms-2 p-0 text-white" 
                        title="Clear user filter"
                        onClick={() => setUserFilter('all')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  )}
                  Total displayed sessions: {filteredSessions.length}
                </div>
                <div>
                  {currentDate.format('MMMM YYYY')}
                </div>
              </div>
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
            // Refresh sessions for the current month
            loadSessionsForMonth(currentDate.year(), currentDate.month() + 1);
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;