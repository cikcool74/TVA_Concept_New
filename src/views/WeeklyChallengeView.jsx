import { Home, Calendar, Flame } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";

export function WeeklyChallengeView({ challenge, onBack, onClaim }) {
  if (!challenge) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        >
          <Home size={12} /> Вернуться в деревню
        </button>
        <PixelCard>Пока нет испытания. Загляни позже.</PixelCard>
      </div>
    );
  }

  const progressPct = Math.min(
    100,
    (challenge.currentProgress / challenge.requiredCompletions) * 100
  );

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Calendar size={18} className="text-red-400" />
        Босс деревни
      </h2>

      <PixelCard className="border-red-500/40 bg-[#1a202c]">
        <p className="text-sm font-bold text-white mb-1">{challenge.title}</p>
        <p className="text-xs text-gray-400 mb-3">{challenge.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
          <span>Прогресс</span>
          <span className="text-red-400 font-bold">
            {challenge.currentProgress}/{challenge.requiredCompletions}
          </span>
        </div>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-red-500" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-300 mb-3">
          <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-600/40 text-emerald-300 font-bold">
            +{challenge.expReward} EXP
          </span>
          <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-600/40 text-yellow-300 font-bold">
            +{challenge.goldReward} золота
          </span>
          <span className="px-2 py-1 rounded bg-red-900/30 border border-red-600/40 text-red-300 font-bold flex items-center gap-1">
            <Flame size={14} /> Категория: {challenge.targetCategory}
          </span>
        </div>

        <Button
          variant={challenge.isCompleted ? "success" : "secondary"}
          disabled={!challenge.isCompleted || challenge.isClaimed}
          onClick={onClaim}
          className="w-full"
        >
          {challenge.isClaimed
            ? "Награда получена"
            : challenge.isCompleted
              ? "Получить награду"
              : "Выполни задачи"}
        </Button>
      </PixelCard>
    </div>
  );
}
