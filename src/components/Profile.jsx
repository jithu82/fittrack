import React, { useState } from 'react';
import { readUsers, saveUsers } from '../utils/storage';

export default function Profile({ user, onUpdateUser }) {
  const [profileName, setProfileName] = useState(user.profileName || user.name || '');
  const [nameMsg, setNameMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordMsgColor, setPasswordMsgColor] = useState('#4ade80');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const trimmed = profileName.trim();
    if (!trimmed) {
      alert("Please enter your name.");
      return;
    }
    onUpdateUser({ profileName: trimmed, name: trimmed });
    setNameMsg('Profile updated successfully!');
    setTimeout(() => setNameMsg(''), 3000);
  };

  const getPasswordStrength = () => {
    const val = newPassword;
    if (!val) return "Use at least 8 characters, including letters and numbers.";
    const score = [
      val.length >= 8,
      /[A-Za-z]/.test(val),
      /\d/.test(val),
      /[^A-Za-z0-9]/.test(val)
    ].filter(Boolean).length;
    const labels = [
      "Use at least 8 characters, including letters and numbers.",
      "Weak password",
      "Fair password",
      "Good password",
      "Strong password"
    ];
    return labels[score];
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (currentPassword !== user.password) {
      setPasswordMsgColor('#f87171');
      setPasswordMsg("Your current password is incorrect.");
      return;
    }
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordMsgColor('#f87171');
      setPasswordMsg("Choose at least 8 characters and include both letters and numbers.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsgColor('#f87171');
      setPasswordMsg("The new passwords do not match.");
      return;
    }

    const users = readUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index < 0) {
      setPasswordMsgColor('#f87171');
      setPasswordMsg("Account not found. Please sign in again.");
      return;
    }

    users[index].password = newPassword;
    saveUsers(users);
    onUpdateUser({ password: newPassword });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsgColor('#4ade80');
    setPasswordMsg("Password updated successfully!");
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  return (
    <div>
      <h1>My Profile </h1>

      <div className="card">
        <h3>Personal Information</h3>
        <form onSubmit={handleSaveProfile}>
          <label htmlFor="profileName">Full Name</label>
          <input
            id="profileName"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />

          <label htmlFor="profileEmail">Email Address</label>
          <input
            id="profileEmail"
            value={user.email || ''}
            disabled
            style={{ opacity: 0.7, cursor: 'not-allowed' }}
          />

          <button type="submit">Save Profile</button>
          {nameMsg && (
            <span style={{ marginLeft: '12px', color: '#4ade80', fontWeight: 600 }}>
              {nameMsg}
            </span>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Account Security</h3>
        <p className="muted">
          Update your password for this demo account. Use a unique password and do not share it.
        </p>
        <div className="security-note">
          Demo note: account data is stored locally in this browser's localStorage for demonstration and prototype use.
        </div>

        <form onSubmit={handleUpdatePassword}>
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="password-strength">{getPasswordStrength()}</p>

          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
          {passwordMsg && (
            <span style={{ marginLeft: '12px', color: passwordMsgColor, fontWeight: 600 }}>
              {passwordMsg}
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
