import React from 'react';
import {
  BrandLogo,
  FireIcon,
  WaterIcon,
  ActivityIcon,
  NutritionIcon,
  GoalIcon,
  ProgressIcon,
  BadgeIcon
} from './Icons';

export default function LandingPage({ onNavigate }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="container navbar">
          <div className="brand" onClick={() => scrollTo('home')}>
            <BrandLogo /> FitTrack <span>Pro</span>
          </div>
          <nav className="nav-links">
            <a onClick={() => scrollTo('home')}>Home</a>
            <a onClick={() => scrollTo('features')}>Features</a>
            <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
          </nav>
          <div className="nav-actions">
            <button className="btn btn-outline" onClick={() => onNavigate('auth', 'login')}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('auth', 'register')}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Your complete fitness and nutrition partner</p>
              <h1>
                Build Better Habits,<br />
                <span>Live Healthier.</span>
              </h1>
              <p className="hero-copy">
                Track your workouts, nutrition, water intake and goals in one place.
                FitTrack Pro helps you stay consistent, motivated and focused on your progress.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate('auth', 'register')}
                >
                  Get Started &nbsp; →
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => onNavigate('auth', 'login')}
                >
                  Login
                </button>
              </div>
              <div className="hero-points">
                <span>Activity tracking</span>
                <span>Nutrition insights</span>
                <span>Personal goals</span>
              </div>
            </div>

            <div className="preview-wrap">
              <div className="preview-glow"></div>
              <div className="preview-card">
                <div className="preview-top">
                  <strong>
                    <BrandLogo /> FitTrack Pro
                  </strong>
                  <span className="live-pill">YOUR OVERVIEW</span>
                </div>
                <div className="score-row">
                  <div className="score-circle">
                    <div className="score-inner">
                      <strong>76</strong>
                      <small>FITNESS SCORE</small>
                    </div>
                  </div>
                  <div className="score-info">
                    <h3>You're making progress!</h3>
                    <p>Small steps today create healthier habits tomorrow.</p>
                  </div>
                </div>
                <div className="mini-stats">
                  <div className="mini-stat">
                    <span className="mini-stat-icon">
                      <FireIcon />
                    </span>
                    <strong>420</strong>
                    <small>Calories burned</small>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-icon">
                      <WaterIcon />
                    </span>
                    <strong>1.5 L</strong>
                    <small>Water consumed</small>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-stat-icon">
                      <ActivityIcon />
                    </span>
                    <strong>35 min</strong>
                    <small>Active time</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="section" id="features">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Our features</p>
              <h2>Everything You Need for a Healthier You</h2>
              <p>Simple tools to help you record your habits, understand your progress and keep moving forward.</p>
            </div>
            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon"><ActivityIcon /></div>
                <h3>Activity Tracking</h3>
                <p>Record daily activities and workouts while tracking your estimated calories burned.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon"><NutritionIcon /></div>
                <h3>Nutrition Management</h3>
                <p>Log meals and monitor your daily calorie intake to build more mindful eating habits.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon"><GoalIcon /></div>
                <h3>Goal Setting</h3>
                <p>Create short-term and long-term fitness goals and monitor your progress toward them.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon"><ProgressIcon /></div>
                <h3>Progress Reports</h3>
                <p>Review weekly activity totals, streaks and achievements in one convenient dashboard.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon"><WaterIcon /></div>
                <h3>Water Tracker</h3>
                <p>Log the water you drink throughout the day and work toward your personal target.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon"><BadgeIcon /></div>
                <h3>Streaks & Badges</h3>
                <p>Celebrate consistency with activity streaks, milestones and achievement badges.</p>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">How it works</p>
              <h2>Three Steps to a Healthier You</h2>
              <p>Get started in minutes and begin building a routine that works for you.</p>
            </div>
            <div className="steps">
              <article className="step">
                <div className="step-number">1</div>
                <h3>Create Your Account</h3>
                <p>Register and set up your personal profile and fitness preferences.</p>
              </article>
              <article className="step">
                <div className="step-number">2</div>
                <h3>Track & Log</h3>
                <p>Record workouts, meals, water intake and daily activity in the dashboard.</p>
              </article>
              <article className="step">
                <div className="step-number">3</div>
                <h3>Review Your Progress</h3>
                <p>Use your reports and goals to identify progress and plan your next steps.</p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box">
              <div>
                <h2>Ready to Start Your Journey?</h2>
                <p>Build consistent habits, stay aware of your progress and take the next step toward your fitness goals.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('auth', 'register')}
              >
                Create Your Account &nbsp; →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="brand" onClick={() => scrollTo('home')}>
            <BrandLogo /> FitTrack <span>Pro</span>
          </div>
          <div className="footer-links">
            <a onClick={() => scrollTo('home')}>Home</a>
            <a onClick={() => scrollTo('features')}>Features</a>
            <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
            <a onClick={() => onNavigate('auth', 'login')}>Login</a>
          </div>
          <p>© 2026 FitTrack Pro · Student project prototype</p>
        </div>
      </footer>
    </div>
  );
}
