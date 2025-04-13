// client/src/components/Calendar/CreateSessionModal.tsx
import React, { useState } from 'react';
import moment from 'moment';
import { useSession } from '../../context/SessionContext';

interface CreateSessionModalProps {
  show: boolean;
  onClose: () => void;
  startTime: Date;
  endTime: Date;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  show,
  onClose,
  startTime,
  endTime
}) => {
  const { createSession } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(moment(startTime).format('YYYY-MM-DDTHH:mm'));
  const [end, setEnd] = useState(moment(endTime).format('YYYY-MM-DDTHH:mm'));

  if (!show) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Validate dates
    if (endDate <= startDate) {
      alert('End time must be after start time');
      return;
    }
    
    // Validate current/next month restriction
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    
    if (startDate < startOfCurrentMonth || startDate > endOfNextMonth) {
      alert('Sessions can only be scheduled for the current or next month');
      return;
    }
    
    createSession({
      title,
      description,
      startTime: startDate,
      endTime: endDate
    });
    
    onClose();
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Schedule New Session</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="startTime" className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="startTime"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endTime" className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="endTime"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                />
              </div>
              <div className="alert alert-info">
                Note: Sessions require admin approval before they are confirmed.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Request Session
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;