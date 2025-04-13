"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/pages/LoginPage.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../context/AuthContext");
var LoginPage = function () {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, AuthContext_1.useAuth)(), login = _c.login, isAuthenticated = _c.isAuthenticated, error = _c.error, clearErrors = _c.clearErrors;
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        return function () {
            if (error)
                clearErrors();
        };
    }, [isAuthenticated, navigate]);
    var handleSubmit = function (e) {
        e.preventDefault();
        login(email, password);
    };
    return (<div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className="form-control" id="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input type="password" className="form-control" id="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} required/>
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <p className="mt-3">
                Don't have an account? <react_router_dom_1.Link to="/register">Register</react_router_dom_1.Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = LoginPage;
