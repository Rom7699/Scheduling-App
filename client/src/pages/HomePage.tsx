// client/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Hedy's Studio Scheduling App</h1>
        <p className="lead">
          A simple and efficient way to schedule and manage your sessions.
        </p>
        <hr className="my-4" />
        <p>
          Join today to start scheduling sessions with ease. All sessions are subject to approval.
        </p>
        <Link className="btn btn-primary btn-lg" to="/register">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;