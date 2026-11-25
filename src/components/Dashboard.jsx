import React from 'react';
import { today, WATER_GOAL } from '../utils/storage';

export default function Dashboard({ user, onNavigateSection }) {
  const todayDate = today();
  const activities = (user.activities || []).filter(a => a.date === todayDate);
  const foods = (user.foods || []).filter(f => f.date === todayDate);
  const burned = activities.reduce((sum, a) => sum + Number(a.burned || 0), 0);
  const consumed = foods.reduce((sum, f) => sum + Number(f.calories || 0), 0);
  const water = Number(user.waterRecords?.[todayDate] || 0);

  const percent = Math.min(100, Math.round((water / WATER_GOAL) * 100));

  const tips = [
    "Try a short walk after long periods of sitting.",
    "Record your meals to understand your daily calorie intake.",
    "Consistency matters more than one intense workout.",
    "Drink water regularly throughout your day.",
    "Choose realistic goals and track your progress."
  ];
  const dailyTip = tips[new Date().getDate() % tips.length];

  // Suggestions logic matching original
  const suggestions = [];
  const activeGoals = (user.goals || []).filter(g => !g.completed);
  const completedGoals = (user.goals || []).filter(g => g.completed);

  if (activities.length === 0) {
    suggestions.push({
      title: "Add some movement",
      text: "No activity is recorded for today. If it suits your routine, try a comfortable 10–15 minute walk and log it."
    });
  } else if (activities.length < 3) {
    suggestions.push({
      title: "Keep building consistency",
      text: `You logged ${activities.length} ${activities.length === 1 ? "activity" : "activities"} today. Consider adding another short activity only if you feel comfortable.`
    });
  } else {
    suggestions.push({
      title: "Great tracking today",
      text: `You have logged ${activities.length} activities. Remember to balance exercise with rest and recovery.`
    });
  }

  if (water < WATER_GOAL) {
    const remainingWater = WATER_GOAL - water;
    suggestions.push({
      title: "Hydration reminder",
      text: `Your tracker shows ${water} ml of water today. You are ${remainingWater} ml below the app's ${WATER_GOAL} ml demo target; sip water regularly through the day.`
    });
  } else {
    suggestions.push({
      title: "Hydration progress",
      text: `You have reached the app's ${WATER_GOAL} ml demo water target. Keep drinking according to your needs and daily conditions.`
    });
  }

  if (foods.length === 0) {
    suggestions.push({
      title: "Track your meals",
      text: "Add the meals and snacks you eat to get a clearer picture of your logged daily calorie intake."
    });
  } else {
    suggestions.push({
      title: "Review your nutrition log",
      text: `You have logged ${consumed} kcal from ${foods.length} food ${foods.length === 1 ? "entry" : "entries"} today. Aim for balanced meals and include a variety of foods.`
    });
  }

  if (activeGoals.length > 0) {
    suggestions.push({
      title: "Take one step toward a goal",
      text: `You have ${activeGoals.length} active ${activeGoals.length === 1 ? "goal" : "goals"}. Choose one small, realistic action today to make progress.`
    });
  } else if (completedGoals.length > 0) {
    suggestions.push({
      title: "Set your next milestone",
      text: "You have completed your current goals. Consider setting a new, realistic goal that matches your routine."
    });
  } else {
    suggestions.push({
      title: "Create a fitness goal",
      text: "Set a short-term goal, such as recording a few activities this week, then review your progress."
    });
  }

  const adminSuggestions = (user.adminSuggestions || []).slice().reverse();

  return (
    <div>
      <h1>Welcome to FitTrack Pro! </h1>
      <p className="muted">Track your daily activities, nutrition, hydration and goals.</p>

      <div className="grid">
        <div className="card" onClick={() => onNavigateSection('activity')} style={{ cursor: 'pointer' }}>
          <p className="muted">Today's Activities</p>
          <div className="metric">{activities.length}</div>
          <p className="muted">Activities recorded</p>
        </div>

        <div className="card" onClick={() => onNavigateSection('nutrition')} style={{ cursor: 'pointer' }}>
          <p className="muted">Calories Consumed</p>
          <div className="metric">{consumed}</div>
          <p className="muted">kcal today</p>
        </div>

        <div className="card" onClick={() => onNavigateSection('activity')} style={{ cursor: 'pointer' }}>
          <p className="muted">Calories Burned</p>
          <div className="metric">{burned}</div>
          <p className="muted">kcal today</p>
        </div>

        <div className="card" onClick={() => onNavigateSection('water')} style={{ cursor: 'pointer' }}>
          <p className="muted">Water Intake</p>
          <div className="metric">{water}</div>
          <p className="muted">ml today</p>
        </div>
      </div>

      <div className="card">
        <h3>Daily Hydration Goal</h3>
        <p>{water} / {WATER_GOAL} ml ({percent}%)</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
        <p className="muted" style={{ marginTop: '8px' }}>
          {water >= WATER_GOAL
            ? "Daily demo target reached! Great job staying hydrated."
            : `Keep drinking water. ${Math.max(0, WATER_GOAL - water)} ml remaining today.`}
        </p>
      </div>

      <div className="card">
        <h3>Today's Fitness Tip </h3>
        <p>{dailyTip}</p>
      </div>

      <div className="card">
        <h3>Personalized Suggestions for You</h3>
        <p className="muted">Simple recommendations based on the activity, food, water and goals you record.</p>
        <div>
          {suggestions.map((item, idx) => (
            <div className="notice" key={idx} style={{ margin: '10px 0' }}>
              <strong style={{ color: '#FF7B86' }}>{item.title}</strong>
              <p style={{ margin: '6px 0 0', color: '#F4F4F5' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Suggestions from Your Admin / Fitness Coach</h3>
        <p className="muted">Recommendations sent by the administrator after reviewing your records.</p>
        <div>
          {adminSuggestions.length > 0 ? (
            adminSuggestions.map((item, idx) => (
              <div className="recommendation-item" key={item.id || idx}>
                <strong style={{ color: '#FF7B86' }}>{item.title || "Fitness recommendation"}</strong>
                <p style={{ margin: '4px 0', color: '#F4F4F5' }}>{item.message || ""}</p>
                <small>
                  From administrator · {item.at ? new Date(item.at).toLocaleString() : "Demo recommendation"}
                </small>
              </div>
            ))
          ) : (
            <p className="muted" style={{ marginTop: '10px' }}>
              No administrator suggestions yet. Your admin can review your records and send personalized guidance here.
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Your Active Goals</h3>
        <div>
          {activeGoals.length > 0 ? (
            activeGoals.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <span style={{ color: '#E32636' }}>🎯</span>
                <span>{g.name}</span>
                <span className="muted" style={{ fontSize: '12px' }}>({g.category} - Target: {g.target})</span>
              </div>
            ))
          ) : (
            <p className="muted">No active goals right now. Create a goal to see it here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
