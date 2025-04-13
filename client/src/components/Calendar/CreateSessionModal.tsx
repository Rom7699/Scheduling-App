// client/src/components/Calendar/CreateSessionModal.tsx
import React, { useState, useEffect } from 'react';
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
  const { createSession, error, clearSessionErrors } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(moment(startTime).format('YYYY-MM-DDTHH:mm'));
  const [end, setEnd] = useState(moment(endTime).format('YYYY-MM-DDTHH:mm'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear errors when modal closes
  useEffect(() => {
    if (!show) {
      clearSessionErrors();
      setValidationError('');
    }
  }, [show, clearSessionErrors]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setTitle('');
      setDescription('');
      setStart(moment(startTime).format('YYYY-MM-DDTHH:mm'));
      setEnd(moment(endTime).format('YYYY-MM-DDTHH:mm'));
      setIsSubmitting(false);
      setValidationError('');
    }
  }, [show, startTime, endTime]);

  if (!show) {
    return null;
  }

  const validateForm = () => {
    if (!title.trim()) {
      setValidationError('Title is required');
      return false;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate <= startDate) {
      setValidationError('End time must be after start time');
      return false;
    }
    
    // Validate current/next month restriction
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    
    if (startDate < startOfCurrentMonth || startDate > endOfNextMonth) {
      setValidationError('Sessions can only be scheduled for the current or next month');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createSession({
        title,
        description,
        startTime: new Date(start),
        endTime: new Date(end)
      });
      
      onClose();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-calendar-plus me-2 text-primary"></i>
              Schedule New Session
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {(error || validationError) && (
              <div className="alert alert-danger">
                {validationError || error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title<span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Team Meeting"
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
                  placeholder="Add details about this session"
                ></textarea>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="startTime" className="form-label">Start Time<span className="text-danger">*</span></label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="startTime"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="endTime" className="form-label">End Time<span className="text-danger">*</span></label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="endTime"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="alert alert-info d-flex align-items-center">
                <i className="fas fa-info-circle me-2"></i>
                <div>
                  Sessions require admin approval before they are confirmed.
                </div>
              </div>
              
              <div className="modal-footer px-0 pb-0">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
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
                      Submitting...
                    </>
                  ) : (
                    <>Request Session</>
                  )}
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