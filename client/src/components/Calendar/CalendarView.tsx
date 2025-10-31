// client/src/components/Calendar/CalendarView.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
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


  // Transform sessions into calendar events - MEMOIZED for performance
  const events = useMemo(() => sessions.map((session) => ({
    id: session._id,
    title: session.title,
    start: new Date(session.startTime),
    end: new Date(session.endTime),
    status: session.status,
    resource: session,
  })), [sessions]);

  // Handle event click - MEMOIZED
  const handleEventClick = useCallback((event: any) => {
    setSelectedSession(event.resource);
    setShowSessionModal(true);
  }, []);

  // Handle slot selection - MEMOIZED
  const handleSlotSelect = useCallback(({ start, end }: { start: Date; end: Date }) => {
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
  }, []);

  // Get event style based on status (Updated to match warm theme) - MEMOIZED
  const eventStyleGetter = useCallback((event: any) => {
    let backgroundColor = "#f43f5e"; // Rose (default)
    let borderColor = "#e11d48"; // Darker rose
    let opacity = 1;
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
        backgroundColor = "#78716c"; // Warm gray
        borderColor = "#57534e"; // Darker warm gray
        opacity = 0.8;
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
        borderRadius: "8px",
        opacity,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
        padding: "6px 10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        transition: "all 0.2s ease",
      },
    };
  }, []);

  // Custom toolbar component - MEMOIZED
  const CustomToolbar = useCallback((toolbar: any) => {
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
          <button className="toolbar-btn prev-btn" onClick={goToPrev} title="Previous">
            ←
          </button>
          <button className="toolbar-btn today-btn" onClick={goToToday}>
            Today
          </button>
          <button className="toolbar-btn next-btn" onClick={goToNext} title="Next">
            →
          </button>
        </div>
          <h3 className="toolbar-label">
            <span className="toolbar-date-icon">📅</span>
            {formattedDate}
            {weekNum}
          </h3>
        <div className="toolbar-view-options">
          <div className="view-toggle-group">
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
          </div>
          <button
            className="toolbar-btn create-btn"
            onClick={() =>
              handleSlotSelect({
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1)),
              })
            }
          >
            <span className="btn-icon">+</span> New Session
          </button>
        </div>
      </div>
    );
  }, [handleSlotSelect]);

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

  // Format the time slots in the calendar - MEMOIZED
  const formats = useMemo(() => ({
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
  }), []);

  // Custom day cell component - MEMOIZED
  const CustomDayCell = useCallback(({ children, value }: { children: React.ReactNode; value: Date }) => {
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
  }, [date]);

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

  // Custom header cell component - MEMOIZED
  const CustomHeaderCell = useCallback(({ label }: { label: string }) => {
    return <span className="custom-header">{label}</span>;
  }, []);

  // Memoize calendar components object to prevent unnecessary re-renders
  const calendarComponents = useMemo(() => ({
    toolbar: CustomToolbar,
    dateCellWrapper: CustomDayCell,
    header: CustomHeaderCell
  }), [CustomToolbar, CustomDayCell, CustomHeaderCell]);

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
          components={calendarComponents}
          formats={formats}
          popup
          tooltipAccessor={(event) => event.title}
        />
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