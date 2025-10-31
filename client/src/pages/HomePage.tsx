// client/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-content">
                {isAuthenticated ? (
                  <>
                    <h1 className="hero-title">
                      Welcome back, <span className="text-gradient">{user?.name}</span>!
                    </h1>
                    <p className="hero-subtitle">
                      Ready to manage your sessions? Your dashboard is just a click away.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="hero-badge">Scheduling Made Simple</span>
                    <h1 className="hero-title">
                      Your Perfect Session,{' '}
                      <span className="text-gradient">Beautifully Scheduled</span>
                    </h1>
                    <p className="hero-subtitle">
                      Book studio sessions with ease. Expert-approved bookings, flexible scheduling,
                      and seamless management—all in one elegant platform.
                    </p>
                  </>
                )}

                <div className="hero-cta">
                  {isAuthenticated ? (
                    <Link className="btn btn-primary btn-lg shadow-warm" to="/dashboard">
                      <span>Go to Dashboard</span>
                      <span className="btn-arrow">→</span>
                    </Link>
                  ) : (
                    <>
                      <Link className="btn btn-primary btn-lg shadow-warm" to="/register">
                        <span>Get Started Free</span>
                        <span className="btn-arrow">→</span>
                      </Link>
                      <Link className="btn btn-outline-secondary btn-lg" to="/login">
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="visual-card card-1">
                  <div className="card-icon">📅</div>
                  <div className="card-content">
                    <h3>Smart Scheduling</h3>
                    <p>Book sessions with flexible time slots</p>
                  </div>
                </div>
                <div className="visual-card card-2">
                  <div className="card-icon">✓</div>
                  <div className="card-content">
                    <h3>Admin Approved</h3>
                    <p>Every booking personally reviewed</p>
                  </div>
                </div>
                <div className="visual-card card-3">
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <h3>Track Everything</h3>
                    <p>Monitor sessions and payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <>
          <section className="features-section">
            <div className="container">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Why Choose Hedy's Studio?</h2>
                <p className="section-subtitle">Everything you need for effortless session management</p>
              </div>

              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>🎯</span>
                    </div>
                    <h3 className="feature-title">Flexible Booking</h3>
                    <p className="feature-description">
                      Choose one-time sessions or set up recurring bookings for weekly, biweekly,
                      or monthly appointments. Scheduling that adapts to your needs.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>✨</span>
                    </div>
                    <h3 className="feature-title">Quality Assurance</h3>
                    <p className="feature-description">
                      Every session request is personally reviewed by our team. Get instant email
                      notifications when your booking is confirmed or needs adjustments.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>💳</span>
                    </div>
                    <h3 className="feature-title">Payment Tracking</h3>
                    <p className="feature-description">
                      Keep tabs on your payment status and session history. Everything organized
                      in your personal dashboard with real-time updates.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>📧</span>
                    </div>
                    <h3 className="feature-title">Smart Notifications</h3>
                    <p className="feature-description">
                      Stay informed with automated email alerts for booking confirmations,
                      status changes, and upcoming sessions. Never miss a beat.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>🗓️</span>
                    </div>
                    <h3 className="feature-title">Visual Calendar</h3>
                    <p className="feature-description">
                      Browse available time slots with our intuitive calendar interface.
                      See your schedule at a glance and book with confidence.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <span>🔒</span>
                    </div>
                    <h3 className="feature-title">Secure & Private</h3>
                    <p className="feature-description">
                      Your data is protected with industry-standard security. Book sessions
                      with peace of mind knowing your information is safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section">
            <div className="container">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">Get started in four simple steps</p>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-3 mb-4">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3 className="step-title">Create Account</h3>
                    <p className="step-description">Sign up with your email in seconds</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3 className="step-title">Choose Time</h3>
                    <p className="step-description">Select your preferred date and slot</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3 className="step-title">Get Approved</h3>
                    <p className="step-description">Receive confirmation via email</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h3 className="step-title">Attend Session</h3>
                    <p className="step-description">Show up and enjoy your studio time</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="container">
              <div className="cta-card">
                <h2 className="cta-title">Ready to Get Started?</h2>
                <p className="cta-subtitle">
                  Join Hedy's Studio today and experience professional session management.
                </p>
                <div className="cta-buttons">
                  <Link className="btn btn-light btn-lg" to="/register">
                    <span>Create Your Account</span>
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link className="btn btn-outline-light btn-lg" to="/login">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default HomePage;
