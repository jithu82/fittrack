import React from 'react';
import { getLastSevenDays, WATER_GOAL } from '../utils/storage';

export default function ProgressReport({ user }) {
  const activities = user.activities || [];
  const foods = user.foods || [];
  const goals = user.goals || [];
  const totalBurned = activities.reduce((sum, a) => sum + Number(a.burned || 0), 0);
  const completedGoalsCount = goals.filter(g => g.completed).length;

  const dates = getLastSevenDays();

  const weeklyActivities = activities.filter(a => dates.includes(a.date));
  const weeklyFoods = foods.filter(f => dates.includes(f.date));
  const weeklyBurned = weeklyActivities.reduce((sum, a) => sum + Number(a.burned || 0), 0);
  const weeklyMinutes = weeklyActivities.reduce((sum, a) => sum + Number(a.duration || 0), 0);
  const weeklyCalories = weeklyFoods.reduce((sum, f) => sum + Number(f.calories || 0), 0);
  const weeklyWater = dates.reduce((sum, date) =>
    sum + Number(user.waterRecords?.[date] || 0), 0);

  // Render bar charts data
  const workoutMinutesData = dates.map(date => {
    const val = weeklyActivities.filter(a => a.date === date).reduce((sum, a) => sum + Number(a.duration || 0), 0);
    return { date, value: val };
  });

  const caloriesBurnedData = dates.map(date => {
    const val = weeklyActivities.filter(a => a.date === date).reduce((sum, a) => sum + Number(a.burned || 0), 0);
    return { date, value: val };
  });

  const caloriesConsumedData = dates.map(date => {
    const val = weeklyFoods.filter(f => f.date === date).reduce((sum, f) => sum + Number(f.calories || 0), 0);
    return { date, value: val };
  });

  const renderBarChart = (data, unit) => {
    const maxValue = Math.max(1, ...data.map(item => item.value));
    return (
      <div className="chart-grid">
        {data.map(item => {
          const dayLabel = new Date(item.date + "T12:00:00").toLocaleDateString(undefined, { weekday: "short" });
          const height = item.value === 0 ? 3 : Math.max(6, (item.value / maxValue) * 100);
          return (
            <div className="chart-day" key={item.date}>
              <span className="chart-value">{item.value}</span>
              <div className="chart-bar-track" title={`${item.date}: ${item.value} ${unit}`}>
                <div className="chart-bar" style={{ height: `${height}%` }}></div>
              </div>
              <span className="chart-label">{dayLabel}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const downloadReportTXT = () => {
    const report = [
      "FITTRACK PRO - WEEKLY REPORT",
      "User: " + (user.profileName || user.name),
      "Period: " + dates[0] + " to " + dates[6],
      "Activities: " + weeklyActivities.length,
      "Workout minutes: " + weeklyMinutes,
      "Calories burned: " + weeklyBurned + " kcal",
      "Food calories logged: " + weeklyCalories + " kcal",
      "Water recorded: " + weeklyWater + " ml"
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FitTrack-Weekly-Report-${dates[6]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadReportCSV = () => {
    const rows = [["Date", "Activities", "Workout minutes", "Calories burned", "Calories consumed", "Water ml"]];
    dates.forEach(date => {
      const dayActs = activities.filter(a => a.date === date);
      const dayFoods = foods.filter(f => f.date === date);
      rows.push([
        date,
        dayActs.length,
        dayActs.reduce((s, a) => s + Number(a.duration || 0), 0),
        dayActs.reduce((s, a) => s + Number(a.burned || 0), 0),
        dayFoods.reduce((s, f) => s + Number(f.calories || 0), 0),
        Number(user.waterRecords?.[date] || 0)
      ]);
    });
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FitTrack-Weekly-Report-${dates[6]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const badges = [];
  if (activities.length >= 1) badges.push("First Activity");
  if (activities.length >= 5) badges.push("Active Starter");
  if (activities.length >= 10) badges.push("Fitness Champion");
  const todayWater = Number(user.waterRecords?.[dates[6]] || 0);
  if (todayWater >= WATER_GOAL) badges.push("Hydration Hero");
  if (completedGoalsCount >= 1) badges.push("Goal Achiever");
  if (completedGoalsCount >= 3) badges.push("Goal Master");

  return (
    <div>
      <h1>Progress & Achievements </h1>

      <div className="grid">
        <div className="card">
          <p className="muted">Total Activities</p>
          <div className="metric">{activities.length}</div>
        </div>
        <div className="card">
          <p className="muted">Total Calories Burned</p>
          <div className="metric">{totalBurned}</div>
        </div>
        <div className="card">
          <p className="muted">Completed Goals</p>
          <div className="metric">{completedGoalsCount}</div>
        </div>
      </div>

      <div className="card">
        <h3>Workout Minutes — Last 7 Days</h3>
        <p className="muted">Daily workout duration from your recorded activities.</p>
        {renderBarChart(workoutMinutesData, "minutes")}
        <p className="chart-legend">Bars show the total workout minutes recorded for each day.</p>
      </div>

      <div className="card">
        <h3>Calories Burned — Last 7 Days</h3>
        <p className="muted">Compare your daily calories burned based on logged workouts.</p>
        {renderBarChart(caloriesBurnedData, "kcal")}
        <p className="chart-legend">These are user-entered estimates, not medical measurements.</p>
      </div>

      <div className="card">
        <h3>Calories Consumed — Last 7 Days</h3>
        <p className="muted">Daily calories from your food log. Values are based on entries you record.</p>
        {renderBarChart(caloriesConsumedData, "kcal")}
        <p className="chart-legend">Use this alongside balanced meals and your personal needs.</p>
      </div>

      <div className="card">
        <h3>Weekly Report</h3>
        <p style={{ lineHeight: 1.8 }}>
          Period: <strong>{dates[0]}</strong> to <strong>{dates[6]}</strong><br />
          Activities recorded: <strong>{weeklyActivities.length}</strong><br />
          Workout duration: <strong>{weeklyMinutes} minutes</strong><br />
          Calories burned: <strong>{weeklyBurned} kcal</strong><br />
          Food calories logged: <strong>{weeklyCalories} kcal</strong><br />
          Water recorded: <strong>{weeklyWater} ml</strong>
        </p>
        <div className="action-group">
          <button type="button" onClick={downloadReportTXT}>Download TXT Report</button>
          <button type="button" className="secondary" onClick={downloadReportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="card">
        <h3>Achievement Badges </h3>
        <div>
          {badges.length > 0 ? (
            badges.map((b, idx) => (
              <span className="badge" key={idx}>🏆 {b}</span>
            ))
          ) : (
            <p className="muted">Record activities, drink water and complete goals to unlock badges.</p>
          )}
        </div>
      </div>
    </div>
  );
}
