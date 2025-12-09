export const TALENTS = [
  { id: "focus_1", name: "Первоначальный Фокус", description: "+5% к базовому EXP", cost: 500, maxLevel: 3, effect: "exp_boost", baseValue: 0.05, prereqTalentId: null },
  { id: "gold_finder_1", name: "Золотая Жила", description: "+10% к Золоту за задачи", cost: 1000, maxLevel: 3, effect: "gold_boost", baseValue: 0.1, prereqTalentId: "focus_1" },
  { id: "discipline_mastery", name: "Мастер Дисциплины", description: "Увеличивает ежедневный лимит задач", cost: 2000, maxLevel: 1, effect: "extra_task_slot", baseValue: 1, prereqTalentId: "gold_finder_1" },
  { id: "advanced_focus", name: "Продвинутый Фокус", description: "+10% к базовому EXP", cost: 1500, maxLevel: 2, effect: "exp_boost", baseValue: 0.1, prereqTalentId: "focus_1" },
  { id: "more_tasks_ii", name: "Гильдия Задач II", description: "Ещё больше слотов задач для самых упорных трейдеров.", cost: 3, maxLevel: 2, effect: "extra_task_slot", baseValue: 1, prereqId: null },
  { id: "more_tasks_iii", name: "Гильдия Задач III", description: "Элита TVA получает максимум доступных задач в день.", cost: 5, maxLevel: 1, effect: "extra_task_slot", baseValue: 2, prereqId: "more_tasks_ii" },
  { id: "gold_mentor_i", name: "Монеты Мастера I", description: "Небольшой постоянный бонус к золоту за выполнение задач.", cost: 2, maxLevel: 3, effect: "gold_boost", baseValue: 0.05, prereqId: null },
  { id: "gold_mentor_ii", name: "Монеты Мастера II", description: "Сильный рост золота для тех, кто не пропускает дни.", cost: 4, maxLevel: 2, effect: "gold_boost", baseValue: 0.1, prereqId: "gold_mentor_i" },
  { id: "exp_streak_i", name: "Путь Ученичества", description: "Каждый день с задачами приносит чуть больше опыта.", cost: 2, maxLevel: 3, effect: "exp_boost", baseValue: 0.05, prereqId: null },
  { id: "exp_streak_ii", name: "Путь Мастера", description: "Для тех, кто держит серию выполненных дней без срывов.", cost: 4, maxLevel: 2, effect: "exp_boost", baseValue: 0.1, prereqId: "exp_streak_i" },
  { id: "artifact_master_i", name: "Мастер Артефактов I", description: "Позволяет экипировать ещё один артефакт.", cost: 3, maxLevel: 1, effect: "extra_equip_slot", baseValue: 1, prereqId: null },
  { id: "artifact_master_ii", name: "Мастер Артефактов II", description: "Ещё один дополнительный слот для артефакта.", cost: 5, maxLevel: 1, effect: "extra_equip_slot", baseValue: 1, prereqId: "artifact_master_i" },
];
