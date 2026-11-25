import React, { useState, useEffect } from 'react';
import { BrandLogo } from './Icons';
import { readUsers, saveUsers, makeId, ensureUserData, saveSessionUser } from '../utils/storage';

export default function AuthPage({ initialMode = 'login', onLogin, onBackToLanding }) {
  const [mode, setMode] = useState(initialMode);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#dc3545');

  useEffect(() => {
    setMode(initialMode);
    setMessage('');
  }, [initialMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !password) {
      setMessageColor('#dc3545');
      setMessage('Please enter both email and password.');
      return;
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setMessageColor('#dc3545');
      setMessage('Incorrect email or password.');
      return;
    }

    if (user.active === false) {
      setMessageColor('#dc3545');
      setMessage('This account has been deactivated by the administrator.');
      return;
    }

    ensureUserData(user);
    saveSessionUser(user.id);
    onLogin(user);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();
    const password = regPassword;

    if (!name || !email || password.length < 6) {
      setMessageColor('#dc3545');
      setMessage('Enter all details and use a password with at least 6 characters.');
      return;
    }

    const users = readUsers();
    if (users.some(u => u.email === email)) {
      setMessageColor('#dc3545');
      setMessage('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: makeId(),
      name,
      profileName: name,
      email,
      password,
      role: 'user',
      active: true,
      activities: [],
      foods: [],
      goals: [],
      waterRecords: {},
      adminSuggestions: [],
      createdAt: new Date().toISOString()
    };

    ensureUserData(newUser);
    users.push(newUser);
    saveUsers(users);

    setMode('login');
    setLoginEmail(email);
    setLoginPassword('');
    setMessageColor('#087443');
    setMessage('Account created successfully! Please log in.');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" onClick={onBackToLanding} style={{ cursor: 'pointer' }}>
            <BrandLogo /> FitTrack Pro
          </div>
          <button
            className="secondary small-btn"
            onClick={onBackToLanding}
            style={{ borderRadius: '6px' }}
          >
            ← Home
          </button>
        </div>
        <p className="muted">Your fitness journey starts here.</p>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
            <h2>Welcome Back!</h2>

            <label htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type="submit" className="full">Login</button>

            <p style={{ marginTop: '18px' }}>
              New user?{' '}
              <span
                className="switch-auth"
                onClick={() => {
                  setMode('register');
                  setMessage('');
                }}
              >
                Create an account
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
            <h2>Create Account</h2>

            <label htmlFor="regName">Full Name</label>
            <input
              id="regName"
              placeholder="Enter your full name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />

            <label htmlFor="regEmail">Email Address</label>
            <input
              id="regEmail"
              type="email"
              placeholder="Enter your email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <label htmlFor="regPassword">Password</label>
            <input
              id="regPassword"
              type="password"
              minLength={6}
              placeholder="At least 6 characters"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />

            <button type="submit" className="full">Create Account</button>

            <p style={{ marginTop: '18px' }}>
              Already registered?{' '}
              <span
                className="switch-auth"
                onClick={() => {
                  setMode('login');
                  setMessage('');
                }}
              >
                Login
              </span>
            </p>
          </form>
        )}

        {message && (
          <p style={{ marginTop: '15px', color: messageColor, fontWeight: 600 }}>
            {message}
          </p>
        )}

        <div className="card" style={{ marginTop: '20px', padding: '14px', background: '#202127', border: '1px solid #33343E' }}>
          <p className="muted" style={{ fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#F4F4F5' }}>Demo Administrator:</strong> admin@fittrack.com<br />
            <strong style={{ color: '#F4F4F5' }}>Password:</strong> Admin123!<br />
            <span style={{ color: '#A1A1AA' }}>Or use any member account like aarav@fittrack.com / Aarav123!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
