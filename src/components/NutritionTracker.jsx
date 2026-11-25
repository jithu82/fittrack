import React, { useState } from 'react';
import { today, makeId } from '../utils/storage';

export default function NutritionTracker({ user, onUpdateUser }) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const todayDate = today();
  const currentFoods = (user.foods || []).filter(f => f.date === todayDate);
  const total = currentFoods.reduce((sum, f) => sum + Number(f.calories || 0), 0);

  const handleAddFood = (e) => {
    e.preventDefault();
    const calNum = Number(calories);
    const trimmedName = name.trim();

    if (!trimmedName || !calNum || calNum <= 0) {
      alert("Please enter a valid food name and positive calorie amount.");
      return;
    }

    const newFood = {
      id: makeId(),
      name: trimmedName,
      calories: calNum,
      date: todayDate
    };

    const updated = [...(user.foods || []), newFood];
    onUpdateUser({ foods: updated });

    setName('');
    setCalories('');
    setSuccessMsg('Food entry saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this food entry?")) return;
    const updated = (user.foods || []).filter(f => f.id !== id);
    onUpdateUser({ foods: updated });
  };

  return (
    <div>
      <h1>Nutrition Tracker </h1>

      <div className="card">
        <h3>Record Food Intake</h3>
        <form onSubmit={handleAddFood}>
          <label htmlFor="foodName">Food Item</label>
          <input
            id="foodName"
            placeholder="e.g. Idli, rice, fruits, oatmeal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="foodCalories">Calories (kcal)</label>
          <input
            id="foodCalories"
            type="number"
            min="1"
            placeholder="e.g. 350"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />

          <button type="submit">Add Food</button>
          {successMsg && (
            <span style={{ marginLeft: '12px', color: '#4ade80', fontWeight: 600 }}>
              {successMsg}
            </span>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Today's Food History</h3>
        <p className="muted" style={{ marginBottom: '12px', fontSize: '15px' }}>
          Today's total: <strong style={{ color: '#F4F4F5' }}>{total} kcal</strong>
        </p>

        {currentFoods.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Calories</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentFoods.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.name}</strong></td>
                    <td>{f.calories} kcal</td>
                    <td>
                      <button
                        className="small-btn danger"
                        onClick={() => handleDelete(f.id)}
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
          <p className="muted">No food entries for today.</p>
        )}
      </div>
    </div>
  );
}
