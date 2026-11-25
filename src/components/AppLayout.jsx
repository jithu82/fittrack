import React, { useState } from 'react';
import {
  BrandLogo,
  DashboardIcon,
  ActivityIcon,
  NutritionIcon,
  WaterIcon,
  GoalIcon,
  ProgressIcon,
  ProfileIcon,
  AdminIcon,
  LogoutIcon
} from './Icons';
import Dashboard from './Dashboard';
import ActivityTracker from './ActivityTracker';
import NutritionTracker from './NutritionTracker';
import WaterTracker from './WaterTracker';
import GoalsTracker from './GoalsTracker';
import ProgressReport from './ProgressReport';
import Profile from './Profile';
import AdminPanel from './AdminPanel';

export default function AppLayout({ user, onUpdateUser, onLogout, onGoToLanding }) {
  const [section, setSection] = useState('dashboard');

  const titles = {
    dashboard: "Fitness Dashboard",
    activity: "Activity Tracker",
    nutrition: "Nutrition Tracker",
    water: "Water Tracker",
    goals: "Fitness Goals",
    progress: "Progress & Achievements",
    profile: "User Profile",
    admin: "Admin Control Center"
  };

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo" onClick={() => setSection('dashboard')}>
          <BrandLogo /> FitTrack Pro
        </div>

        <button
          className={`nav-btn ${section === 'dashboard' ? 'active' : ''}`}
          onClick={() => setSection('dashboard')}
        >
          <DashboardIcon /> Dashboard
        </button>

        <button
          className={`nav-btn ${section === 'activity' ? 'active' : ''}`}
          onClick={() => setSection('activity')}
        >
          <span className="nav-icon"><ActivityIcon /></span> Activity
        </button>

        <button
          className={`nav-btn ${section === 'nutrition' ? 'active' : ''}`}
          onClick={() => setSection('nutrition')}
        >
          <span className="nav-icon"><NutritionIcon /></span> Nutrition
        </button>

        <button
          className={`nav-btn ${section === 'water' ? 'active' : ''}`}
          onClick={() => setSection('water')}
        >
          <span className="nav-icon"><WaterIcon /></span> Water Tracker
        </button>

        <button
          className={`nav-btn ${section === 'goals' ? 'active' : ''}`}
          onClick={() => setSection('goals')}
        >
          <span className="nav-icon"><GoalIcon /></span> Goals
        </button>

        <button
          className={`nav-btn ${section === 'progress' ? 'active' : ''}`}
          onClick={() => setSection('progress')}
        >
          <span className="nav-icon"><ProgressIcon /></span> Progress & Badges
        </button>

        <button
          className={`nav-btn ${section === 'profile' ? 'active' : ''}`}
          onClick={() => setSection('profile')}
        >
          <ProfileIcon /> Profile
        </button>

        {user.role === 'admin' && (
          <button
            className={`nav-btn ${section === 'admin' ? 'active' : ''}`}
            onClick={() => setSection('admin')}
          >
            <AdminIcon /> Admin Panel
          </button>
        )}

        <div style={{ marginTop: '30px', borderTop: '1px solid #292A31', paddingTop: '15px' }}>
          <button
            className="nav-btn"
            onClick={onGoToLanding}
            style={{ color: '#A1A1AA' }}
          >
            <span className="nav-icon">🌐</span> Landing Page
          </button>

          <button
            className="nav-btn"
            onClick={onLogout}
            style={{ color: '#FF7B86' }}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content-area">
        <header className="topbar">
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{titles[section] || "Fitness Dashboard"}</h2>
            <p className="muted" style={{ margin: 0, fontSize: '13px' }}>Small steps, stronger you.</p>
          </div>
          <div className="topbar-right">
            <span style={{ fontWeight: 600 }}>Hi, {user.profileName || user.name}</span>
            <button
              className="small-btn secondary"
              onClick={onGoToLanding}
              title="Return to Landing Page"
            >
              Website Home
            </button>
          </div>
        </header>

        <main className="content-pane">
          {section === 'dashboard' && (
            <Dashboard user={user} onNavigateSection={setSection} />
          )}
          {section === 'activity' && (
            <ActivityTracker user={user} onUpdateUser={onUpdateUser} />
          )}
          {section === 'nutrition' && (
            <NutritionTracker user={user} onUpdateUser={onUpdateUser} />
          )}
          {section === 'water' && (
            <WaterTracker user={user} onUpdateUser={onUpdateUser} />
          )}
          {section === 'goals' && (
            <GoalsTracker user={user} onUpdateUser={onUpdateUser} />
          )}
          {section === 'progress' && (
            <ProgressReport user={user} />
          )}
          {section === 'profile' && (
            <Profile user={user} onUpdateUser={onUpdateUser} />
          )}
          {section === 'admin' && user.role === 'admin' && (
            <AdminPanel currentUser={user} onUpdateAdminSelf={onUpdateUser} />
          )}
        </main>
      </div>
    </div>
  );
}
