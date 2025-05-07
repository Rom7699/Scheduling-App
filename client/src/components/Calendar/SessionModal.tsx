// client/src/components/Calendar/SessionModal.tsx
import React, { useState } from "react";
import moment from "moment";
import { Session } from "../../types";
import { useSession } from "../../context/SessionContext";
import { useAuth } from "../../context/AuthContext";
import EditSessionModal from "./EditSessionModal";

interface SessionModalProps {
  session: Session;
  show: boolean;
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  session,
  show,
  onClose,
}) => {
  const { updateSessionStatus, cancelSession, deleteSession, updateSessionPayment } = useSession();

  const { user } = useAuth();

  // State for dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  // State for options
  const [cancelFutureSessions, setCancelFutureSessions] = useState(false);
  const [deleteAllRelated, setDeleteAllRelated] = useState(false);

  // State for reason input
  const [reason, setReason] = useState("");

  // State to track current action type
  const [currentAction, setCurrentAction] = useState<
    "approve" | "reject" | "cancel" | "delete" | null
  >(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);

  const isAdmin = user?.isAdmin;
  const isOwner =
    typeof session.user !== "string" && user?.id === session.user.id;
  const isRecurring = session.isRecurring;

  if (!show) {
    return null;
  }

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (session.status) {
      case "approved":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "rejected":
        return "bg-danger";
      case "cancelled":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  // Handle approve
  const handleApprove = () => {
    updateSessionStatus(session._id, "approved");
    onClose();
  };

  // Initialize reject process
  const startReject = () => {
    setCurrentAction("reject");
    setReason("");
    setShowReasonDialog(true);
  };

  // Initialize cancel process
  const startCancel = () => {
    setCurrentAction("cancel");
    if (isRecurring) {
      setShowCancelDialog(true);
    } else {
      setReason("");
      setShowReasonDialog(true);
    }
  };

  // Initialize delete process
  const startDelete = () => {
    setCurrentAction("delete");
    if (isRecurring) {
      setShowDeleteDialog(true);
    } else {
      setReason("");
      setShowReasonDialog(true);
    }
  };

  // Handle payment toggle
  const handlePaymentToggle = () => {
    if (session.status === 'approved') {
      updateSessionPayment(session._id);
    }
  };

  // Submit the current action with reason
  const submitActionWithReason = () => {
    switch (currentAction) {
      case "reject":
        updateSessionStatus(session._id, "rejected", reason);
        break;
      case "cancel":
        cancelSession(session._id, cancelFutureSessions, reason);
        break;
      case "delete":
        deleteSession(session._id, deleteAllRelated, reason);
        break;
    }

    // Close all dialogs
    setShowReasonDialog(false);
    setShowCancelDialog(false);
    setShowDeleteDialog(false);

    // Close the main modal
    onClose();
  };

  // Get recurrence text
  const getRecurrenceText = () => {
    if (!session.isRecurring) return null;

    let frequencyText = "";
    switch (session.recurrenceType) {
      case "weekly":
        frequencyText = "Weekly";
        break;
      case "biweekly":
        frequencyText = "Every two weeks";
        break;
      case "monthly":
        frequencyText = "Monthly";
        break;
      default:
        return null;
    }

    return `${frequencyText} until ${
      session.recurrenceEndDate
        ? moment(session.recurrenceEndDate).format("MMMM D, YYYY")
        : "N/A"
    }`;
  };

  const canEditSession = () => {
    // Only the session owner can edit
    const isOwner =
      typeof session.user !== "string" && user?.id === session.user.id;

    // Only pending or approved sessions can be edited
    const hasEditableStatus =
      session.status === "pending" || session.status === "approved";

    // Check time constraint - 12 hours before start
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const diffHours =
      (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hasEnoughTimeBeforeStart = diffHours >= 12;

    return hasEditableStatus && hasEnoughTimeBeforeStart;
  };

  // Render the main session modal
  return (
    <>
      <div className="modal show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <h5 className="modal-title">{session.title}</h5>
              <span className={`badge ms-2 ${getStatusBadgeClass()}`}>
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </span>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="session-info">
                <div className="session-time mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <i className="far fa-calendar me-2 text-primary"></i>
                    <span className="fw-bold">Date:</span>
                    <span className="ms-2">
                      {moment(session.startTime).format("dddd, MMMM Do YYYY")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="far fa-clock me-2 text-primary"></i>
                    <span className="fw-bold">Time:</span>
                    <span className="ms-2">
                      {moment(session.startTime).format("h:mm A")} -{" "}
                      {moment(session.endTime).format("h:mm A")}
                    </span>
                  </div>

                  {/* Show recurrence info if this is a recurring session */}
                  {isRecurring && (
                    <div className="d-flex align-items-center mt-2">
                      <i className="fas fa-redo-alt me-2 text-primary"></i>
                      <span className="fw-bold">Recurrence:</span>
                      <span className="ms-2">{getRecurrenceText()}</span>
                    </div>
                  )}

                  {/* Show payment status */}
                  <div className="d-flex align-items-center mt-2">
                    <i className={`fas ${session.isPaid ? 'fa-check-circle text-success' : 'fa-dollar-sign text-muted'} me-2`}></i>
                    <span className="fw-bold">Payment Status:</span>
                    <span className="ms-2">
                      {session.isPaid ? 'Paid' : 'Not paid'}
                    </span>
                    {isAdmin && session.status === 'approved' && (
                      <button 
                        className={`btn btn-sm ms-2 ${session.isPaid ? 'btn-outline-success' : 'btn-success'}`}
                        onClick={handlePaymentToggle}
                      >
                        {session.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="session-description mb-4">
                  <h6 className="fw-bold">Description</h6>
                  <p className="mb-0">
                    {session.description || "No description provided."}
                  </p>
                </div>

                <div className="session-user">
                  <h6 className="fw-bold">Requested by</h6>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar me-2">
                      <i className="fas fa-user-circle fs-4 text-secondary"></i>
                    </div>
                    <div className="user-info">
                      <div>
                        {typeof session.user !== "string"
                          ? session.user.name
                          : "Unknown User"}
                      </div>
                      <small className="text-muted">
                        {typeof session.user !== "string"
                          ? session.user.email
                          : ""}
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
              {isAdmin && session.status === "pending" && (
                <div className="admin-actions me-auto">
                  <button
                    className="btn btn-success me-2"
                    onClick={handleApprove}
                  >
                    <i className="fas fa-check me-1"></i> Approve
                  </button>
                  <button className="btn btn-danger" onClick={startReject}>
                    <i className="fas fa-times me-1"></i> Reject
                  </button>
                </div>
              )}

              {/* Admin delete button */}
              {isAdmin && (
                <button
                  className="btn btn-danger me-2"
                  onClick={startDelete}
                  title="Permanently delete this session from the database"
                >
                  <i className="fas fa-trash-alt me-1"></i> Delete
                </button>
              )}

              {(isAdmin || isOwner) && session.status !== "cancelled" && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={startCancel}
                >
                  <i className="fas fa-ban me-1"></i> Cancel Session
                </button>
              )}
              {canEditSession() && (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="fas fa-clock me-1"></i> Reschedule
                </button>
              )}
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog for recurring sessions */}
      {showCancelDialog && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Recurring Session</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCancelDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  This is part of a recurring session. What would you like to
                  cancel?
                </p>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cancelOption"
                    id="cancelThis"
                    checked={!cancelFutureSessions}
                    onChange={() => setCancelFutureSessions(false)}
                  />
                  <label className="form-check-label" htmlFor="cancelThis">
                    Cancel only this occurrence
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cancelOption"
                    id="cancelFuture"
                    checked={cancelFutureSessions}
                    onChange={() => setCancelFutureSessions(true)}
                  />
                  <label className="form-check-label" htmlFor="cancelFuture">
                    Cancel this and all future occurrences
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowCancelDialog(false);
                    setShowReasonDialog(true);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog for administrators */}
      {showDeleteDialog && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Session</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Warning: This will permanently delete the session from the
                  database and cannot be undone.
                </div>

                <p>
                  This is part of a recurring session. What would you like to
                  delete?
                </p>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deleteOption"
                    id="deleteThis"
                    checked={!deleteAllRelated}
                    onChange={() => setDeleteAllRelated(false)}
                  />
                  <label className="form-check-label" htmlFor="deleteThis">
                    Delete only this occurrence
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deleteOption"
                    id="deleteAll"
                    checked={deleteAllRelated}
                    onChange={() => setDeleteAllRelated(true)}
                  />
                  <label className="form-check-label" htmlFor="deleteAll">
                    Delete all related sessions (parent and all occurrences)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setShowReasonDialog(true);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reason input dialog */}
      {showReasonDialog && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentAction === "reject" && "Provide Rejection Reason"}
                  {currentAction === "cancel" && "Provide Cancellation Reason"}
                  {currentAction === "delete" && "Provide Deletion Reason"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReasonDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Please provide a reason that will be included in the email
                  notification to the user:
                </p>

                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason here..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReasonDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitActionWithReason}
                >
                  {currentAction === "reject" && "Reject Session"}
                  {currentAction === "cancel" && "Cancel Session"}
                  {currentAction === "delete" && "Delete Session"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Session modal */}
      {showEditModal && (
        <EditSessionModal
          session={session}
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            onClose(); // Close the main modal too, to refresh data
          }}
        />
      )}
    </>
  );
};

export default SessionModal;