export const STORAGE_KEYS = {
  PROFILE: "tva_profile",
  PLAYER: "tva_player",
  TASKS: "tva_tasks",
  STATS: "tva_stats",
  UPGRADES: "tva_upgrades",
  ARTIFACTS: "tva_artifacts",
  CHALLENGE: "tva_weekly_challenge",
  PREFERENCES: "tva_preferences",
  TELEGRAM: "tva_telegram",
  MAP_PROGRESS: "tva_map_progress",
};

export const INITIAL_PLAYER_STATE = {
  level: 1,
  currentExp: 0,
  expToNextLevel: 100,
  totalExp: 0,
  streakDays: 0,
  lastLoginDate: new Date().toISOString().split("T")[0],
  gold: 10000,
  equippedArtifactIds: [],
  unlockedTalents: {},
  buildingTaskSlots: 0,
  hasPremiumPass: false,
  subscriptionTier: null,
};

export const INITIAL_UPGRADES_STATE = {};

// Задай реальные ссылки для TG и оплаты премиума
export const LINKS = {
  tgBot: "https://t.me/TVAAcademy_Bot",
  tgChannel: "https://t.me/+sGlxGDyPdJZkNTAy",
  tgSupport: "https://t.me/ICik74",
  premiumPay: "", // вставь ссылку на оплату, если готово
};
