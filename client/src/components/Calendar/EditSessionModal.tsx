// client/src/components/Calendar/EditSessionModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Session } from '../../types';
import { useSession } from '../../context/SessionContext';
import { useAuth } from '../../context/AuthContext';

interface EditSessionModalProps {
  session: Session;
  show: boolean;
  onClose: () => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({
  session,
  show,
  onClose
}) => {
  const { updateSessionTime, error } = useSession();
  const { user } = useAuth();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Calculate if session is editable (at least 12 hours before start)
  const isEditable = () => {
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const diffHours = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 12;
  };
  
  // Generate time options in 15-minute intervals from 7:00 to 21:00
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour < 21; hour++) { // 7 AM to 8 PM (last slot is 8 PM)
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeValue = `${formattedHour}:${formattedMinute}`;
        options.push(timeValue);
      }
    }
    return options;
  };

  // Generate automatic title based on time of day
  const generateTitle = (selectedDate: string, selectedTime: string) => {
    if (!selectedDate || !selectedTime) return '';
    
    const datetime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm');
    const hour = datetime.hour();
    let timeOfDay;
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = "Morning";
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = "Afternoon";
    } else {
      timeOfDay = "Evening";
    }
    
    return `${user?.name || 'User'} - ${timeOfDay} Session`;
  };

  // Memoized session title
  const newSessionTitle = useMemo(() => {
    return generateTitle(selectedDate, selectedTime);
  }, [selectedDate, selectedTime, user?.name]);

  useEffect(() => {
    if (show && session) {
      // Initialize form with current session date and time
      const sessionDate = moment(session.startTime);
      setSelectedDate(sessionDate.format('YYYY-MM-DD'));
      setSelectedTime(sessionDate.format('HH:mm'));
    }
  }, [show, session]);
  
  useEffect(() => {
    // Reset error when dialog shows
    if (show) {
      setErrorMessage(null);
    }
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Create start date from selected date and time
      const startDateTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').toDate();
      
      // End time is always exactly 1 hour after start time
      const endDateTime = moment(startDateTime).add(1, 'hour').toDate();
      
      // Validate selected time is in the future
      const now = new Date();
      if (startDateTime <= now) {
        setErrorMessage('Session time must be in the future');
        setIsSubmitting(false);
        return;
      }
      
      // Call API to update session time
      await updateSessionTime(session._id, startDateTime, endDateTime);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update session time');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!show) {
    return null;
  }

  const timeOptions = generateTimeOptions();
  const canEdit = isEditable();

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reschedule Session</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!canEdit ? (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Sessions can only be rescheduled at least 12 hours before their start time.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Current Session</label>
                  <div className="form-control bg-light">
                    <strong>{session.title}</strong><br/>
                    {moment(session.startTime).format('dddd, MMMM D, YYYY')} at {' '}
                    {moment(session.startTime).format('h:mm A')} - {moment(session.endTime).format('h:mm A')}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="selectedDate" className="form-label">New Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="selectedDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="selectedTime" className="form-label">New Start Time</label>
                  <select
                    className="form-select"
                    id="selectedTime"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>
                        {moment(time, 'HH:mm').format('h:mm A')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">New Session Title</label>
                  <div className="form-control bg-light">{newSessionTitle}</div>
                  <small className="text-muted">Title is automatically generated based on time of day</small>
                </div>
                
                <div className="mb-3">
                  <div className="alert alert-info">
                    <strong>New Session:</strong><br/>
                    {selectedDate ? moment(selectedDate).format('dddd, MMMM D, YYYY') : ''} from{' '}
                    {selectedTime ? moment(selectedTime, 'HH:mm').format('h:mm A') : ''}{' '}
                    to{' '}
                    {selectedTime ? moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').add(1, 'hour').format('h:mm A') : ''}
                  </div>
                </div>
                
                <div className="alert alert-warning">
                  <i className="fas fa-info-circle me-2"></i>
                  Note: When you reschedule a session, an email notification will be sent to administrators.
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Reschedule Session'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSessionModal;