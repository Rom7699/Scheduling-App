"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/pages/DashboardPage.tsx
var react_1 = require("react");
var SessionContext_1 = require("../context/SessionContext");
var AuthContext_1 = require("../context/AuthContext");
var CalendarView_1 = require("../components/Calendar/CalendarView");
var DashboardPage = function () {
    var _a = (0, SessionContext_1.useSession)(), sessions = _a.sessions, getSessions = _a.getSessions, loading = _a.loading, error = _a.error;
    var user = (0, AuthContext_1.useAuth)().user;
    (0, react_1.useEffect)(function () {
        getSessions();
    }, []);
    // Filter sessions by status
    var pendingSessions = sessions.filter(function (session) { return session.status === 'pending'; });
    var approvedSessions = sessions.filter(function (session) { return session.status === 'approved'; });
    var rejectedSessions = sessions.filter(function (session) { return session.status === 'rejected'; });
    return (<div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Welcome, {user === null || user === void 0 ? void 0 : user.name}</h1>
          <p>Manage your sessions and schedule new ones.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Pending Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{pendingSessions.length}</h5>
              <p className="card-text">Sessions awaiting approval</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Approved Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{approvedSessions.length}</h5>
              <p className="card-text">Sessions ready to go</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Rejected Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{rejectedSessions.length}</h5>
              <p className="card-text">Sessions not approved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <CalendarView_1.default />
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = DashboardPage;
