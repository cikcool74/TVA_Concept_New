import { describe, it, expect } from "vitest";
import { buildDailyTasks, generateWeeklyChallenge, pruneTasks, pruneStats, isSameWeek } from "../tasks";
import { getTodayString, getWeekId } from "../date";
import { LOCATIONS } from "../../data/locations";

describe("tasks utils", () => {
  it("builds daily tasks with extra slots", () => {
    const today = "2025-01-01";
    const tasks = buildDailyTasks(2, today);
    const baseCount = LOCATIONS.reduce((acc, loc) => acc + loc.defaultTasks.length, 0);
    expect(tasks.length).toBe(baseCount + 2);
    expect(tasks.every((t) => t.date === today)).toBe(true);
  });

  it("generates weekly challenge within range", () => {
    const today = getTodayString();
    const ch = generateWeeklyChallenge(today);
    expect(ch.startDate).toBe(today);
    expect(ch.requiredCompletions).toBeGreaterThanOrEqual(10);
    expect(ch.requiredCompletions).toBeLessThanOrEqual(14);
    expect(["sport", "charts", "learning", "research"]).toContain(ch.targetCategory);
  });

  it("prunes tasks to current date", () => {
    const tasks = [
      { id: "a", date: "2024-01-01" },
      { id: "b", date: "2025-01-01" },
    ];
    expect(pruneTasks(tasks, "2025-01-01")).toEqual([{ id: "b", date: "2025-01-01" }]);
  });

  it("limits stats length and drops old dates", () => {
    const today = getTodayString();
    const oldDate = "2023-01-01";
    const stats = Array.from({ length: 200 }, (_, i) => ({
      idx: i,
      date: i < 5 ? oldDate : today,
    }));
    const pruned = pruneStats(stats, 50, 50);
    expect(pruned.every((s) => s.date !== oldDate)).toBe(true);
    expect(pruned.length).toBeLessThanOrEqual(50);
  });

  it("checks same week helper", () => {
    const d1 = "2025-01-06"; // Monday
    const d2 = "2025-01-08"; // same week
    expect(isSameWeek(d1, d2)).toBe(true);
    const nextWeek = "2025-01-15";
    expect(isSameWeek(d1, nextWeek)).toBe(false);
    expect(getWeekId(d1)).toBe(getWeekId(d2));
  });
});
