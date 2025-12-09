import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { PixelCard } from "../components/PixelCard";

const avatarOptions = ["🧑‍🚀", "🧙‍♂️", "🧑‍🎤", "🧑‍💻", "🧑‍🍳", "🧑‍🎓", "🧑‍🚒", "🧑‍⚕️", "🧑‍🏫", "🧑‍✈️"];
const profileDefaults = {
  name: "",
  goal: "",
  goalStage: "Новичок",
  telegram: "",
  sleepPlanFrom: "23:00",
  sleepPlanTo: "07:00",
  sportMinutes: 30,
  avatarEmoji: avatarOptions[0],
};

export function ProfileSettingsView({ profile, player, renameCost, onSave, onBack }) {
  const initial = useMemo(() => ({ ...profileDefaults, ...(profile || {}) }), [profile]);
  const [name, setName] = useState(initial.name);
  const [goalStage, setGoalStage] = useState(initial.goalStage);
  const [goal, setGoal] = useState(initial.goal);
  const [sleepPlanFrom, setSleepPlanFrom] = useState(initial.sleepPlanFrom);
  const [sleepPlanTo, setSleepPlanTo] = useState(initial.sleepPlanTo);
  const [sportMinutes, setSportMinutes] = useState(String(initial.sportMinutes ?? 0));
  const [avatarEmoji, setAvatarEmoji] = useState(initial.avatarEmoji || avatarOptions[0]);

  const isDirty = useMemo(() => {
    const current = {
      name,
      goal,
      goalStage,
      sleepPlanFrom,
      sleepPlanTo,
      sportMinutes: Number(sportMinutes) || 0,
      avatarEmoji,
    };
    return Object.entries(current).some(([k, v]) => {
      const baseVal = k === "sportMinutes" ? Number(initial[k] || 0) : initial[k];
      return v !== baseVal;
    });
  }, [name, goal, goalStage, sleepPlanFrom, sleepPlanTo, sportMinutes, avatarEmoji, initial]);

  const handleSave = async () => {
    if (!isDirty) return;
    const payload = {
      name: name.trim(),
      goal: goal.trim(),
      goalStage,
      sleepPlanFrom,
      sleepPlanTo,
      sportMinutes: Number(sportMinutes) || 0,
      avatarEmoji,
    };
    const res = await onSave?.(payload);
    if (res?.ok) {
      onBack?.();
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        onClick={onBack}
      >
        ← Вернуться в деревню
      </button>

      <div className="space-y-1">
        <p className="text-[11px] text-gray-500 italic text-center">
          "Если график растёт — не мешай ему."
        </p>
        <h2 className="text-xl font-bold text-white">Настройки профиля</h2>
      </div>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div>
            <p className="font-bold text-white">Твоё золото:</p>
            <p className="text-amber-300 text-lg font-bold">{player.gold}</p>
          </div>
          <div className="text-right text-[12px] text-gray-400">
            Любое изменение профиля спишет{" "}
            <span className="text-amber-300 font-bold">{renameCost ?? 0}</span> золота.
          </div>
        </div>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937] shadow-inner space-y-4">
        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold">Имя трейдера</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
            placeholder="Например, Сатоши"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold">Текущая цель</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {["Новичок", "Опытный", "Профи"].map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setGoalStage(stage)}
                className={`w-full rounded border px-3 py-2 text-sm font-bold transition ${
                  goalStage === stage
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-black text-gray-300 border-border hover:border-gray-500"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase text-gray-500 font-bold">Отбой</label>
            <input
              value={sleepPlanFrom}
              onChange={(e) => setSleepPlanFrom(e.target.value)}
              className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
              placeholder="23:00"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-gray-500 font-bold">Подъём</label>
            <input
              value={sleepPlanTo}
              onChange={(e) => setSleepPlanTo(e.target.value)}
              className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
              placeholder="07:00"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold">Спорт (мин/день)</label>
          <input
            value={sportMinutes}
            onChange={(e) => setSportMinutes(e.target.value)}
            className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
            placeholder="30"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold">Цель</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
            placeholder="Например: стабильный профит в месяц"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold">Аватар</label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {avatarOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatarEmoji(emoji)}
                className={`h-12 rounded border flex items-center justify-center text-2xl transition ${
                  avatarEmoji === emoji
                    ? "border-amber-400 bg-amber-500/20"
                    : "border-border bg-black hover:border-gray-500"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant={isDirty ? "accent" : "secondary"}
          className="w-full py-3 mt-2"
          onClick={handleSave}
          disabled={!isDirty}
        >
          {isDirty ? "Сохранить изменения" : "Изменений нет"}
        </Button>
      </PixelCard>
    </div>
  );
}
