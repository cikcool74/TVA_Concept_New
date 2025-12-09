import { Home, Crown } from "lucide-react";
import { UPGRADES } from "../data/upgrades";
import { LOCATIONS } from "../data/locations";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";

export function ShopView({ upgrades, playerGold, onUpgrade, onBack }) {
  const getStep = (locationId) => {
    const current = upgrades[locationId] || 1;
    const upgradeInfo = UPGRADES.find((u) => u.locationId === locationId);
    if (!upgradeInfo) return null;
    return upgradeInfo.steps.find((s) => s.level === current + 1) || null;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Crown size={18} className="text-accent" />
        Лавка Улучшений
      </h2>

      <PixelCard>
        <p className="text-xs text-gray-400 mb-4">
          Улучшай здания, чтобы открывать больше слотов задач и получать бонусы.
        </p>
        <div className="space-y-3">
          {LOCATIONS.map((loc) => {
            const nextStep = getStep(loc.id);
            const level = upgrades[loc.id] || 1;
            return (
              <div key={loc.id} className="p-3 bg-black/30 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{loc.tvaName}</p>
                    <p className="text-[11px] text-gray-500">Текущий уровень: {level}</p>
                    {nextStep ? (
                      <p className="text-[11px] text-gray-400">
                        Следующий: {nextStep.name} — {nextStep.cost} золота
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-400">Максимальный уровень</p>
                    )}
                  </div>
                  {nextStep && (
                    <Button
                      variant="accent"
                      disabled={playerGold < nextStep.cost}
                      onClick={() => onUpgrade(loc.id)}
                    >
                      Улучшить
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
}
