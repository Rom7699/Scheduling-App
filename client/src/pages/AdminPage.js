"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/pages/AdminPage.tsx
var react_1 = require("react");
var SessionContext_1 = require("../context/SessionContext");
var moment_1 = require("moment");
var SessionModal_1 = require("../components/Calendar/SessionModal");
var AdminPage = function () {
    var _a = (0, SessionContext_1.useSession)(), sessions = _a.sessions, getSessions = _a.getSessions, loading = _a.loading, error = _a.error;
    var _b = (0, react_1.useState)(false), showModal = _b[0], setShowModal = _b[1];
    var _c = (0, react_1.useState)(null), selectedSession = _c[0], setSelectedSession = _c[1];
    var _d = (0, react_1.useState)('all'), filter = _d[0], setFilter = _d[1];
    (0, react_1.useEffect)(function () {
        getSessions();
    }, []);
    // Filter sessions based on selected filter
    var filteredSessions = filter === 'all'
        ? sessions
        : sessions.filter(function (session) { return session.status === filter; });
    // Handle session click
    var handleSessionClick = function (session) {
        setSelectedSession(session);
        setShowModal(true);
    };
    return (<div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Admin Dashboard</h1>
          <p>Manage and approve session requests.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Session Requests</h5>
              <div className="btn-group">
                <button className={"btn ".concat(filter === 'all' ? 'btn-primary' : 'btn-outline-primary')} onClick={function () { return setFilter('all'); }}>
                  All
                </button>
                <button className={"btn ".concat(filter === 'pending' ? 'btn-primary' : 'btn-outline-primary')} onClick={function () { return setFilter('pending'); }}>
                  Pending
                </button>
                <button className={"btn ".concat(filter === 'approved' ? 'btn-primary' : 'btn-outline-primary')} onClick={function () { return setFilter('approved'); }}>
                  Approved
                </button>
                <button className={"btn ".concat(filter === 'rejected' ? 'btn-primary' : 'btn-outline-primary')} onClick={function () { return setFilter('rejected'); }}>
                  Rejected
                </button>
                <button className={"btn ".concat(filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary')} onClick={function () { return setFilter('cancelled'); }}>
                  Cancelled
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (<p>Loading...</p>) : (<div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>User</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.length === 0 ? (<tr>
                          <td colSpan={6}>No sessions found</td>
                        </tr>) : (filteredSessions.map(function (session) { return (<tr key={session._id}>
                            <td>{session.title}</td>
                            <td>
                              {typeof session.user !== 'string' ? session.user.name : 'Unknown User'}
                            </td>
                            <td>{(0, moment_1.default)(session.startTime).format('MMM D, YYYY h:mm A')}</td>
                            <td>{(0, moment_1.default)(session.endTime).format('MMM D, YYYY h:mm A')}</td>
                            <td>
                              <span className={"badge ".concat(session.status === 'approved' ? 'bg-success' :
                    session.status === 'pending' ? 'bg-warning' :
                        session.status === 'rejected' ? 'bg-danger' : 'bg-secondary')}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-info" onClick={function () { return handleSessionClick(session); }}>
                                View
                              </button>
                            </td>
                          </tr>); }))}
                    </tbody>
                  </table>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {selectedSession && (<SessionModal_1.default session={selectedSession} show={showModal} onClose={function () {
                setShowModal(false);
                setSelectedSession(null);
                // Refresh sessions list
                getSessions();
            }}/>)}
    </div>);
};
exports.default = AdminPage;
