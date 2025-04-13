"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// client/src/pages/HomePage.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var HomePage = function () {
    return (<div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Hedy's Studio Scheduling App</h1>
        <p className="lead">
          A simple and efficient way to schedule and manage your sessions.
        </p>
        <hr className="my-4"/>
        <p>
          Join today to start scheduling sessions with ease. All sessions are subject to approval.
        </p>
        <react_router_dom_1.Link className="btn btn-primary btn-lg" to="/register">
          Get Started
        </react_router_dom_1.Link>
      </div>
    </div>);
};
exports.default = HomePage;
