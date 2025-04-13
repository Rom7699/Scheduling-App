"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/App.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("./context/AuthContext");
var SessionContext_1 = require("./context/SessionContext");
var PrivateRoute_1 = require("./components/PrivateRoute");
var Navbar_1 = require("./components/Navbar");
var HomePage_1 = require("./pages/HomePage");
var LoginPage_1 = require("./pages/LoginPage");
var RegisterPage_1 = require("./pages/RegisterPage");
var DashBoardPage_1 = require("./pages/DashBoardPage");
var AdminPage_1 = require("./pages/AdminPage");
var axios_1 = require("axios");
require("./index.css");
// Set base URL for API requests
// With Vite, use import.meta.env instead of process.env
axios_1.default.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5500';
console.log('API URL:', axios_1.default.defaults.baseURL);
var App = function () {
    return (<AuthContext_1.AuthProvider>
      <SessionContext_1.SessionProvider>
        <react_router_dom_1.BrowserRouter>
          <Navbar_1.default />
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<HomePage_1.default />}/>
            <react_router_dom_1.Route path="/login" element={<LoginPage_1.default />}/>
            <react_router_dom_1.Route path="/register" element={<RegisterPage_1.default />}/>
            <react_router_dom_1.Route path="/dashboard" element={<PrivateRoute_1.default>
                  <DashBoardPage_1.default />
                </PrivateRoute_1.default>}/>
            <react_router_dom_1.Route path="/admin" element={<PrivateRoute_1.default adminOnly={true}>
                  <AdminPage_1.default />
                </PrivateRoute_1.default>}/>
          </react_router_dom_1.Routes>
        </react_router_dom_1.BrowserRouter>
      </SessionContext_1.SessionProvider>
    </AuthContext_1.AuthProvider>);
};
exports.default = App;
