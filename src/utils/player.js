import { TALENTS } from "../data/talents";

export const getSubscriptionBonuses = (tier) => {
  switch (tier) {
    case "advanced":
      return { extraTaskSlots: 1, extraEquipSlots: 1, goldMultiplier: 1.1 };
    case "pro":
      return { extraTaskSlots: 2, extraEquipSlots: 2, goldMultiplier: 1.2 };
    case "basic":
    default:
      return { extraTaskSlots: 0, extraEquipSlots: 0, goldMultiplier: 1.0 };
  }
};

export const calculateMaxEquipSlots = (player) => {
  const baseSlots = 3;
  const subBonuses = getSubscriptionBonuses(player.subscriptionTier || "basic");
  const fromSub = subBonuses.extraEquipSlots || 0;
  const fromPremium = player.hasPremiumPass ? 1 : 0;
  const fromTalents = Object.entries(player.unlockedTalents || {}).reduce(
    (total, [id, level]) => {
      const talent = TALENTS.find((t) => t.id === id);
      if (talent && talent.effect === "extra_equip_slot") {
        return total + (talent.baseValue || 0) * level;
      }
      return total;
    },
    0
  );
  return baseSlots + fromSub + fromPremium + fromTalents;
};

export const calculateExtraTaskSlots = (player) => {
  const fromTalents = Object.entries(player.unlockedTalents || {}).reduce(
    (total, [id, level]) => {
      const talent = TALENTS.find((t) => t.id === id);
      if (talent && talent.effect === "extra_task_slot") {
        return total + talent.baseValue * level;
      }
      return total;
    },
    0
  );
  const subBonuses = getSubscriptionBonuses(player.subscriptionTier || "basic");
  const fromSubscription = subBonuses.extraTaskSlots || 0;
  const fromPremium = player.hasPremiumPass ? 3 : 0;
  const fromBuildings = player.buildingTaskSlots || 0;

  return fromTalents + fromSubscription + fromPremium + fromBuildings;
};
