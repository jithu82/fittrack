import React, { useState } from 'react';
import { makeId, today, WATER_GOAL } from '../utils/storage';

export default function GoalsTracker({ user, onUpdateUser }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Activity');
  const [target, setTarget] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const todayDate = today();
  const currentActivities = (user.activities || []).filter(a => a.date === todayDate);
  const currentWater = Number(user.waterRecords?.[todayDate] || 0);

  const handleCreate = (e) => {
    e.preventDefault();
    const targetNum = Number(target);
    const trimmed = name.trim();

    if (!trimmed || !targetNum || targetNum <= 0) {
      alert("Please provide a valid goal description and target value.");
      return;
    }

    const newGoal = {
      id: makeId(),
      name: trimmed,
      category,
      target: targetNum,
      completed: false,
      createdAt: todayDate
    };

    const updated = [...(user.goals || []), newGoal];
    onUpdateUser({ goals: updated });

    setName('');
    setTarget('');
    setSuccessMsg('Goal created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggle = (id) => {
    const updated = (user.goals || []).map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    onUpdateUser({ goals: updated });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this goal?")) return;
    const updated = (user.goals || []).filter(g => g.id !== id);
    onUpdateUser({ goals: updated });
  };

  // Smart suggestions
  const suggestions = [];
  if (currentActivities.length === 0) {
    suggestions.push("Record a short walk or workout today.");
  }
  if (currentWater < WATER_GOAL) {
    suggestions.push("Keep track of your water intake throughout the day.");
  }
  if ((user.goals || []).length === 0) {
    suggestions.push("Set a realistic weekly activity goal.");
  }
  suggestions.push("Review your weekly report and adjust your goals.");

  const goals = user.goals || [];

  return (
    <div>
      <h1>Fitness Goals </h1>

      <div className="card">
        <h3>Create a Goal</h3>
        <form onSubmit={handleCreate}>
          <label htmlFor="goalName">Goal Description</label>
          <input
            id="goalName"
            placeholder="e.g. Walk 8000 steps daily or Drink 2L water"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="goalCategory">Goal Category</label>
          <select
            id="goalCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Activity">Activity</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Hydration">Hydration</option>
            <option value="Workout">Workout</option>
          </select>

          <label htmlFor="goalTarget">Target Value</label>
          <input
            id="goalTarget"
            type="number"
            min="1"
            placeholder="e.g. 8000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />

          <button type="submit">Create Goal</button>
          {successMsg && (
            <span style={{ marginLeft: '12px', color: '#4ade80', fontWeight: 600 }}>
              {successMsg}
            </span>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Smart Goal Suggestions </h3>
        <div>
          {suggestions.map((s, idx) => (
            <div className="notice" key={idx} style={{ margin: '8px 0' }}>
              💡 {s}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Your Goals</h3>
        {goals.length > 0 ? (
          <div>
            {goals.map((g) => (
              <div className="notice" key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '16px', color: '#F4F4F5' }}>{g.name}</strong>
                <p className="muted" style={{ margin: 0 }}>
                  {g.category} · Target: {g.target}
                </p>
                <p style={{ fontWeight: 600, color: g.completed ? '#4ade80' : '#FFB26B', margin: '4px 0' }}>
                  {g.completed ? "✔ Completed" : "⏳ In progress"}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    className="small-btn"
                    onClick={() => handleToggle(g.id)}
                  >
                    {g.completed ? "Mark Incomplete" : "Complete Goal"}
                  </button>
                  <button
                    className="small-btn danger"
                    onClick={() => handleDelete(g.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No goals yet. Create your first goal above.</p>
        )}
      </div>
    </div>
  );
}
