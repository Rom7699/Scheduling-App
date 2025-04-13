// client/src/components/Calendar/SessionModal.tsx
import React from 'react';
import moment from 'moment';
import { Session } from '../../types';
import { useSession } from '../../context/SessionContext';
import { useAuth } from '../../context/AuthContext';

interface SessionModalProps {
  session: Session;
  show: boolean;
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ session, show, onClose }) => {
  const { updateSessionStatus, cancelSession } = useSession();
  const { user } = useAuth();
  
  const isAdmin = user?.isAdmin;
  const isOwner = typeof session.user !== 'string' && user?.id === session.user.id;

  if (!show) {
    return null;
  }

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (session.status) {
      case 'approved':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'rejected':
        return 'bg-danger';
      case 'cancelled':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  // Handle approve
  const handleApprove = () => {
    updateSessionStatus(session._id, 'approved');
    onClose();
  };

  // Handle reject
  const handleReject = () => {
    updateSessionStatus(session._id, 'rejected');
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    cancelSession(session._id);
    onClose();
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title">{session.title}</h5>
            <span className={`badge ms-2 ${getStatusBadgeClass()}`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="session-info">
              <div className="session-time mb-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="far fa-calendar me-2 text-primary"></i>
                  <span className="fw-bold">Date:</span>
                  <span className="ms-2">{moment(session.startTime).format('dddd, MMMM Do YYYY')}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="far fa-clock me-2 text-primary"></i>
                  <span className="fw-bold">Time:</span>
                  <span className="ms-2">
                    {moment(session.startTime).format('h:mm A')} - {moment(session.endTime).format('h:mm A')}
                  </span>
                </div>
              </div>
              
              <div className="session-description mb-4">
                <h6 className="fw-bold">Description</h6>
                <p className="mb-0">{session.description || 'No description provided.'}</p>
              </div>
              
              <div className="session-user">
                <h6 className="fw-bold">Requested by</h6>
                <div className="d-flex align-items-center">
                  <div className="user-avatar me-2">
                    <i className="fas fa-user-circle fs-4 text-secondary"></i>
                  </div>
                  <div className="user-info">
                    <div>{typeof session.user !== 'string' ? session.user.name : 'Unknown User'}</div>
                    <small className="text-muted">
                      {typeof session.user !== 'string' ? session.user.email : ''}
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="session-meta mt-4">
                <small className="text-muted">
                  Created {moment(session.createdAt).fromNow()}
                </small>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {isAdmin && session.status === 'pending' && (
              <div className="admin-actions me-auto">
                <button className="btn btn-success me-2" onClick={handleApprove}>
                  <i className="fas fa-check me-1"></i> Approve
                </button>
                <button className="btn btn-danger" onClick={handleReject}>
                  <i className="fas fa-times me-1"></i> Reject
                </button>
              </div>
            )}
            {(isAdmin || isOwner) && session.status !== 'cancelled' && (
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                <i className="fas fa-ban me-1"></i> Cancel Session
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;