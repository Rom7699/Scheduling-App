"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/components/PrivateRoute.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../context/AuthContext");
var PrivateRoute = function (_a) {
    var children = _a.children, _b = _a.adminOnly, adminOnly = _b === void 0 ? false : _b;
    var _c = (0, AuthContext_1.useAuth)(), isAuthenticated = _c.isAuthenticated, loading = _c.loading, user = _c.user;
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return <react_router_dom_1.Navigate to="/login"/>;
    }
    if (adminOnly && !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
        return <react_router_dom_1.Navigate to="/dashboard"/>;
    }
    return <>{children}</>;
};
exports.default = PrivateRoute;
