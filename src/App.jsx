import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import AppLayout from './components/AppLayout';
import {
  initializeDemoData,
  getCurrentSessionUser,
  saveSessionUser,
  updateUserInStorage
} from './utils/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('landing'); // 'landing' | 'auth' | 'app'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 1. Initialize demo admin and demo members
    initializeDemoData();

    // 2. Check for active session
    const sessionUser = getCurrentSessionUser();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }

    // 3. Check hash
    const hash = window.location.hash.toLowerCase();
    if (hash === '#register') {
      setPage('auth');
      setAuthMode('register');
    } else if (hash === '#login') {
      setPage('auth');
      setAuthMode('login');
    } else if (hash === '#app' && sessionUser) {
      setPage('app');
    }

    setInitialized(true);
  }, []);

  const handleNavigate = (targetPage, mode = 'login') => {
    if (targetPage === 'auth') {
      setAuthMode(mode);
      setPage('auth');
      window.location.hash = mode;
    } else if (targetPage === 'app') {
      if (currentUser) {
        setPage('app');
        window.location.hash = 'app';
      } else {
        setAuthMode('login');
        setPage('auth');
        window.location.hash = 'login';
      }
    } else {
      setPage('landing');
      window.location.hash = '';
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage('app');
    window.location.hash = 'app';
  };

  const handleLogout = () => {
    saveSessionUser(null);
    setCurrentUser(null);
    setPage('landing');
    window.location.hash = '';
  };

  const handleUpdateUser = (changes) => {
    if (!currentUser) return;
    const updated = updateUserInStorage(currentUser.id, changes);
    if (updated) {
      setCurrentUser({ ...updated });
    }
  };

  if (!initialized) return null;

  return (
    <div>
      {page === 'landing' && (
        <LandingPage
          onNavigate={(target, mode) => {
            if (target === 'auth') {
              handleNavigate('auth', mode);
            } else if (target === 'app') {
              handleNavigate('app');
            }
          }}
        />
      )}

      {page === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onLogin={handleLoginSuccess}
          onBackToLanding={() => handleNavigate('landing')}
        />
      )}

      {page === 'app' && currentUser && (
        <AppLayout
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onGoToLanding={() => handleNavigate('landing')}
        />
      )}
    </div>
  );
}
