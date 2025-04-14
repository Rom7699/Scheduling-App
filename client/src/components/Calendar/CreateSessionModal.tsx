// client/src/components/Calendar/CreateSessionModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useSession } from '../../context/SessionContext';
import { useAuth } from '../../context/AuthContext';

interface CreateSessionModalProps {
  show: boolean;
  onClose: () => void;
  startTime: Date;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  show,
  onClose,
  startTime
}) => {
  const { createSession } = useSession();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  
  // Selected date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(moment(startTime).format('YYYY-MM-DD'));
  
  // Selected time (HH:MM)
  const [selectedTime, setSelectedTime] = useState(moment(startTime).format('HH:mm'));
  
  // New state for recurring options
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  
  // Calculate default recurrence end date (3 months from now)
  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 3);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    moment(defaultEndDate).format('YYYY-MM-DD')
  );

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

  // Generate automatic title based on time of day and user name
  const generateTitle = () => {
    const hour = parseInt(selectedTime.split(':')[0], 10);
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

  // Round initial time to the nearest 15 minutes
  useEffect(() => {
    const date = moment(startTime);
    const minutes = date.minutes();
    const remainder = minutes % 15;
    
    if (remainder > 0) {
      // Round up to next 15-min interval
      date.add(15 - remainder, 'minutes');
    }
    
    setSelectedDate(date.format('YYYY-MM-DD'));
    setSelectedTime(date.format('HH:mm'));
  }, [startTime]);

  if (!show) {
    return null;
  }

  const timeOptions = generateTimeOptions();
  const sessionTitle = useMemo(() => {
    return generateTitle();
  }, [selectedTime, user?.name]); // Re-compute when time or user changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create start date from selected date and time
    const startDateTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').toDate();
    
    // End time is always exactly 1 hour after start time
    const endDateTime = moment(startDateTime).add(1, 'hour').toDate();
    
    // Validate current/next month restriction for non-recurring sessions
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    
    if (startDateTime < startOfCurrentMonth || 
        (!isRecurring && startDateTime > endOfNextMonth)) {
      alert('Sessions can only be scheduled for the current or next month');
      return;
    }
    
    // Validate recurrence end date for recurring sessions
    if (isRecurring) {
      const recurrenceEnd = new Date(recurrenceEndDate);
      if (recurrenceEnd <= startDateTime) {
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
      title: sessionTitle, // Use the automatically generated title
      description,
      startTime: startDateTime,
      endTime: endDateTime,
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
                <label className="form-label">Session Title</label>
                <div className="form-control bg-light">{sessionTitle}</div>
                <small className="text-muted">Title is automatically generated based on time of day</small>
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add any details about your session here..."
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label htmlFor="selectedDate" className="form-label">Date</label>
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
                <label htmlFor="selectedTime" className="form-label">Start Time</label>
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
                <div className="alert alert-info">
                  <strong>Session Duration: 1 hour</strong><br/>
                  Your session will be from{' '}
                  {moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')}{' '}
                  to{' '}
                  {moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').add(1, 'hour').format('h:mm A')}
                </div>
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