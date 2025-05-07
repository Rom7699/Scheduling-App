// client/src/components/Dashboard/PaymentSummary.tsx
import React, { useMemo } from 'react';
import { Session } from '../../types';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

interface PaymentSummaryProps {
  sessions: Session[];
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ sessions }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  // Only consider approved sessions for payment tracking
  const approvedSessions = sessions.filter(session => session.status === 'approved');
  
  // Get stats for current month
  const currentMonthStats = useMemo(() => {
    const now = moment();
    const currentMonthSessions = approvedSessions.filter(session => 
      moment(session.startTime).isSame(now, 'month')
    );
    
    const totalSessions = currentMonthSessions.length;
    const paidSessions = currentMonthSessions.filter(session => session.isPaid).length;
    const unpaidSessions = totalSessions - paidSessions;
    
    return {
      totalSessions,
      paidSessions,
      unpaidSessions,
      paidPercentage: totalSessions > 0 ? Math.round((paidSessions / totalSessions) * 100) : 0
    };
  }, [approvedSessions]);

  // For admins, calculate overall payment stats
  const overallStats = useMemo(() => {
    if (!isAdmin) return null;
    
    const totalSessions = approvedSessions.length;
    const paidSessions = approvedSessions.filter(session => session.isPaid).length;
    const unpaidSessions = totalSessions - paidSessions;
    
    // Get user statistics
    const userMap = new Map();
    
    approvedSessions.forEach(session => {
      const userId = typeof session.user === 'string' ? session.user : session.user.id;
      const userName = typeof session.user === 'string' ? 'Unknown User' : session.user.name;
      
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          name: userName,
          totalSessions: 0,
          paidSessions: 0,
          unpaidSessions: 0
        });
      }
      
      const userStats = userMap.get(userId);
      userStats.totalSessions++;
      
      if (session.isPaid) {
        userStats.paidSessions++;
      } else {
        userStats.unpaidSessions++;
      }
    });
    
    // Convert Map to array and sort by unpaid sessions (descending)
    const userStats = Array.from(userMap.values())
      .map(stats => ({
        ...stats,
        paidPercentage: stats.totalSessions > 0 ? Math.round((stats.paidSessions / stats.totalSessions) * 100) : 0
      }))
      .sort((a, b) => b.unpaidSessions - a.unpaidSessions);
    
    return {
      totalSessions,
      paidSessions,
      unpaidSessions,
      paidPercentage: totalSessions > 0 ? Math.round((paidSessions / totalSessions) * 100) : 0,
      userStats: userStats.slice(0, 5) // Top 5 users with most unpaid sessions
    };
  }, [approvedSessions, isAdmin]);

  return (
    <div className="payment-summary card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-dollar-sign me-2"></i>
          {isAdmin ? 'Payment Overview' : 'Your Payment Status'}
        </h5>
      </div>
      
      <div className="card-body">
        <h6 className="mb-3">Current Month ({moment().format('MMMM YYYY')})</h6>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="progress" style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(#10b981 ${currentMonthStats.paidPercentage * 3.6}deg, #f3f4f6 0deg)` }}>
                  <div className="progress-bar" style={{ width: '100%', background: 'transparent' }}></div>
                </div>
              </div>
              <div>
                <h3 className="mb-0">{currentMonthStats.paidPercentage}%</h3>
                <div className="text-muted">Sessions Paid</div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Sessions:</span>
                <span className="fw-bold">{currentMonthStats.totalSessions}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Paid Sessions:</span>
                <span className="text-success">{currentMonthStats.paidSessions}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Unpaid Sessions:</span>
                <span className="text-danger">{currentMonthStats.unpaidSessions}</span>
              </div>
            </div>
          </div>
        </div>
        
        {isAdmin && overallStats && (
          <>
            <hr />
            <h6 className="mb-3">All-Time Payment Stats</h6>
            
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h3 className="mb-0">{overallStats.paidSessions}</h3>
                    <div className="text-success">Paid Sessions</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h3 className="mb-0">{overallStats.unpaidSessions}</h3>
                    <div className="text-danger">Unpaid Sessions</div>
                  </div>
                </div>
              </div>
            </div>
            
            {overallStats.userStats.length > 0 && (
              <>
                <h6 className="mb-3">Top Users with Unpaid Sessions</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Unpaid</th>
                        <th>Paid %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallStats.userStats.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{user.totalSessions}</td>
                          <td className="text-success">{user.paidSessions}</td>
                          <td className="text-danger">{user.unpaidSessions}</td>
                          <td>
                            <div className="progress" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${user.paidPercentage}%` }} 
                                aria-valuenow={user.paidPercentage} 
                                aria-valuemin={0} 
                                aria-valuemax={100}>
                              </div>
                            </div>
                            <span className="small">{user.paidPercentage}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;