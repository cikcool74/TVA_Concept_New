import { useEffect, useMemo, useState, useCallback } from "react";
import { LOCATIONS } from "../data/locations";
import { UPGRADES } from "../data/upgrades";
import { ARTIFACTS } from "../data/artifacts";
import { TALENTS } from "../data/talents";
import { MOTIVATION_QUOTES } from "../data/quotes";
import { STORAGE_KEYS, INITIAL_PLAYER_STATE } from "../data/constants";
import { loadState, saveState } from "../services/storage";
import { calculateExtraTaskSlots, calculateMaxEquipSlots } from "../utils/player";
import { getTodayString } from "../utils/date";
import { buildDailyTasks, generateWeeklyChallenge, pruneStats, pruneTasks, isSameWeek } from "../utils/tasks";
import { generateRandomArtifact, ensureArtifactIds } from "../utils/artifacts";

const defaultProfile = {
  name: "",
  goal: "",
  goalStage: "Новичок",
  telegram: "",
  sleepPlanFrom: "23:00",
  sleepPlanTo: "07:00",
  sportMinutes: 30,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  balanceTestCompleted: false,
  balanceHistory: [],
  balanceScores: null,
  avatarEmoji: "\u263A",
};

const RENAME_COST = 500;
const LESSON_REWARD = { exp: 50, gold: 100 };
const BLOCK_REWARD = { exp: 150, gold: 300 };

const initialUpgrades = () => Object.fromEntries(LOCATIONS.map((loc) => [loc.id, 1]));

const normalizePlayer = (p) => {
  const base = { ...INITIAL_PLAYER_STATE, ...(p || {}) };
  if (typeof base.hasPremiumPass !== "boolean") base.hasPremiumPass = false;
  if (typeof base.subscriptionTier === "undefined") base.subscriptionTier = null;
  if (!base.unlockedTalents) base.unlockedTalents = {};
  if (typeof base.buildingTaskSlots !== "number") base.buildingTaskSlots = 0;
  if (typeof base.streakDays !== "number") base.streakDays = 0;
  return base;
};

const normalizeUpgrades = (u) => ({ ...initialUpgrades(), ...(u || {}) });

const normalizeTasks = (tasks, extraSlots) => {
  const today = getTodayString();
  if (!Array.isArray(tasks) || !tasks.some((t) => t.date === today)) {
    return buildDailyTasks(extraSlots, today);
  }
  return pruneTasks(tasks, today);
};

const levelUp = (player) => {
  let { level, currentExp, expToNextLevel } = player;
  let leveledUp = false;
  while (currentExp >= expToNextLevel) {
    currentExp -= expToNextLevel;
    level += 1;
    leveledUp = true;
    expToNextLevel = Math.round(expToNextLevel * 1.2 + 25);
  }
  return { player: { ...player, level, currentExp, expToNextLevel }, leveledUp };
};

export function useGameState() {
  const [profile, setProfile] = useState(() => loadState(STORAGE_KEYS.PROFILE, null));
  const [player, setPlayer] = useState(() =>
    normalizePlayer(loadState(STORAGE_KEYS.PLAYER, INITIAL_PLAYER_STATE))
  );
  const [tasks, setTasks] = useState(() =>
    normalizeTasks(loadState(STORAGE_KEYS.TASKS, []), calculateExtraTaskSlots(INITIAL_PLAYER_STATE))
  );
  const [stats, setStats] = useState(() => pruneStats(loadState(STORAGE_KEYS.STATS, []), 90, 200));
  const [upgrades, setUpgrades] = useState(() => normalizeUpgrades(loadState(STORAGE_KEYS.UPGRADES, initialUpgrades())));
  const [artifacts, setArtifacts] = useState(() =>
    ensureArtifactIds(
      loadState(
        STORAGE_KEYS.ARTIFACTS,
        ARTIFACTS.map((a, idx) => ({ ...a, id: `${a.baseId}-${idx}` }))
      )
    )
  );
  const [weeklyChallenge, setWeeklyChallenge] = useState(() =>
    loadState(STORAGE_KEYS.CHALLENGE, null)
  );
  const [mapProgress, setMapProgress] = useState(() => {
    const saved = loadState(STORAGE_KEYS.MAP_PROGRESS, { completed: [], stages: {} });
    return {
      completed: Array.isArray(saved?.completed) ? saved.completed : [],
      stages: saved?.stages && typeof saved.stages === "object" ? saved.stages : {},
    };
  });
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync with storage
  useEffect(() => saveState(STORAGE_KEYS.PROFILE, profile), [profile]);
  useEffect(() => saveState(STORAGE_KEYS.PLAYER, player), [player]);
  useEffect(() => saveState(STORAGE_KEYS.TASKS, tasks), [tasks]);
  useEffect(() => saveState(STORAGE_KEYS.STATS, stats), [stats]);
  useEffect(() => saveState(STORAGE_KEYS.UPGRADES, upgrades), [upgrades]);
  useEffect(() => saveState(STORAGE_KEYS.ARTIFACTS, artifacts), [artifacts]);
  useEffect(() => saveState(STORAGE_KEYS.CHALLENGE, weeklyChallenge), [weeklyChallenge]);
  useEffect(() => saveState(STORAGE_KEYS.MAP_PROGRESS, mapProgress), [mapProgress]);

  // Ensure daily tasks exist
  useEffect(() => {
    const today = getTodayString();
    setTasks((prev) => {
      const pruned = pruneTasks(prev, today);
      if (!pruned.length || !pruned.some((t) => t.date === today)) {
        const extra = calculateExtraTaskSlots(player);
        return buildDailyTasks(extra, today);
      }
      return pruned;
    });
  }, [player]);

  // Ensure weekly challenge is current
  useEffect(() => {
    const today = getTodayString();
    setWeeklyChallenge((prev) => {
      if (prev && prev.startDate && isSameWeek(prev.startDate, today)) return prev;
      return generateWeeklyChallenge(today);
    });
  }, []);

  // Prune stats to avoid huge localStorage (limit by days/items)
  useEffect(() => {
    setStats((prev) => pruneStats(prev, 90, 200));
  }, []);

  const totalEquipSlots = useMemo(
    () => calculateMaxEquipSlots(player),
    [player]
  );

  const equippedArtifacts = useMemo(
    () => artifacts.filter((a) => player.equippedArtifactIds.includes(a.id)),
    [artifacts, player.equippedArtifactIds]
  );

  const profileCompleted = Boolean(profile?.name);

  const saveProfile = useCallback((payload) => {
    setProfile((prev) => ({ ...(prev || defaultProfile), ...payload }));
  }, []);

  const resetForNewDay = useCallback(() => {
    const extra = calculateExtraTaskSlots(player);
    setTasks(buildDailyTasks(extra));
  }, [player]);

  const applyRewards = useCallback(
    (task) => {
      const extraGoldMultiplier =
        equippedArtifacts
          .filter((a) => a.effectType === "gold_multiplier")
          .reduce((mul, a) => mul * a.effectValue, 1) || 1;

      const extraExpMultiplier =
        equippedArtifacts
          .filter(
            (a) =>
              a.effectType === "exp_multiplier" &&
              (a.targetCategory === "all" || a.targetCategory === task.category)
          )
          .reduce((mul, a) => mul * a.effectValue, 1) || 1;

      const baseExp = task.exp;
      const goldReward = task.exp * 2 * extraGoldMultiplier;
      const expReward = Math.round(baseExp * extraExpMultiplier);

      setPlayer((prev) => {
        const updatedPlayer = {
          ...prev,
          gold: Math.round(prev.gold + goldReward),
          currentExp: prev.currentExp + expReward,
          totalExp: prev.totalExp + expReward,
          streakDays: prev.streakDays + 1,
          lastLoginDate: getTodayString(),
        };
        const { player: leveledPlayer, leveledUp } = levelUp(updatedPlayer);
        if (leveledUp) {
          const reward = generateRandomArtifact(artifacts);
          setArtifacts((prevA) => [...prevA, reward]);
          setLevelUpInfo({ level: leveledPlayer.level, artifact: reward });
        }
        setToast({
          type: "success",
          text: `+${expReward} EXP, +${Math.round(goldReward)} золота`,
        });
        return leveledPlayer;
      });

      return { expReward, goldReward };
    },
    [equippedArtifacts, artifacts]
  );

  const completeTask = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: true } : t
        )
      );
      const task = tasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        const rewards = applyRewards(task);
        setStats((prev) =>
          pruneStats([
            ...prev,
            {
              date: getTodayString(),
              taskId,
              exp: task.exp,
              rewardExp: rewards?.expReward ?? task.exp,
              rewardGold: Math.round(rewards?.goldReward ?? task.exp * 2),
              category: task.category,
              locationId: task.locationId,
            },
          ])
        );

        if (weeklyChallenge && !weeklyChallenge.isCompleted && task.category === weeklyChallenge.targetCategory) {
          setWeeklyChallenge((prev) => {
            if (!prev) return null;
            const newProgress = prev.currentProgress + 1;
            const isCompleted = newProgress >= prev.requiredCompletions;
            return {
              ...prev,
              currentProgress: newProgress,
              isCompleted,
            };
          });
          if (weeklyChallenge.currentProgress + 1 >= weeklyChallenge.requiredCompletions) {
            setToast({ type: "success", text: "Еженедельное испытание выполнено!" });
          }
        }
      }
    },
    [tasks, applyRewards, weeklyChallenge]
  );

  const updateTaskComment = useCallback((taskId, comment) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, comment } : t)));
  }, []);

  const toggleEquipArtifact = useCallback(
    (artifactId) => {
      setPlayer((prev) => {
        const isEquipped = prev.equippedArtifactIds.includes(artifactId);
        if (isEquipped) {
          return {
            ...prev,
            equippedArtifactIds: prev.equippedArtifactIds.filter((id) => id !== artifactId),
          };
        }
        if (prev.equippedArtifactIds.length >= totalEquipSlots) {
          return prev;
        }
        return {
          ...prev,
          equippedArtifactIds: [...prev.equippedArtifactIds, artifactId],
        };
      });
    },
    [totalEquipSlots]
  );

  const unlockTalent = useCallback(
    (talentId) => {
      const talent = TALENTS.find((t) => t.id === talentId);
      if (!talent) return;
      setPlayer((prev) => {
        const currentLevel = prev.unlockedTalents[talentId] || 0;
        if (currentLevel >= talent.maxLevel) return prev;
        if (prev.gold < talent.cost) return prev;
        return {
          ...prev,
          gold: prev.gold - talent.cost,
          unlockedTalents: {
            ...prev.unlockedTalents,
            [talentId]: currentLevel + 1,
          },
        };
      });
    },
    []
  );

  const upgradeBuilding = useCallback(
    (locationId) => {
      const upgradeInfo = UPGRADES.find((u) => u.locationId === locationId);
      if (!upgradeInfo) return;
      const step = upgradeInfo.steps.find(
        (s) => s.level === (upgrades[locationId] || 1) + 1
      );
      if (!step) return;
      setPlayer((prev) => {
        if (prev.gold < step.cost) return prev;
        return { ...prev, gold: prev.gold - step.cost, buildingTaskSlots: prev.buildingTaskSlots + 1 };
      });
      setUpgrades((prev) => ({ ...prev, [locationId]: (prev[locationId] || 1) + 1 }));
    },
    [upgrades]
  );

  const addArtifact = useCallback((artifact) => {
    setArtifacts((prev) => [...prev, artifact]);
  }, []);

  const claimWeeklyChallenge = useCallback(() => {
    if (!weeklyChallenge || !weeklyChallenge.isCompleted || weeklyChallenge.isClaimed) {
      return { ok: false, reason: "not_ready" };
    }
    setPlayer((prev) => {
      const updatedBase = {
        ...prev,
        gold: prev.gold + weeklyChallenge.goldReward,
        currentExp: prev.currentExp + weeklyChallenge.expReward,
        totalExp: prev.totalExp + weeklyChallenge.expReward,
      };
      const { player: leveled, leveledUp } = levelUp(updatedBase);
      if (leveledUp) {
        const reward = generateRandomArtifact(artifacts);
        setArtifacts((prevA) => [...prevA, reward]);
        setLevelUpInfo({ level: leveled.level, artifact: reward });
      }
      return leveled;
    });
    setWeeklyChallenge((prev) => (prev ? { ...prev, isClaimed: true } : prev));
    setToast({
      type: "success",
      text: `Награда за испытание: +${weeklyChallenge.expReward} EXP и ${weeklyChallenge.goldReward} золота`,
    });
    return { ok: true };
  }, [weeklyChallenge]);

  const activatePremium = useCallback(() => {
    setPlayer((prev) => ({ ...prev, hasPremiumPass: true }));
    setToast({ type: "success", text: "Premium Pass активирован (+3 слота задач)" });
  }, []);

  const updateProfileWithCost = useCallback(
    (payload = {}) => {
      if (typeof payload.name !== "undefined" && !payload.name.trim()) {
        setToast({ type: "error", text: "Введите имя" });
        return { ok: false, reason: "empty_name" };
      }
      const current = { ...defaultProfile, ...(profile || {}) };
      const next = { ...current, ...payload };
      const changed = Object.keys(payload).some((key) => next[key] !== current[key]);
      if (!changed) {
        setToast({ type: "error", text: "Изменений нет" });
        return { ok: false, reason: "no_changes" };
      }
      if (player.gold < RENAME_COST) {
        setToast({ type: "error", text: `Нужно ${RENAME_COST} золота для изменения профиля` });
        return { ok: false, reason: "no_gold" };
      }
      setPlayer((prev) => ({ ...prev, gold: prev.gold - RENAME_COST }));
      setProfile(next);
      setToast({ type: "success", text: `Профиль обновлён (-${RENAME_COST} золота)` });
      return { ok: true };
    },
    [player.gold, profile]
  );

  const renameProfile = useCallback(
    (nextName) => {
      const name = (nextName || "").trim();
      if (!name) {
        setToast({ type: "error", text: "Введите новое имя" });
        return { ok: false, reason: "empty" };
      }
      return updateProfileWithCost({ name });
    },
    [updateProfileWithCost]
  );

  const setSubscriptionTier = useCallback((tier) => {
    setPlayer((prev) => ({ ...prev, subscriptionTier: tier }));
    setToast({ type: "success", text: `Подписка ${tier.toUpperCase()} выбрана` });
  }, []);

  const completeLesson = useCallback(
    (lessonId, options = {}) => {
      const { rewardExp, rewardGold, isBlock = false } = options;
      const exp = rewardExp ?? (isBlock ? BLOCK_REWARD.exp : LESSON_REWARD.exp);
      const gold = rewardGold ?? (isBlock ? BLOCK_REWARD.gold : LESSON_REWARD.gold);

      let alreadyDone = false;
      setMapProgress((prev) => {
        if (prev.completed?.includes(lessonId)) {
          alreadyDone = true;
          return prev;
        }
        const completed = Array.from(new Set([...(prev.completed || []), lessonId]));
        return { ...prev, completed };
      });
      if (alreadyDone) return { ok: false, reason: "already_completed" };

      setPlayer((prev) => {
        const updated = {
          ...prev,
          gold: prev.gold + gold,
          currentExp: prev.currentExp + exp,
          totalExp: prev.totalExp + exp,
        };
        const { player: leveled, leveledUp } = levelUp(updated);
        if (leveledUp) {
          const reward = generateRandomArtifact(artifacts);
          setArtifacts((prevA) => [...prevA, reward]);
          setLevelUpInfo({ level: leveled.level, artifact: reward });
        }
        return leveled;
      });

      setToast({ type: "success", text: `Награда: +${exp} EXP и +${gold} золота` });
      return { ok: true };
    },
    [artifacts]
  );

  const completeLessonStage = useCallback(
    (lessonId, stageIndex = 1) => {
      let grant = false;
      setMapProgress((prev) => {
        const prevStage = prev.stages?.[lessonId] || 0;
        if (stageIndex <= prevStage) return prev;
        const nextStage = Math.min(5, stageIndex);
        const stages = { ...(prev.stages || {}), [lessonId]: nextStage };
        let completed = prev.completed || [];
        if (nextStage >= 5 && !completed.includes(lessonId)) {
          completed = [...completed, lessonId];
          grant = true;
        }
        return { ...prev, stages, completed };
      });

      if (grant) {
        completeLesson(lessonId, { isBlock: false });
      }
      return { ok: true };
    },
    [completeLesson]
  );

  const clearToast = useCallback(() => setToast(null), []);
  const clearLevelUp = useCallback(() => setLevelUpInfo(null), []);

  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    return MOTIVATION_QUOTES[idx];
  }, []);

  return {
    profile,
    profileCompleted,
    player,
    tasks,
    stats,
    upgrades,
    artifacts,
    equippedArtifacts,
    totalEquipSlots,
    weeklyChallenge,
    saveProfile,
    resetForNewDay,
    completeTask,
    updateTaskComment,
    toggleEquipArtifact,
    unlockTalent,
    upgradeBuilding,
    addArtifact,
    claimWeeklyChallenge,
    activatePremium,
    updateProfileWithCost,
    renameProfile,
    renameCost: RENAME_COST,
    setSubscriptionTier,
    toast,
    clearToast,
    levelUpInfo,
    clearLevelUp,
    randomQuote,
    mapProgress,
    completeLesson,
    completeLessonStage,
  };
}








