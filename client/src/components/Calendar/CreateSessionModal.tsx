import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSession } from '../../context/SessionContext';

interface CreateSessionModalProps {
  show: boolean;
  onClose: () => void;
  startTime: Date;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ 
  show, onClose, startTime: initialStartTime 
}) => {
  const { createSession } = useSession();

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour < 20; hour++) { // 8 AM to 8 PM
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const displayTime = moment(`${formattedHour}:${formattedMinute}`, 'HH:mm').format('h:mm A');
        options.push({ value: timeValue, label: displayTime });
      }
    }
    return options;
  };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment(initialStartTime).format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState('08:00'); // Default to 8:00 AM
  
  // Calculate start and end time
  const getStartAndEndTime = () => {
    const startDateTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const endDateTime = moment(startDateTime).add(1, 'hour').toDate();
    
    return { startDateTime, endDateTime };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { startDateTime, endDateTime } = getStartAndEndTime();
    
    createSession({
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime
    });
    
    onClose();
  };
  
  // On mount, set time to nearest 15-minute interval
  useEffect(() => {
    const roundedDate = moment(initialStartTime);
    const minutes = roundedDate.minutes();
    const remainder = minutes % 15;
    
    if (remainder > 0) {
      roundedDate.add(15 - remainder, 'minutes');
    }
    
    setSelectedDate(roundedDate.format('YYYY-MM-DD'));
    setSelectedTime(roundedDate.format('HH:mm'));
  }, [initialStartTime]);
  
  if (!show) return null;

  const { startDateTime, endDateTime } = getStartAndEndTime();
  const timeOptions = generateTimeOptions();
  
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Session</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="time" className="form-label">Start Time (15-minute intervals)</label>
                <select 
                  className="form-select"
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Session Duration</label>
                <div className="alert alert-info">
                  <strong>All sessions are 1 hour long</strong><br/>
                  Start: {moment(startDateTime).format('h:mm A')}<br/>
                  End: {moment(endDateTime).format('h:mm A')}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Session</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;