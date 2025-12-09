import { Button } from "./Button";
import { PixelCard } from "./PixelCard";
import { Star, Shield, Bot, Sparkles } from "lucide-react";

export function ProfileCard({
  profile,
  player,
  renameCost,
  onRenameProfile,
  onBalance,
  onPremium,
  onShop,
  onTalents,
  onInventory,
  onTelegram,
  onRoadmap,
  onOracle,
  onStats,
  onBoss,
}) {
  return (
    <PixelCard className="bg-[#0f1724] border-[#1f2937] shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-[#111826] border border-[#1f2937] flex items-center justify-center overflow-hidden text-2xl">
            {profile.avatarEmoji ? (
              <span role="img" aria-label="avatar">
                {profile.avatarEmoji}
              </span>
            ) : (
              <img src={profile.avatarUrl || "/assets/avatar.png"} alt="avatar" className="w-full h-full object-cover" />
            )}
          </div>
        <div>
          <div className="text-xs text-gray-400">Профиль</div>
          <button
            type="button"
            onClick={onRenameProfile}
            className="text-sm text-white font-bold hover:text-amber-300 transition underline decoration-dotted"
            title="Сменить имя за золото"
          >
            @{profile.name || "tva"}
          </button>
          {renameCost ? (
            <div className="text-[10px] text-gray-500">Смена имени — {renameCost} золота</div>
          ) : null}
          {profile.role && <div className="text-[11px] text-gray-400">{profile.role}</div>}
        </div>
      </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-purple-600 border-purple-800 text-white" onClick={onBalance}>
            Колесо баланса
          </Button>
          <Button variant="secondary" className="bg-emerald-600 border-emerald-800 text-white flex items-center gap-1" onClick={onPremium}>
            <Sparkles size={14} /> Premium
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <PixelCard className="bg-[#0b1220] border-[#1f2937]">
          <div className="text-gray-400">Всего опыта</div>
          <div className="text-2xl font-bold text-yellow-400">{player.totalExp}</div>
        </PixelCard>
        <PixelCard className="bg-[#0b1220] border-[#1f2937]">
          <div className="text-gray-400">Талантов</div>
          <div className="flex items-center gap-1 text-2xl font-bold text-purple-300">
            <Star size={18} /> {Object.keys(player.unlockedTalents || {}).length}
          </div>
        </PixelCard>
        <PixelCard className="bg-[#0b1220] border-[#1f2937]">
          <div className="text-gray-400">Артефакты</div>
          <div className="flex items-center gap-1 text-2xl font-bold text-blue-300">
            <Shield size={18} /> {player.equippedArtifactIds.length}
          </div>
        </PixelCard>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Button variant="accent" onClick={onShop}>Магазин</Button>
        <Button variant="accent" onClick={onTalents}>Таланты</Button>
        <Button variant="accent" onClick={onInventory}>Артефакты</Button>
        <Button variant="secondary" className="bg-blue-500 border-blue-700 text-white" onClick={onTelegram}>Telegram</Button>
        <Button variant="secondary" className="bg-blue-600 border-blue-800 text-white" onClick={onRoadmap}>Roadmap</Button>
        <Button variant="secondary" className="bg-purple-700 border-purple-900 text-white" onClick={onOracle}>Оракул (AI)</Button>
        <Button variant="secondary" className="col-span-3 bg-[#1f2937] border-[#273449] text-white" onClick={onStats}>
          Статистика дня
        </Button>
        <Button variant="secondary" className="col-span-3 bg-red-700 border-red-900 text-white" onClick={onBoss}>
          Босс деревни
        </Button>
      </div>

      <div className="mt-3 text-[11px] text-gray-400 flex items-center gap-2">
        <Bot size={14} className="text-emerald-400" /> Дед Аналитик говорит:{" "}
        <span className="italic text-gray-300">"Если график растёт — не мешай ему."</span>
      </div>
    </PixelCard>
  );
}

