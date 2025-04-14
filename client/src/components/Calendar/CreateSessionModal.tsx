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
  
  // New state for recurring options
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  
  // Calculate default recurrence end date (3 months from now)
  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 3);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    moment(defaultEndDate).format('YYYY-MM-DD')
  );

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
    
    // Validate current/next month restriction for non-recurring sessions
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    
    if (startDate < startOfCurrentMonth || 
        (!isRecurring && startDate > endOfNextMonth)) {
      alert('Sessions can only be scheduled for the current or next month');
      return;
    }
    
    // Validate recurrence end date for recurring sessions
    if (isRecurring) {
      const recurrenceEnd = new Date(recurrenceEndDate);
      if (recurrenceEnd <= startDate) {
        alert('Recurrence end date must be after the session start date');
        return;
      }
      
      // Limit recurring events to one year in the future
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (recurrenceEnd > oneYearFromNow) {
        alert('Recurring sessions cannot be scheduled more than one year in advance');
        return;
      }
    }
    
    const sessionData = {
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      ...(isRecurring && {
        isRecurring,
        recurrenceType,
        recurrenceEndDate: new Date(`${recurrenceEndDate}T23:59:59`)
      })
    };
    
    createSession(sessionData);
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
              
              {/* Recurring session options */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isRecurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isRecurring">
                  Make this a recurring session
                </label>
              </div>
              
              {isRecurring && (
                <>
                  <div className="mb-3">
                    <label htmlFor="recurrenceType" className="form-label">
                      Repeats
                    </label>
                    <select
                      className="form-select"
                      id="recurrenceType"
                      value={recurrenceType}
                      onChange={(e) => setRecurrenceType(e.target.value as 'weekly' | 'biweekly' | 'monthly')}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every Two Weeks</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="recurrenceEndDate" className="form-label">
                      Ends On
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="recurrenceEndDate"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      required={isRecurring}
                    />
                  </div>
                </>
              )}
              
              <div className="alert alert-info">
                Note: Sessions require admin approval before they are confirmed.
                {isRecurring && (
                  <span className="d-block mt-2">
                    This will create multiple sessions that repeat{' '}
                    {recurrenceType === 'weekly' 
                      ? 'every week' 
                      : recurrenceType === 'biweekly' 
                        ? 'every two weeks' 
                        : 'every month'}{' '}
                    until {moment(recurrenceEndDate).format('MMMM D, YYYY')}.
                  </span>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isRecurring ? 'Request Recurring Sessions' : 'Request Session'}
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