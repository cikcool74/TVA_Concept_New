import { useState } from "react";
import { Button } from "../components/Button";
import { PixelCard } from "../components/PixelCard";

const avatarOptions = ["🧑‍🚀", "🧙‍♂️", "🧑‍🎤", "🧑‍💻", "🧑‍🍳", "🧑‍🎓", "🧑‍🚒", "🧑‍⚕️", "🧑‍🏫", "🧑‍✈️"];

export function SetupView({ onComplete }) {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [goalStage, setGoalStage] = useState("Новичок");
  const [goal, setGoal] = useState("");
  const [sleepPlanFrom, setSleepPlanFrom] = useState("23:00");
  const [sleepPlanTo, setSleepPlanTo] = useState("07:00");
  const [sportMinutes, setSportMinutes] = useState("30");
  const [avatarEmoji, setAvatarEmoji] = useState(avatarOptions[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      goal: goal.trim(),
      goalStage,
      telegram: telegram.trim(),
      sleepPlanFrom,
      sleepPlanTo,
      sportMinutes: Number(sportMinutes) || 0,
      avatarEmoji,
    };
    onComplete(payload);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <p className="text-[11px] text-gray-500 flex items-center justify-center gap-2">
          <span role="img" aria-label="monk">🧘</span> Монах Спокойствия говорит:
        </p>
        <p className="text-[11px] text-gray-500 italic">"Дыши. Рынок никуда не уйдёт."</p>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold text-amber-300 tracking-wide">ДОБРО ПОЖАЛОВАТЬ</h1>
        <p className="text-sm text-gray-300">Создай профиль, чтобы войти в Академию.</p>
      </div>

      <PixelCard className="bg-[#0f1724] border-[#1f2937] shadow-inner">
        <div className="space-y-3">
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
            <label className="text-[10px] uppercase text-gray-500 font-bold">Ник в Telegram</label>
            <input
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
              placeholder="@nickname"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Укажи свой @ник, чтобы наставники TVA могли найти тебя в деревне.
            </p>
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
              <label className="text-[10px] uppercase text-gray-500 font-bold">План сна (отбой)</label>
              <input
                value={sleepPlanFrom}
                onChange={(e) => setSleepPlanFrom(e.target.value)}
                className="w-full bg-black border border-border text-sm text-white p-2 rounded focus:border-accent outline-none"
                placeholder="23:00"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-500 font-bold">План сна (подъём)</label>
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
            <label className="text-[10px] uppercase text-gray-500 font-bold">Текущая цель</label>
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

          <Button variant="accent" className="w-full py-3 mt-2" onClick={handleSubmit}>
            Войти в деревню
          </Button>
        </div>
      </PixelCard>
    </div>
  );
}
