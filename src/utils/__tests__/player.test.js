import { describe, it, expect } from "vitest";
import { calculateMaxEquipSlots, calculateExtraTaskSlots, getSubscriptionBonuses } from "../player";

const basePlayer = {
  level: 1,
  currentExp: 0,
  expToNextLevel: 100,
  totalExp: 0,
  streakDays: 0,
  gold: 0,
  equippedArtifactIds: [],
  unlockedTalents: {},
  buildingTaskSlots: 0,
  hasPremiumPass: false,
  subscriptionTier: null,
};

describe("player utils", () => {
  it("calculates base equip slots", () => {
    expect(calculateMaxEquipSlots(basePlayer)).toBe(3);
  });

  it("applies premium and subscription to equip slots", () => {
    const p = { ...basePlayer, hasPremiumPass: true, subscriptionTier: "advanced" };
    expect(calculateMaxEquipSlots(p)).toBe(3 + 1 + 1); // base + premium + sub
  });

  it("adds equip slots from talents", () => {
    const p = { ...basePlayer, unlockedTalents: { artifact_master_i: 1 } };
    expect(calculateMaxEquipSlots(p)).toBe(4);
  });

  it("calculates extra task slots from all sources", () => {
    const p = {
      ...basePlayer,
      unlockedTalents: { more_tasks_ii: 2 },
      buildingTaskSlots: 1,
      hasPremiumPass: true,
      subscriptionTier: "advanced",
    };
    // talents (+2), building (+1), premium (+3), subscription (+1)
    expect(calculateExtraTaskSlots(p)).toBe(7);
  });

  it("returns subscription bonuses by tier", () => {
    expect(getSubscriptionBonuses("basic").extraTaskSlots).toBe(0);
    expect(getSubscriptionBonuses("advanced").extraTaskSlots).toBe(1);
    expect(getSubscriptionBonuses("pro").extraTaskSlots).toBe(2);
  });
});
