import { LOCATIONS } from "../data/locations";
import { getTodayString, getWeekId } from "./date";

export const buildDailyTasks = (extraSlots = 0, date = getTodayString()) => {
  const tasks = [];
  LOCATIONS.forEach((loc) => {
    loc.defaultTasks.forEach((dt, idx) => {
      tasks.push({
        id: `${date}-${loc.id}-${idx}`,
        ...dt,
        locationId: loc.id,
        completed: false,
        comment: "",
        date,
      });
    });
  });

  for (let i = 0; i < extraSlots; i++) {
    tasks.push({
      id: `${date}-bonus-${i}`,
      title: `Бонусная Дисциплина ${i + 1}`,
      description: "Дополнительное задание для роста",
      category: "planning",
      exp: 10,
      value: 1,
      unit: "check",
      locationId: "bonus",
      completed: false,
      comment: "",
      date,
    });
  }
  return tasks;
};

export const generateWeeklyChallenge = (today = getTodayString()) => {
  const categories = ["sport", "charts", "learning", "research"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const required = 10 + Math.floor(Math.random() * 5);
  const exp = required * 80;
  const gold = required * 120;
  const categoryName = LOCATIONS.find((l) => l.category === randomCategory)?.name || "Категория";

  return {
    id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    startDate: today,
    title: `Испытание: Мастер ${categoryName}`,
    description: `Выполни ${required} задач в категории "${categoryName}" за эту неделю.`,
    targetCategory: randomCategory,
    requiredCompletions: required,
    currentProgress: 0,
    expReward: exp,
    goldReward: gold,
    isCompleted: false,
    isClaimed: false,
  };
};

const daysBetween = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return Math.floor((db - da) / (1000 * 60 * 60 * 24));
};

export const pruneStats = (stats, maxDays = 90, maxItems = 200) => {
  if (!Array.isArray(stats)) return [];
  const today = getTodayString();
  const filtered = stats.filter((s) => {
    if (!s.date) return false;
    return daysBetween(s.date, today) <= maxDays;
  });
  return filtered.slice(Math.max(0, filtered.length - maxItems));
};

export const pruneTasks = (tasks, date = getTodayString()) => {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter((t) => t.date === date);
};

export const isSameWeek = (dateA, dateB) => getWeekId(dateA) === getWeekId(dateB);
