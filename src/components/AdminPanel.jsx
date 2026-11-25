import React, { useState } from 'react';
import {
  readUsers,
  saveUsers,
  makeId,
  readAdminLog,
  logAdminAction,
  clearAdminLog
} from '../utils/storage';

export default function AdminPanel({ currentUser, onUpdateAdminSelf }) {
  const [users, setUsers] = useState(() => readUsers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [adminLog, setAdminLog] = useState(() => readAdminLog());

  const refreshUsers = () => {
    const u = readUsers();
    setUsers(u);
    setAdminLog(readAdminLog());
    if (selectedUser) {
      const refreshedSelected = u.find(x => x.id === selectedUser.id);
      setSelectedUser(refreshedSelected || null);
    }
  };

  const memberUsers = users.filter(u => u.role !== 'admin');

  // Metrics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const registeredCount = memberUsers.length;
  const activeCount = memberUsers.filter(u => u.active !== false).length;
  const newThisMonth = memberUsers.filter(u => u.createdAt && new Date(u.createdAt) >= startOfMonth).length;
  const totalMemberActivities = memberUsers.reduce((sum, u) => sum + (u.activities || []).length, 0);

  // Admin's own records
  const adminActivities = currentUser.activities || [];
  const adminFoods = currentUser.foods || [];
  const adminWorkoutMinutes = adminActivities.reduce((s, a) => s + Number(a.duration || 0), 0);
  const adminCaloriesBurned = adminActivities.reduce((s, a) => s + Number(a.burned || 0), 0);
  const adminCaloriesConsumed = adminFoods.reduce((s, f) => s + Number(f.calories || 0), 0);

  // Filter & Sort
  const filteredUsers = memberUsers.filter(u => {
    const name = String(u.profileName || u.name || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    const query = search.trim().toLowerCase();
    const matchesSearch = name.includes(query) || email.includes(query);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? u.active !== false : u.active === false);
    return matchesSearch && matchesStatus;
  });

  filteredUsers.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'activities') return (b.activities || []).length - (a.activities || []).length;
    return String(a.profileName || a.name || '').localeCompare(String(b.profileName || b.name || ''));
  });

  // Activity Overview
  const activityCounts = {};
  memberUsers.forEach(user => {
    (user.activities || []).forEach(act => {
      const t = String(act.type || 'Other');
      activityCounts[t] = (activityCounts[t] || 0) + 1;
    });
  });
  const sortedActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxActivityCount = Math.max(1, ...sortedActivities.map(e => e[1]));

  // Actions
  const handleToggleUser = (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextActive = target.active === false;
    const updated = users.map(u => u.id === id ? { ...u, active: nextActive } : u);
    saveUsers(updated);
    logAdminAction(`${nextActive ? "Reactivated" : "Suspended"} account: ${target.email}`, currentUser.profileName);
    refreshUsers();
  };

  const handleDeleteUser = (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    if (!window.confirm(`Delete the account for ${target.email} and all of its demo data? This cannot be undone.`)) return;
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
    logAdminAction(`Deleted account: ${target.email}`, currentUser.profileName);
    if (selectedUser?.id === id) setSelectedUser(null);
    refreshUsers();
  };

  const handleExportCSV = () => {
    const columns = ["Name", "Email", "Status", "Registration Date", "Activities", "Food Entries", "Goals"];
    const rows = memberUsers.map(u => [
      u.profileName || u.name || "",
      u.email || "",
      u.active === false ? "Suspended" : "Active",
      u.createdAt || "",
      (u.activities || []).length,
      (u.foods || []).length,
      (u.goals || []).length
    ]);
    const csvCell = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [columns, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FitTrack-Pro-Users.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    logAdminAction(`Exported CSV report (${memberUsers.length} user accounts)`, currentUser.profileName);
    setAdminLog(readAdminLog());
  };

  const handleClearLog = () => {
    if (!window.confirm("Clear the local admin activity log?")) return;
    clearAdminLog();
    setAdminLog([]);
  };

  const handleSendSuggestion = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const title = suggestionTitle.trim();
    const msg = suggestionMessage.trim();
    if (!title || !msg) return;

    const all = readUsers();
    const idx = all.findIndex(u => u.id === selectedUser.id);
    if (idx < 0) return;

    all[idx].adminSuggestions = all[idx].adminSuggestions || [];
    all[idx].adminSuggestions.push({
      id: makeId(),
      title,
      message: msg,
      at: new Date().toISOString(),
      by: currentUser.email
    });

    saveUsers(all);
    logAdminAction(`Sent a fitness suggestion to ${all[idx].email}`, currentUser.profileName);
    setSuggestionTitle('');
    setSuggestionMessage('');
    refreshUsers();
    alert("Suggestion sent to user successfully!");
  };

  return (
    <div>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">FITTRACK PRO / ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage accounts, review fitness activity, and export reports.</p>
        </div>
        <button type="button" onClick={handleExportCSV}>Export Users CSV</button>
      </div>

      <div className="grid admin-metrics">
        <div className="card admin-stat">
          <p className="muted">Registered Users</p>
          <div className="metric">{registeredCount}</div>
          <p className="stat-note">All member accounts</p>
        </div>
        <div className="card admin-stat">
          <p className="muted">Active Accounts</p>
          <div className="metric">{activeCount}</div>
          <p className="stat-note">Currently enabled</p>
        </div>
        <div className="card admin-stat">
          <p className="muted">New This Month</p>
          <div className="metric">{newThisMonth}</div>
          <p className="stat-note">Recent registrations</p>
        </div>
        <div className="card admin-stat">
          <p className="muted">Activities Logged</p>
          <div className="metric">{totalMemberActivities}</div>
          <p className="stat-note">Across all users</p>
        </div>
      </div>

      {/* Admin's Own Fitness Records */}
      <div className="card">
        <div className="admin-card-heading">
          <div>
            <h3>Administrator Fitness Records</h3>
            <p className="muted">
              Sample workout, nutrition and hydration records for the admin account, displayed separately from member records.
            </p>
          </div>
        </div>
        <div className="grid">
          <div className="detail-item">
            <span>Activities logged</span>
            <strong>{adminActivities.length}</strong>
          </div>
          <div className="detail-item">
            <span>Workout minutes</span>
            <strong>{adminWorkoutMinutes}</strong>
          </div>
          <div className="detail-item">
            <span>Calories burned</span>
            <strong>{adminCaloriesBurned} kcal</strong>
          </div>
          <div className="detail-item">
            <span>Food calories</span>
            <strong>{adminCaloriesConsumed} kcal</strong>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card">
        <div className="admin-card-heading">
          <div>
            <h3>User Management</h3>
            <p className="muted">Search, filter, inspect, and manage registered members.</p>
          </div>
          <span className="result-count">{filteredUsers.length} of {memberUsers.length} users</span>
        </div>

        <div className="admin-filters">
          <div>
            <label htmlFor="userSearch">Search</label>
            <input
              id="userSearch"
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="userStatusFilter">Account status</label>
            <select
              id="userStatusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Suspended</option>
            </select>
          </div>
          <div>
            <label htmlFor="userSort">Sort by</label>
            <select
              id="userSort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A–Z)</option>
              <option value="newest">Newest registered</option>
              <option value="oldest">Oldest registered</option>
              <option value="activities">Most activities</option>
            </select>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Activities</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.profileName || u.name || "Unnamed"}</strong></td>
                    <td>{u.email}</td>
                    <td>{(u.activities || []).length}</td>
                    <td>
                      {u.createdAt && !isNaN(new Date(u.createdAt).getTime())
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <span className={`status-pill ${u.active === false ? "status-inactive" : "status-active"}`}>
                        {u.active === false ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="small-btn secondary"
                          onClick={() => setSelectedUser(u)}
                        >
                          View
                        </button>
                        <button
                          className={`small-btn ${u.active === false ? "" : "secondary"}`}
                          onClick={() => handleToggleUser(u.id)}
                        >
                          {u.active === false ? "Reactivate" : "Suspend"}
                        </button>
                        <button
                          className="small-btn danger"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted" style={{ padding: '18px 0' }}>
            No users match these search and filter settings.
          </p>
        )}
      </div>

      {/* Fitness Activity Overview */}
      <div className="card">
        <div className="admin-card-heading">
          <div>
            <h3>Fitness Activity Overview</h3>
            <p className="muted">Activity entries recorded by members.</p>
          </div>
        </div>
        {sortedActivities.length > 0 ? (
          <div className="activity-overview">
            {sortedActivities.map(([t, count]) => (
              <div className="activity-bar-row" key={t}>
                <span>{t}</span>
                <div className="activity-bar-track">
                  <div
                    className="activity-bar-fill"
                    style={{ width: `${Math.round((count / maxActivityCount) * 100)}%` }}
                  ></div>
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No fitness activities have been recorded yet.</p>
        )}
      </div>

      {/* Recent Admin Activity */}
      <div className="card">
        <div className="admin-card-heading">
          <div>
            <h3>Recent Admin Activity</h3>
            <p className="muted">A local log of account-management actions in this demo.</p>
          </div>
          <button className="secondary small-btn" onClick={handleClearLog}>
            Clear Log
          </button>
        </div>
        {adminLog.length > 0 ? (
          <div className="admin-log">
            {adminLog.slice(0, 10).map((item, idx) => (
              <div className="log-entry" key={idx}>
                <span>
                  {item.action}{' '}
                  <span className="muted">by {item.by || "Administrator"}</span>
                </span>
                <span className="log-time">{new Date(item.at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No admin actions recorded yet. Account changes will appear here.</p>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedUser(null);
          }}
        >
          <div className="modal-card">
            <div className="modal-heading">
              <h2>Member Details: {selectedUser.profileName || selectedUser.name}</h2>
              <button className="secondary small-btn" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>

            <p className="muted">
              {selectedUser.email} ·{' '}
              <span className={`status-pill ${selectedUser.active === false ? "status-inactive" : "status-active"}`}>
                {selectedUser.active === false ? "Suspended" : "Active"}
              </span>
            </p>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Activities logged</span>
                <strong>{(selectedUser.activities || []).length}</strong>
              </div>
              <div className="detail-item">
                <span>Workout minutes</span>
                <strong>
                  {(selectedUser.activities || []).reduce((s, a) => s + Number(a.duration || 0), 0)}
                </strong>
              </div>
              <div className="detail-item">
                <span>Calories burned</span>
                <strong>
                  {(selectedUser.activities || []).reduce((s, a) => s + Number(a.burned || 0), 0)} kcal
                </strong>
              </div>
              <div className="detail-item">
                <span>Food entries</span>
                <strong>{(selectedUser.foods || []).length}</strong>
              </div>
              <div className="detail-item">
                <span>Calories consumed</span>
                <strong>
                  {(selectedUser.foods || []).reduce((s, f) => s + Number(f.calories || 0), 0)} kcal
                </strong>
              </div>
              <div className="detail-item">
                <span>Goals recorded</span>
                <strong>{(selectedUser.goals || []).length}</strong>
              </div>
              <div className="detail-item">
                <span>Water recorded (all dates)</span>
                <strong>
                  {Object.values(selectedUser.waterRecords || {}).reduce((s, v) => s + Number(v || 0), 0)} ml
                </strong>
              </div>
              <div className="detail-item">
                <span>Registration date</span>
                <strong style={{ fontSize: '15px' }}>
                  {selectedUser.createdAt && !isNaN(new Date(selectedUser.createdAt).getTime())
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>
            </div>

            <h3>Recent Workouts</h3>
            {(selectedUser.activities || []).length > 0 ? (
              [...(selectedUser.activities || [])]
                .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                .slice(0, 8)
                .map((a) => (
                  <div className="log-entry" key={a.id} style={{ padding: '8px 0' }}>
                    <span>
                      <strong>{a.type || "Workout"}</strong> · {a.duration} min · {a.burned} kcal
                    </span>
                    <span className="log-time">{a.date}</span>
                  </div>
                ))
            ) : (
              <p className="muted">No workout records yet.</p>
            )}

            <h3 style={{ marginTop: '20px' }}>Admin Suggestions Sent</h3>
            {(selectedUser.adminSuggestions || []).length > 0 ? (
              [...(selectedUser.adminSuggestions || [])].reverse().map((item) => (
                <div className="recommendation-item" key={item.id}>
                  <strong>{item.title || "Fitness recommendation"}</strong>
                  <p style={{ margin: '4px 0' }}>{item.message}</p>
                  <small>{item.at ? new Date(item.at).toLocaleString() : ""}</small>
                </div>
              ))
            ) : (
              <p className="muted">No suggestions sent yet.</p>
            )}

            <form className="admin-suggestion-form" onSubmit={handleSendSuggestion}>
              <h3>Send a Personalized Suggestion</h3>
              <p className="muted">
                Use the member's workout, calorie, nutrition and goal records to write practical feedback.
              </p>
              <label htmlFor="suggestionTitle">Suggestion title</label>
              <input
                id="suggestionTitle"
                placeholder="e.g. Build a steady walking routine"
                value={suggestionTitle}
                onChange={(e) => setSuggestionTitle(e.target.value)}
                required
              />
              <label htmlFor="suggestionMessage">Message to member</label>
              <textarea
                id="suggestionMessage"
                placeholder="Write a supportive suggestion based on this member's records..."
                value={suggestionMessage}
                onChange={(e) => setSuggestionMessage(e.target.value)}
                required
              />
              <button type="submit">Send Suggestion to User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
