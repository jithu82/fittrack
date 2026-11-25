import React, { useState } from 'react';
import { today, makeId } from '../utils/storage';

export default function ActivityTracker({ user, onUpdateUser }) {
  const [type, setType] = useState('Walking');
  const [duration, setDuration] = useState('');
  const [burned, setBurned] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const durNum = Number(duration);
    const burNum = Number(burned);

    if (!durNum || durNum <= 0 || isNaN(burNum) || burNum < 0) {
      alert("Please provide valid duration and calories burned.");
      return;
    }

    const newActivity = {
      id: makeId(),
      type,
      duration: durNum,
      burned: burNum,
      date: today()
    };

    const updatedActivities = [...(user.activities || []), newActivity];
    onUpdateUser({ activities: updatedActivities });

    setDuration('');
    setBurned('');
    setSuccessMsg('Activity saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this activity record?")) return;
    const updated = (user.activities || []).filter(a => a.id !== id);
    onUpdateUser({ activities: updated });
  };

  const list = [...(user.activities || [])].reverse();

  return (
    <div>
      <h1>Activity Tracker </h1>

      <div className="card">
        <h3>Record an Activity</h3>
        <form onSubmit={handleSave}>
          <label htmlFor="activityType">Activity Name</label>
          <select
            id="activityType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="Walking">Walking</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Workout">Workout</option>
            <option value="Yoga">Yoga</option>
            <option value="Swimming">Swimming</option>
          </select>

          <div className="form-row">
            <div>
              <label htmlFor="activityDuration">Duration (minutes)</label>
              <input
                id="activityDuration"
                type="number"
                min="1"
                placeholder="e.g. 30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="activityBurned">Calories Burned (kcal)</label>
              <input
                id="activityBurned"
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={burned}
                onChange={(e) => setBurned(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit">Save Activity</button>
          {successMsg && (
            <span style={{ marginLeft: '12px', color: '#4ade80', fontWeight: 600 }}>
              {successMsg}
            </span>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Activity History</h3>
        {list.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Minutes</th>
                  <th>Calories</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.type}</strong></td>
                    <td>{a.duration} min</td>
                    <td>{a.burned} kcal</td>
                    <td>{a.date}</td>
                    <td>
                      <button
                        className="small-btn danger"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No activities recorded yet.</p>
        )}
      </div>
    </div>
  );
}
