"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/pages/RegisterPage.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../context/AuthContext");
var RegisterPage = function () {
    var _a = (0, react_1.useState)(''), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(''), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(''), confirmPassword = _d[0], setConfirmPassword = _d[1];
    var _e = (0, react_1.useState)(''), passwordError = _e[0], setPasswordError = _e[1];
    var _f = (0, AuthContext_1.useAuth)(), register = _f.register, isAuthenticated = _f.isAuthenticated, error = _f.error, clearErrors = _f.clearErrors;
    var navigate = (0, react_router_dom_1.useNavigate)();
    // useEffect(() => {
    //   if (isAuthenticated) {
    //     navigate('/dashboard');
    //   }
    //   return () => {
    //     clearErrors();
    //   };
    // }, [isAuthenticated, navigate, clearErrors]);
    var validatePassword = function () {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (validatePassword()) {
            register(name, email, password);
        }
    };
    return (<div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input type="text" className="form-control" id="name" value={name} onChange={function (e) { return setName(e.target.value); }} required/>
                </div>
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
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={function (e) { return setConfirmPassword(e.target.value); }} required/>
                  {passwordError && (<div className="form-text text-danger">{passwordError}</div>)}
                </div>
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </form>
              <p className="mt-3">
                Already have an account? <react_router_dom_1.Link to="/login">Login</react_router_dom_1.Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = RegisterPage;
