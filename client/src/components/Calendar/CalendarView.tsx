// client/src/components/Calendar/CalendarView.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "../../context/SessionContext";
import { Session } from "../../types";
import SessionModal from "./SessionModal";
import CreateSessionModal from "./CreateSessionModal";
import "./CalendarStyles.css"; // We'll create this file for custom styling

const localizer = momentLocalizer(moment);

const CalendarView: React.FC = () => {
  const { sessions, getSessions, loading } = useSession();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    getSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform sessions into calendar events
  const events = sessions.map((session) => ({
    id: session._id,
    title: session.title,
    start: new Date(session.startTime),
    end: new Date(session.endTime),
    status: session.status,
    resource: session,
  }));

  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedSession(event.resource);
    setShowSessionModal(true);
  };

  // Handle slot selection
  const handleSlotSelect = ({ start, end }: { start: Date; end: Date }) => {
    // Check if date is in current or next month
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 2,
      0,
      23,
      59,
      59
    );

    if (start < startOfCurrentMonth || start > endOfNextMonth) {
      alert("Sessions can only be scheduled for the current or next month");
      return;
    }

    setSelectedSlot({ start, end });
    setShowCreateModal(true);
  };

  // Get event style based on status
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#4f46e5"; // Indigo (default)
    let borderColor = "#4338ca"; // Darker indigo
    let opacity = 0.9;
    let fontWeight = "600";

    switch (event.status) {
      case "approved":
        backgroundColor = "#10b981"; // Emerald green
        borderColor = "#059669"; // Darker emerald
        break;
      case "pending":
        backgroundColor = "#f59e0b"; // Amber yellow
        borderColor = "#d97706"; // Darker amber
        break;
      case "rejected":
        backgroundColor = "#ef4444"; // Red
        borderColor = "#dc2626"; // Darker red
        break;
      case "cancelled":
        backgroundColor = "#6b7280"; // Gray
        borderColor = "#4b5563"; // Darker gray
        opacity = 0.7;
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        color: "white",
        fontWeight,
        borderRadius: "4px",
        opacity,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        padding: "4px 8px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToToday = () => {
      toolbar.date.setMonth(new Date().getMonth());
      toolbar.date.setYear(new Date().getFullYear());
      toolbar.onNavigate("TODAY");
    };

    const goToPrev = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToMonth = () => {
      toolbar.onView("month");
    };

    const goToWeek = () => {
      toolbar.onView("week");
    };

    const goToDay = () => {
      toolbar.onView("day");
    };

    // Format date for display
    const formattedDate = toolbar.date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      day: toolbar.view === "day" ? "numeric" : undefined,
    });

    const weekNum =
      toolbar.view === "week" ? ` (Week ${moment(toolbar.date).week()})` : "";

    return (
      <div className="calendar-toolbar">
        <div className="toolbar-date-nav">
          <button className="toolbar-btn prev-btn" onClick={goToPrev}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="toolbar-btn today-btn" onClick={goToToday}>
            Today
          </button>
          <button className="toolbar-btn next-btn" onClick={goToNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
          <h3 className="toolbar-label">
            {formattedDate}
            {weekNum}
          </h3>
        <div className="toolbar-view-options">
          <button
            className={`toolbar-btn view-btn ${
              toolbar.view === "month" ? "active" : ""
            }`}
            onClick={goToMonth}
          >
            Month
          </button>
          <button
            className={`toolbar-btn view-btn ${
              toolbar.view === "week" ? "active" : ""
            }`}
            onClick={goToWeek}
          >
            Week
          </button>
          <button
            className={`toolbar-btn view-btn ${
              toolbar.view === "day" ? "active" : ""
            }`}
            onClick={goToDay}
          >
            Day
          </button>
          <button
            className="toolbar-btn create-btn"
            onClick={() =>
              handleSlotSelect({
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1)),
              })
            }
          >
            <i className="fas fa-plus"></i> New Session
          </button>
        </div>
      </div>
    );
  };

  // Custom header for day cells in month view
  const CustomHeader = ({ date, label }: { date: Date; label: string }) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const today = moment().startOf("day").toDate();
    const isToday = moment(date).isSame(today, "day");

    return (
      <div
        className={`custom-header ${isToday ? "today" : ""} ${
          isWeekend ? "weekend" : ""
        }`}
      >
        {label}
      </div>
    );
  };

  // Format the time slots in the calendar
  const formats = {
    timeGutterFormat: (date: Date) => moment(date).format("h A"),
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
      return `${moment(start).format("h:mm A")} - ${moment(end).format(
        "h:mm A"
      )}`;
    },
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      return `${moment(start).format("MMM D")} - ${moment(end).format(
        "MMM D, YYYY"
      )}`;
    },
  };

  // Custom day cell component
  const CustomDayCell = ({ children, value }: { children: React.ReactNode; value: Date }) => {
    const today = moment().startOf("day").toDate();
    const isToday = moment(value).isSame(today, "day");
    const isWeekend = value.getDay() === 0 || value.getDay() === 6;
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const isSchedulable = value >= startOfCurrentMonth && value <= endOfNextMonth;
    const isCurrentMonth = value.getMonth() === date.getMonth();
  
    return (
      <div
        className={`
          rbc-day-bg  
          ${isToday ? "today" : ""} 
          ${isWeekend ? "weekend" : ""} 
          ${!isCurrentMonth ? "different-month" : ""} 
          ${isSchedulable ? "schedulable" : ""}
        `}
      >
        {children}
      </div>
    );
  };

  // Message component while loading
  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your calendar...</p>
      </div>
    );
  }

  const CustomHeaderCell = ({ label }: { label: string }) => {
    return <span className="custom-header">{label}</span>;
  };

  return (
    <div className="modern-calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSlotSelect}
          selectable
          views={["month", "week", "day"]}
          view={view as any}
          date={date}
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setDate(newDate)}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            dateCellWrapper: CustomDayCell,
            header: CustomHeaderCell
          }}
          formats={formats}
          popup
          tooltipAccessor={(event) => event.title}
        />
      </div>

      {/* Legend for session status */}
      <div className="calendar-legend">
        <div className="legend-title">Session Status</div>
        <div className="legend-items">
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#10b981" }}
            ></span>
            <span className="legend-label">Approved</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#f59e0b" }}
            ></span>
            <span className="legend-label">Pending</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#ef4444" }}
            ></span>
            <span className="legend-label">Rejected</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#6b7280" }}
            ></span>
            <span className="legend-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Session details modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          show={showSessionModal}
          onClose={() => {
            setShowSessionModal(false);
            setSelectedSession(null);
          }}
        />
      )}

      {/* Create session modal */}
      {selectedSlot && (
        <CreateSessionModal
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedSlot(null);
          }}
          startTime={selectedSlot.start}
        />
      )}
    </div>
  );
};

export default CalendarView;
