export const KEY = "fittrack_users_v1";
export const SESSION_KEY = "fittrack_session_v1";
export const ADMIN_LOG_KEY = "fittrack_admin_log_v1";
export const WATER_GOAL = 2000;

export function today() {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

export function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function ensureUserData(user) {
  if (!user) return;
  user.activities = user.activities || [];
  user.foods = user.foods || [];
  user.goals = user.goals || [];
  user.waterRecords = user.waterRecords || {};
  user.adminSuggestions = user.adminSuggestions || [];
  user.profileName = user.profileName || user.name;
  user.active = user.active !== false;
  return user;
}

export function getCurrentSessionUser() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  const users = readUsers();
  const user = users.find(u => u.id === sessionId);
  if (user && user.active !== false) {
    ensureUserData(user);
    return user;
  }
  localStorage.removeItem(SESSION_KEY);
  return null;
}

export function saveSessionUser(userId) {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function updateUserInStorage(userId, changes) {
  const users = readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  
  Object.assign(users[index], changes);
  ensureUserData(users[index]);
  saveUsers(users);
  return users[index];
}

export function readAdminLog() {
  try {
    const log = JSON.parse(localStorage.getItem(ADMIN_LOG_KEY) || "[]");
    return Array.isArray(log) ? log : [];
  } catch {
    return [];
  }
}

export function logAdminAction(action, by = "Administrator") {
  const log = readAdminLog();
  log.unshift({ action, by, at: new Date().toISOString() });
  localStorage.setItem(ADMIN_LOG_KEY, JSON.stringify(log.slice(0, 50)));
}

export function clearAdminLog() {
  localStorage.removeItem(ADMIN_LOG_KEY);
}

export function getLastSevenDays() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(dateOffset(i));
  }
  return dates;
}

export function initializeDemoData() {
  const users = readUsers();
  let changed = false;

  // 1. Setup Demo Admin
  let admin = users.find(u => u.email === "admin@fittrack.com");
  if (!admin) {
    admin = {
      id: "fittrack-admin",
      name: "Administrator",
      profileName: "Administrator",
      email: "admin@fittrack.com",
      password: "Admin123!",
      role: "admin",
      active: true,
      activities: [],
      foods: [],
      goals: [],
      waterRecords: {},
      adminSuggestions: [],
      createdAt: new Date().toISOString()
    };
    users.push(admin);
    changed = true;
  }

  if (!(admin.activities || []).length) {
    admin.activities = [
      ["Brisk Walking", 28, 130, 0],
      ["Strength Training", 35, 230, 1],
      ["Cycling", 25, 205, 2],
      ["Yoga", 20, 65, 3],
      ["Running", 18, 190, 5]
    ].map((a, i) => ({
      id: "admin-demo-activity-" + i,
      type: a[0],
      duration: a[1],
      burned: a[2],
      date: dateOffset(a[3])
    }));

    admin.foods = [
      ["Oats and fruit", 340, 0],
      ["Rice, dal and vegetables", 560, 1],
      ["Egg sandwich", 390, 2]
    ].map((f, i) => ({
      id: "admin-demo-food-" + i,
      name: f[0],
      calories: f[1],
      date: dateOffset(f[2])
    }));

    admin.goals = [
      { id: "admin-demo-goal-1", name: "Exercise four days this week", category: "Workout", target: 4, completed: false },
      { id: "admin-demo-goal-2", name: "Log meals regularly", category: "Nutrition", target: 3, completed: true }
    ];

    admin.waterRecords = admin.waterRecords || {};
    [0, 1, 2, 3, 4, 5, 6].forEach((days, i) => {
      admin.waterRecords[dateOffset(days)] = [2100, 1800, 2300, 2000, 1900, 2200, 2050][i];
    });
    changed = true;
  }
  ensureUserData(admin);

  // 2. Setup Demo Members
  const samples = [
    {
      name: "Aarav Sharma",
      email: "aarav@fittrack.com",
      password: "Aarav123!",
      activities: [["Walking", 35, 145], ["Cycling", 25, 210], ["Running", 20, 230]],
      foods: [["Oats and banana", 320], ["Rice and dal", 540], ["Paneer wrap", 410]],
      goals: [["Walk 8000 steps daily", "Activity", 8000, false], ["Drink 2 litres of water", "Hydration", 2000, true], ["Exercise 4 days a week", "Workout", 4, false]],
      water: 2250
    },
    {
      name: "Priya Reddy",
      email: "priya@fittrack.com",
      password: "Priya123!",
      activities: [["Yoga", 40, 130], ["Walking", 30, 125], ["Strength Training", 35, 220]],
      foods: [["Idli and sambar", 360], ["Vegetable pulao", 490], ["Fruit bowl", 180]],
      goals: [["Practice yoga 5 days a week", "Workout", 5, true], ["Eat fruit every day", "Nutrition", 1, false], ["Walk 6000 steps daily", "Activity", 6000, false]],
      water: 2000
    },
    {
      name: "Rahul Verma",
      email: "rahul@fittrack.com",
      password: "Rahul123!",
      activities: [["Running", 30, 340], ["Cycling", 45, 370], ["Skipping", 15, 190]],
      foods: [["Egg sandwich", 390], ["Chicken and rice", 650], ["Yogurt and berries", 220]],
      goals: [["Run 3 km without stopping", "Workout", 3, false], ["Burn 400 calories a day", "Activity", 400, true], ["Limit sugary snacks", "Nutrition", 1, false]],
      water: 2600
    },
    {
      name: "Sneha Patel",
      email: "sneha@fittrack.com",
      password: "Sneha123!",
      activities: [["Dance Workout", 30, 240], ["Walking", 40, 160], ["Pilates", 25, 150]],
      foods: [["Poha", 280], ["Dal, rice and vegetables", 570], ["Peanut butter toast", 310]],
      goals: [["Complete 150 workout minutes weekly", "Workout", 150, false], ["Drink 2 litres of water", "Hydration", 2000, true], ["Log meals every day", "Nutrition", 3, false]],
      water: 1900
    },
    {
      name: "Kiran Kumar",
      email: "kiran@fittrack.com",
      password: "Kiran123!",
      activities: [["Brisk Walking", 50, 240], ["Badminton", 40, 330], ["Strength Training", 30, 210]],
      foods: [["Dosa and chutney", 420], ["Chapati and paneer", 610], ["Apple and almonds", 240]],
      goals: [["Play a sport twice a week", "Activity", 2, true], ["Reach 7000 steps daily", "Activity", 7000, false], ["Track daily food intake", "Nutrition", 3, false]],
      water: 2150
    }
  ];

  samples.forEach((sample, index) => {
    if (users.some(u => u.email === sample.email)) return;
    const created = new Date();
    created.setDate(created.getDate() - (index + 2));
    const user = {
      id: "fittrack-demo-" + (index + 1),
      name: sample.name,
      profileName: sample.name,
      email: sample.email,
      password: sample.password,
      role: "user",
      active: true,
      createdAt: created.toISOString(),
      activities: sample.activities.map((a, i) => ({ id: makeId(), type: a[0], duration: a[1], burned: a[2], date: dateOffset(i) })),
      foods: sample.foods.map((f, i) => ({ id: makeId(), name: f[0], calories: f[1], date: dateOffset(i) })),
      goals: sample.goals.map((g, i) => ({ id: makeId(), name: g[0], category: g[1], target: g[2], completed: g[3], createdAt: dateOffset(i) })),
      waterRecords: Object.fromEntries(Array.from({ length: 7 }, (_, day) => [dateOffset(day), Math.max(500, sample.water + (day % 3 - 1) * 250)])),
      adminSuggestions: []
    };
    ensureUserData(user);
    users.push(user);
    changed = true;
  });

  // 3. Extra records for demo members
  const marker = "fittrack_demo_extra_records_v1";
  if (!localStorage.getItem(marker)) {
    const extraByMember = {
      "fittrack-demo-1": [["Yoga", 18, 55, 4], ["Walking", 22, 90, 6], ["Cycling", 16, 135, 5]],
      "fittrack-demo-2": [["Pilates", 24, 115, 3], ["Walking", 26, 105, 5], ["Dance Workout", 20, 155, 6]],
      "fittrack-demo-3": [["Strength Training", 28, 210, 3], ["Running", 22, 250, 4], ["Walking", 19, 80, 6]],
      "fittrack-demo-4": [["Yoga", 32, 105, 2], ["Dance Workout", 27, 220, 4], ["Walking", 31, 125, 6]],
      "fittrack-demo-5": [["Badminton", 35, 285, 3], ["Brisk Walking", 24, 115, 4], ["Strength Training", 26, 185, 6]]
    };

    users.forEach(user => {
      const extras = extraByMember[user.id];
      if (!extras) return;
      user.activities = user.activities || [];
      extras.forEach((a, i) => {
        if (!user.activities.some(act => act.id === `${user.id}-extra-${i}`)) {
          user.activities.push({
            id: `${user.id}-extra-${i}`,
            type: a[0],
            duration: a[1],
            burned: a[2],
            date: dateOffset(a[3])
          });
        }
      });
      changed = true;
    });
    localStorage.setItem(marker, "done");
  }

  if (changed) {
    saveUsers(users);
  }
}
