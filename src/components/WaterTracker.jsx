import React from 'react';
import { today, WATER_GOAL } from '../utils/storage';

export default function WaterTracker({ user, onUpdateUser }) {
  const todayDate = today();
  const currentWater = Number(user.waterRecords?.[todayDate] || 0);
  const percent = Math.min(100, Math.round((currentWater / WATER_GOAL) * 100));

  const addWater = (amount) => {
    const updatedRecords = { ...(user.waterRecords || {}) };
    updatedRecords[todayDate] = currentWater + amount;
    onUpdateUser({ waterRecords: updatedRecords });
  };

  const resetWater = () => {
    if (!window.confirm("Reset today's water intake?")) return;
    const updatedRecords = { ...(user.waterRecords || {}) };
    updatedRecords[todayDate] = 0;
    onUpdateUser({ waterRecords: updatedRecords });
  };

  return (
    <div>
      <h1>Water Intake Tracker </h1>

      <div className="card">
        <h3>Daily Hydration</h3>
        <p className="muted">
          Demo target: {WATER_GOAL} ml per day. Stay hydrated and track your cups throughout the day.
        </p>

        <div className="metric">
          <span>{currentWater}</span> / {WATER_GOAL} ml
        </div>

        <div className="progress-track" style={{ height: '14px', margin: '16px 0' }}>
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
          <button type="button" onClick={() => addWater(250)}>+ 250 ml</button>
          <button type="button" onClick={() => addWater(500)}>+ 500 ml</button>
          <button type="button" className="secondary" onClick={resetWater}>
            Reset Today's Water
          </button>
        </div>

        <p style={{ marginTop: '18px', fontWeight: 600, color: currentWater >= WATER_GOAL ? '#4ade80' : '#FF7B86' }}>
          {currentWater >= WATER_GOAL
            ? "Daily demo target reached! Outstanding work on your hydration."
            : `Keep tracking your water intake. ${Math.max(0, WATER_GOAL - currentWater)} ml more to reach your goal.`}
        </p>
      </div>
    </div>
  );
}
