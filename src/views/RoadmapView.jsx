import { Home } from "lucide-react";
import { PixelCard } from "../components/PixelCard";

export function RoadmapView({ onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="text-lg font-bold text-yellow-400 mb-2">TVA Ecosystem Roadmap</div>
        <p className="text-xs text-gray-300 mb-2">
          План развития Trading Village Academy: от личного трекера дисциплины до полноценной геймифицированной платформы для трейдеров.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-600/40 text-yellow-300 font-bold uppercase tracking-widest">MVP</span>
          <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-600/40 text-blue-300 font-bold uppercase tracking-widest">Social</span>
          <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-600/40 text-purple-300 font-bold uppercase tracking-widest">PVP</span>
          <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-600/40 text-emerald-300 font-bold uppercase tracking-widest">Web3</span>
        </div>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="text-lg font-bold text-white mb-2">Q1 — Foundation</div>
        <ul className="text-sm text-gray-200 space-y-1">
          <li>• Онлайн-синхронизация профиля и прогресса</li>
          <li>• Расширенная статистика и аналитика привычек</li>
          <li>• Уровни прогресса деревни и апгрейды зданий</li>
          <li>• Первый набор артефактов и талантов</li>
        </ul>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="text-lg font-bold text-white mb-2">Q2 — Social Layer</div>
        <ul className="text-sm text-gray-200 space-y-1">
          <li>• Друзья и социальный граф трейдеров</li>
          <li>• Лидерборды: день / неделя / сезон</li>
          <li>• Социальные механики: кланы / деревни-союзы</li>
          <li>• Статусные роли и «титулы» внутри деревни</li>
        </ul>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="text-lg font-bold text-white mb-2">Q3 — PvP & Meta Progression</div>
        <ul className="text-sm text-gray-200 space-y-1">
          <li>• PvP-ивенты, дуэли дисциплины</li>
          <li>• Сезоны, ранги, награды</li>
          <li>• NFT-скины зданий, наставников, эмблем</li>
          <li>• Маркетплейс косметики и бустеров</li>
        </ul>
      </PixelCard>

      <div className="text-center text-[11px] text-gray-500">@AT_Signals_Hand_bot</div>
    </div>
  );
}
