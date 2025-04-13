"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/components/Calendar/CalendarView.tsx
var react_1 = require("react");
var react_big_calendar_1 = require("react-big-calendar");
var moment_1 = require("moment");
require("react-big-calendar/lib/css/react-big-calendar.css");
var SessionContext_1 = require("../../context/SessionContext");
var SessionModal_1 = require("./SessionModal");
var CreateSessionModal_1 = require("./CreateSessionModal");
require("./CalendarStyles.css"); // We'll create this file for custom styling
var localizer = (0, react_big_calendar_1.momentLocalizer)(moment_1.default);
var CalendarView = function () {
    var _a = (0, SessionContext_1.useSession)(), sessions = _a.sessions, getSessions = _a.getSessions, loading = _a.loading;
    var _b = (0, react_1.useState)(react_big_calendar_1.Views.MONTH), view = _b[0], setView = _b[1];
    var _c = (0, react_1.useState)(new Date()), date = _c[0], setDate = _c[1];
    var _d = (0, react_1.useState)(false), showSessionModal = _d[0], setShowSessionModal = _d[1];
    var _e = (0, react_1.useState)(false), showCreateModal = _e[0], setShowCreateModal = _e[1];
    var _f = (0, react_1.useState)(null), selectedSession = _f[0], setSelectedSession = _f[1];
    var _g = (0, react_1.useState)(null), selectedSlot = _g[0], setSelectedSlot = _g[1];
    (0, react_1.useEffect)(function () {
        getSessions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Transform sessions into calendar events
    var events = sessions.map(function (session) { return ({
        id: session._id,
        title: session.title,
        start: new Date(session.startTime),
        end: new Date(session.endTime),
        status: session.status,
        resource: session,
    }); });
    // Handle event click
    var handleEventClick = function (event) {
        setSelectedSession(event.resource);
        setShowSessionModal(true);
    };
    // Handle slot selection
    var handleSlotSelect = function (_a) {
        var start = _a.start, end = _a.end;
        // Check if date is in current or next month
        var now = new Date();
        var startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        var endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
        if (start < startOfCurrentMonth || start > endOfNextMonth) {
            alert("Sessions can only be scheduled for the current or next month");
            return;
        }
        setSelectedSlot({ start: start, end: end });
        setShowCreateModal(true);
    };
    // Get event style based on status
    var eventStyleGetter = function (event) {
        var backgroundColor = "#4f46e5"; // Indigo (default)
        var borderColor = "#4338ca"; // Darker indigo
        var opacity = 0.9;
        var fontWeight = "600";
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
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderLeft: "4px solid ".concat(borderColor),
                color: "white",
                fontWeight: fontWeight,
                borderRadius: "4px",
                opacity: opacity,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                padding: "4px 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
        };
    };
    // Custom toolbar component
    var CustomToolbar = function (toolbar) {
        var goToToday = function () {
            toolbar.date.setMonth(new Date().getMonth());
            toolbar.date.setYear(new Date().getFullYear());
            toolbar.onNavigate("TODAY");
        };
        var goToPrev = function () {
            toolbar.onNavigate("PREV");
        };
        var goToNext = function () {
            toolbar.onNavigate("NEXT");
        };
        var goToMonth = function () {
            toolbar.onView("month");
        };
        var goToWeek = function () {
            toolbar.onView("week");
        };
        var goToDay = function () {
            toolbar.onView("day");
        };
        // Format date for display
        var formattedDate = toolbar.date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            day: toolbar.view === "day" ? "numeric" : undefined,
        });
        var weekNum = toolbar.view === "week" ? " (Week ".concat((0, moment_1.default)(toolbar.date).week(), ")") : "";
        return (<div className="calendar-toolbar">
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
          <button className={"toolbar-btn view-btn ".concat(toolbar.view === "month" ? "active" : "")} onClick={goToMonth}>
            Month
          </button>
          <button className={"toolbar-btn view-btn ".concat(toolbar.view === "week" ? "active" : "")} onClick={goToWeek}>
            Week
          </button>
          <button className={"toolbar-btn view-btn ".concat(toolbar.view === "day" ? "active" : "")} onClick={goToDay}>
            Day
          </button>
          <button className="toolbar-btn create-btn" onClick={function () {
                return handleSlotSelect({
                    start: new Date(),
                    end: new Date(new Date().setHours(new Date().getHours() + 1)),
                });
            }}>
            <i className="fas fa-plus"></i> New Session
          </button>
        </div>
      </div>);
    };
    // Custom header for day cells in month view
    var CustomHeader = function (_a) {
        var date = _a.date, label = _a.label;
        var isWeekend = date.getDay() === 0 || date.getDay() === 6;
        var today = (0, moment_1.default)().startOf("day").toDate();
        var isToday = (0, moment_1.default)(date).isSame(today, "day");
        return (<div className={"custom-header ".concat(isToday ? "today" : "", " ").concat(isWeekend ? "weekend" : "")}>
        {label}
      </div>);
    };
    // Format the time slots in the calendar
    var formats = {
        timeGutterFormat: function (date) { return (0, moment_1.default)(date).format("h A"); },
        eventTimeRangeFormat: function (_a) {
            var start = _a.start, end = _a.end;
            return "".concat((0, moment_1.default)(start).format("h:mm A"), " - ").concat((0, moment_1.default)(end).format("h:mm A"));
        },
        dayRangeHeaderFormat: function (_a) {
            var start = _a.start, end = _a.end;
            return "".concat((0, moment_1.default)(start).format("MMM D"), " - ").concat((0, moment_1.default)(end).format("MMM D, YYYY"));
        },
    };
    // Custom day cell component
    var CustomDayCell = function (_a) {
        var children = _a.children, value = _a.value;
        var today = (0, moment_1.default)().startOf("day").toDate();
        var isToday = (0, moment_1.default)(value).isSame(today, "day");
        var isWeekend = value.getDay() === 0 || value.getDay() === 6;
        var now = new Date();
        var startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        var endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        var isSchedulable = value >= startOfCurrentMonth && value <= endOfNextMonth;
        var isCurrentMonth = value.getMonth() === date.getMonth();
        return (<div className={"\n          rbc-day-bg  \n          ".concat(isToday ? "today" : "", " \n          ").concat(isWeekend ? "weekend" : "", " \n          ").concat(!isCurrentMonth ? "different-month" : "", " \n          ").concat(isSchedulable ? "schedulable" : "", "\n        ")}>
        {children}
      </div>);
    };
    // Message component while loading
    if (loading) {
        return (<div className="calendar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your calendar...</p>
      </div>);
    }
    var CustomHeaderCell = function (_a) {
        var label = _a.label;
        return <span className="custom-header">{label}</span>;
    };
    return (<div className="modern-calendar-container">
      <div className="calendar-wrapper">
        <react_big_calendar_1.Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 650 }} onSelectEvent={handleEventClick} onSelectSlot={handleSlotSelect} selectable views={["month", "week", "day"]} view={view} date={date} onView={function (newView) { return setView(newView); }} onNavigate={function (newDate) { return setDate(newDate); }} eventPropGetter={eventStyleGetter} components={{
            toolbar: CustomToolbar,
            dateCellWrapper: CustomDayCell,
            header: CustomHeaderCell
        }} formats={formats} popup tooltipAccessor={function (event) { return event.title; }}/>
      </div>

      {/* Legend for session status */}
      <div className="calendar-legend">
        <div className="legend-title">Session Status</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#10b981" }}></span>
            <span className="legend-label">Approved</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#f59e0b" }}></span>
            <span className="legend-label">Pending</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#ef4444" }}></span>
            <span className="legend-label">Rejected</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#6b7280" }}></span>
            <span className="legend-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Session details modal */}
      {selectedSession && (<SessionModal_1.default session={selectedSession} show={showSessionModal} onClose={function () {
                setShowSessionModal(false);
                setSelectedSession(null);
            }}/>)}

      {/* Create session modal */}
      {selectedSlot && (<CreateSessionModal_1.default show={showCreateModal} onClose={function () {
                setShowCreateModal(false);
                setSelectedSlot(null);
            }} startTime={selectedSlot.start} endTime={selectedSlot.end}/>)}
    </div>);
};
exports.default = CalendarView;
