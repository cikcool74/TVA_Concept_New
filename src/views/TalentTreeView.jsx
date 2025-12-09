import { Home, Star } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";
import { TALENTS } from "../data/talents";

export function TalentTreeView({ unlockedTalents, gold, onUnlock, onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Star size={18} className="text-yellow-400" />
        Дерево Талантов
      </h2>

      <PixelCard>
        <div className="grid md:grid-cols-2 gap-3">
          {TALENTS.map((talent) => {
            const level = unlockedTalents[talent.id] || 0;
            const maxed = level >= talent.maxLevel;
            const affordable = gold >= talent.cost;
            return (
              <div key={talent.id} className="p-3 bg-black/30 border border-border rounded-lg">
                <p className="text-sm font-bold text-white">{talent.name}</p>
                <p className="text-xs text-gray-400">{talent.description}</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Уровень: {level}/{talent.maxLevel} · Цена: {talent.cost} 💰
                </p>
                <Button
                  className="mt-2"
                  variant="accent"
                  disabled={maxed || !affordable}
                  onClick={() => onUnlock(talent.id)}
                >
                  {maxed ? "Макс" : "Прокачать"}
                </Button>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
}
