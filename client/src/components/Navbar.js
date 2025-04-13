"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/components/Navbar.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../context/AuthContext");
var Navbar = function () {
    var _a = (0, AuthContext_1.useAuth)(), isAuthenticated = _a.isAuthenticated, user = _a.user, logout = _a.logout;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleLogout = function () {
        logout();
        navigate('/');
    };
    var authLinks = (<>
      <li className="nav-item">
        <react_router_dom_1.Link className="nav-link" to="/dashboard">
          Dashboard
        </react_router_dom_1.Link>
      </li>
      {(user === null || user === void 0 ? void 0 : user.isAdmin) && (<li className="nav-item">
          <react_router_dom_1.Link className="nav-link" to="/admin">
            Admin
          </react_router_dom_1.Link>
        </li>)}
      <li className="nav-item">
        <a href="#!" className="nav-link" onClick={handleLogout}>
          Logout
        </a>
      </li>
    </>);
    var guestLinks = (<>
      <li className="nav-item">
        <react_router_dom_1.Link className="nav-link" to="/login">
          Login
        </react_router_dom_1.Link>
      </li>
      <li className="nav-item">
        <react_router_dom_1.Link className="nav-link" to="/register">
          Register
        </react_router_dom_1.Link>
      </li>
    </>);
    return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <react_router_dom_1.Link className="navbar-brand" to="/">
          Hedy's Studio
        </react_router_dom_1.Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>);
};
exports.default = Navbar;
