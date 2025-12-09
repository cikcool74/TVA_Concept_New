import { Map as MapIcon, ChevronRight, CheckSquare } from "lucide-react";
import { LOCATIONS } from "../data/locations";
import { PixelCard } from "../components/PixelCard";
import { ProfileCard } from "../components/ProfileCard";

export function VillageView({
  profile,
  player,
  tasks,
  onSelectLocation,
  quote,
  renameCost,
  goProfileSettings,
  goShop,
  goPremium,
  goTalents,
  goInventory,
  goTelegram,
  goRoadmap,
  goOracle,
  goBalance,
  goStats,
  goBoss,
}) {
  return (
    <div className="space-y-4">
      <ProfileCard
        profile={profile}
        player={player}
        renameCost={renameCost}
        onRenameProfile={goProfileSettings}
        onBalance={goBalance}
        onPremium={goPremium}
        onShop={goShop}
        onTalents={goTalents}
        onInventory={goInventory}
        onTelegram={goTelegram}
        onRoadmap={goRoadmap}
        onOracle={goOracle}
        onStats={goStats}
        onBoss={goBoss}
      />

      <div className="flex items-center gap-2 text-gray-300 text-xs mt-4">
        <MapIcon size={14} />
        Карта деревни
      </div>
      <div className="space-y-3">
        {LOCATIONS.map((loc) => {
          const locTasks = tasks.filter((t) => t.locationId === loc.id);
          const completed = locTasks.filter((t) => t.completed).length;
          const total = locTasks.length || 1;
          const isComplete = completed === total;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              className="w-full bg-[#0f1724] border border-[#1f2937] rounded-xl p-4 flex items-center justify-between hover:border-gray-500 transition text-left shadow-inner"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#111826] border border-[#1f2937] flex items-center justify-center overflow-hidden text-2xl">
                  {loc.iconUrl ? (
                    <img
                      src={loc.iconUrl}
                      alt={loc.tvaName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  <span className="absolute">{loc.emoji || "🏠"}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-white">{loc.tvaName}</div>
                    {isComplete && (
                      <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                        <CheckSquare size={10} /> ГОТОВО
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{loc.description}</p>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mt-2 w-48">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isComplete ? "bg-emerald-500" : "bg-emerald-400"
                      }`}
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-600" />
            </button>
          );
        })}
      </div>

      {quote && (
        <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-4">
          🧙 Старый Трейдер говорит: <span className="italic text-gray-300">“{quote}”</span>
        </div>
      )}
    </div>
  );
}

