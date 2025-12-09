import { Calendar, Gem, Crown, Map } from "lucide-react";

export function HeaderBar({ player, onHome, onMap }) {
  const expPct = Math.min(100, (player.currentExp / player.expToNextLevel) * 100);
  return (
    <div className="w-full bg-[#0f1724] border border-[#1f2937] rounded-xl px-4 py-3 flex items-center gap-3 shadow-inner sticky top-0 z-40">
      <button
        onClick={onHome}
        className="flex items-center gap-2 mr-4 hover:opacity-90 transition"
      >
        <div className="w-10 h-10 rounded-lg bg-[#111826] border border-[#1f2937] flex items-center justify-center text-2xl">
          🏠
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-400">TVA</div>
          <div className="text-sm font-bold text-white">Trading Village Academy</div>
        </div>
      </button>

      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Calendar size={16} className="text-yellow-400" />
        <span className="font-bold text-yellow-400">{player.streakDays || 0}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Gem size={16} className="text-yellow-400" />
        <span>{player.gold}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <Crown size={16} className="text-yellow-400" />
        <span className="font-bold text-yellow-400">LVL {player.level}</span>
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-gray-400">EXP {player.currentExp} / {player.expToNextLevel}</div>
        <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400" style={{ width: `${expPct}%` }} />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onMap}
          className="text-[11px] text-gray-900 bg-amber-400 hover:bg-amber-300 flex items-center gap-1 px-3 py-1 rounded border border-amber-600 font-bold uppercase"
        >
          <Map size={14} /> Школа
        </button>
      </div>
    </div>
  );
}
