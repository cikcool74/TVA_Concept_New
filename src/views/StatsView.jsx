import { Home, BarChart2, Sparkles, Lock } from "lucide-react";
import { useMemo, useState, useRef } from "react";
import { PixelCard } from "../components/PixelCard";
import { getTodayString } from "../utils/date";

const radarCategories = [
  { id: "sleep", label: "СОН" },
  { id: "sport", label: "СПОРТ" },
  { id: "charts", label: "ГРАФИКИ" },
  { id: "learning", label: "ЗНАНИЯ" },
  { id: "strategy", label: "СТРАТЕГИЯ" },
];

const radarTips = {
  sleep: "Сон = восстановление. Больше сна — выше энергия и фокус.",
  sport: "Спорт поднимает энергию и стабильность. Держи регулярность.",
  charts: "Графики — навыки анализа, время за графиками и сетапы.",
  learning: "Знания — чтение, обучение, разборы. Регулярность — ключ.",
  strategy: "Стратегия — планы, исследования, сценарии. Определяет стабильность решений.",
};

const normalizeCategory = (cat = "") => {
  if (cat === "research" || cat === "planning") return "strategy";
  if (radarCategories.some((c) => c.id === cat)) return cat;
  return "other";
};

const buildDayMap = (stats) =>
  (stats || []).reduce((acc, item) => {
    const day = item.date || "unknown";
    const cat = normalizeCategory(item.category);
    const current = acc[day] || { tasks: 0, exp: 0, categoryCounts: {} };
    current.tasks += 1;
    current.exp += item.rewardExp ?? item.exp ?? 0;
    if (cat !== "other") {
      current.categoryCounts[cat] = (current.categoryCounts[cat] || 0) + 1;
    }
    acc[day] = current;
    return acc;
  }, {});

const buildOverallCounts = (stats) =>
  (stats || []).reduce((acc, item) => {
    const cat = normalizeCategory(item.category);
    if (cat === "other") return acc;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toISOString().slice(0, 10);
};

export function StatsView({ stats, player, onBack, onTalents = () => {}, onOracle = () => {}, onShop = () => {} }) {
  const [activePoint, setActivePoint] = useState(null);
  const shareRef = useRef(null);
  const today = getTodayString();
  const dayMap = buildDayMap(stats);
  const dayEntries = Object.entries(dayMap).sort((a, b) => (a[0] > b[0] ? -1 : 1));
  const recentDays = dayEntries.slice(0, 7);
  const todayStats = dayMap[today] || { tasks: 0, exp: 0, categoryCounts: {} };

  const overallCounts = buildOverallCounts(stats);
  const maxCount = Math.max(1, ...radarCategories.map((c) => overallCounts[c.id] || 0));
  const center = 120;
  const radius = 90;
  const weakest = useMemo(() => {
    const pairs = radarCategories.map((c) => ({ id: c.id, label: c.label, value: overallCounts[c.id] || 0 }));
    return pairs.sort((a, b) => a.value - b.value)[0];
  }, [overallCounts]);

  const ringPoints = (level) =>
    radarCategories
      .map((_, idx) => {
        const angle = (Math.PI * 2 * idx) / radarCategories.length - Math.PI / 2;
        const r = radius * level;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");

  const dataPoints = radarCategories.map((cat, idx) => {
    const value = overallCounts[cat.id] || 0;
    const angle = (Math.PI * 2 * idx) / radarCategories.length - Math.PI / 2;
    const r = maxCount === 0 ? 0 : (value / maxCount) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, value };
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const badges = useMemo(() => {
    const list = [];
    if ((player.streakDays || 0) >= 7) list.push({ title: "Серия 7+", desc: "Держишь стрик минимум неделю." });
    if ((player.streakDays || 0) >= 30) list.push({ title: "Серия 30+", desc: "Месяц без пропусков." });
    const totalTasks = stats.length;
    if (totalTasks >= 20) list.push({ title: "Настойчивость", desc: "20+ задач выполнено." });
    if ((overallCounts.learning || 0) >= 10) list.push({ title: "Учёба", desc: "10+ действий в знаниях." });
    if ((overallCounts.sport || 0) >= 10) list.push({ title: "Движ", desc: "10+ действий в спорте." });
    return list.slice(0, 5);
  }, [player.streakDays, stats.length, overallCounts]);

  const advisorSteps = useMemo(() => {
    const map = {
      sleep: ["Ложись и вставай в одно время", "Отключи экраны за 30 мин до сна", "Добавь 10 минут растяжки перед сном"],
      sport: ["Поставь 20-30 мин разминки ежедневно", "Добавь шаги: +2к к текущему среднему", "Один силовой блок в неделю"],
      charts: ["Разбор 2 сетапов в день", "Скриншоты сделок + заметки", "Одна сессия реплея графиков"],
      learning: ["10 страниц книги/курса ежедневно", "1 конспект в неделю", "Проверка заметок раз в 3 дня"],
      strategy: ["План на день (3 цели)", "Разбор сценариев на неделю", "Оценка результатов в конце дня"],
    };
    if (!weakest) return [];
    return map[weakest.id] || [];
  }, [weakest]);

  const handleShare = async () => {
    if (!shareRef.current) return;
    try {
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(shareRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "tva-progress.png";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить картинку. Попробуй снова.");
    }
  };

  return (
    <div className="space-y-4" ref={shareRef}>
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <BarChart2 size={18} className="text-emerald-400" />
        Прогресс трейдера
      </h2>

      <div className="grid md:grid-cols-3 gap-3">
        <PixelCard>
          <p className="text-xs text-gray-400">Уровень</p>
          <p className="text-2xl font-bold text-accent">{player.level}</p>
        </PixelCard>
        <PixelCard>
          <p className="text-xs text-gray-400">Золото</p>
          <p className="text-2xl font-bold text-yellow-400">{player.gold}</p>
        </PixelCard>
        <PixelCard>
          <p className="text-xs text-gray-400">Дней подряд</p>
          <p className="text-2xl font-bold text-emerald-400">{player.streakDays}</p>
        </PixelCard>
      </div>

      <PixelCard>
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-2">Колесо навыков</p>
            <div className="bg-[#0f1724] border border-[#1f2937] rounded-xl p-4 shadow-inner">
              <svg viewBox="0 0 240 240" className="w-full">
                {[0.33, 0.66, 1].map((level, idx) => (
                  <g key={level}>
                    <polygon
                      points={ringPoints(level)}
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="1"
                    />
                    <text
                      x={center}
                      y={center - radius * level - 2}
                      textAnchor="middle"
                      className="fill-gray-500 text-[8px]"
                    >
                      {Math.round(level * 100)}
                    </text>
                  </g>
                ))}
                <polygon points={dataPolygon} fill="rgba(251, 191, 36, 0.16)" stroke="#facc15" strokeWidth="3" />
                {dataPoints.map((p, idx) => (
                  <g key={`point-${idx}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="5"
                      fill="#facc15"
                      stroke="#0f1724"
                      strokeWidth="1.5"
                      className="cursor-pointer"
                      onClick={() =>
                        setActivePoint({
                          id: radarCategories[idx].id,
                          label: radarCategories[idx].label,
                          value: p.value,
                        })
                      }
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className="fill-amber-200 text-[9px] font-bold drop-shadow"
                    >
                      {overallCounts[radarCategories[idx].id] || 0}
                    </text>
                  </g>
                ))}
                {radarCategories.map((cat, idx) => {
                  const angle = (Math.PI * 2 * idx) / radarCategories.length - Math.PI / 2;
                  const x = center + (radius + 10) * Math.cos(angle);
                  const y = center + (radius + 10) * Math.sin(angle);
                  return (
                    <text
                      key={cat.id}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-400 text-[9px] font-semibold"
                    >
                      {cat.label}
                    </text>
                  );
                })}
              </svg>
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Диаграмма показывает количество выполненных задач в каждой категории за всё время.
              </p>
            </div>
          </div>
          <div className="w-full md:w-48 space-y-3">
            {radarCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between bg-black/30 border border-[#1f2937] rounded-lg px-3 py-2 text-xs text-gray-300"
              >
                <span>{cat.label}</span>
                <span className="text-emerald-400 font-bold">
                  {overallCounts[cat.id] || 0}
                </span>
              </div>
            ))}
          </div>
          {activePoint && (
            <div className="w-full bg-black/40 border border-[#1f2937] rounded-lg p-3 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{activePoint.label}</span>
                <span className="text-amber-300 font-bold">{activePoint.value}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {radarTips[activePoint.id] || "Клик по точке, чтобы увидеть подсказку."}
              </p>
              <button
                className="text-[10px] text-gray-500 underline mt-1"
                onClick={() => setActivePoint(null)}
              >
                Скрыть
              </button>
            </div>
          )}
        </div>
      </PixelCard>

      <PixelCard>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-[#0f1724] border border-[#1f2937]">
            <Lock size={16} className="text-gray-400" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-bold text-white flex items-center gap-2">
              Советы ментора
              <Sparkles size={14} className="text-amber-300" />
            </p>
            <p className="text-xs text-gray-400">
              Персонализированные советы наставников TVA доступны в подписке Advanced и Pro.
            </p>
            <p className="text-[11px] text-gray-500">
              Открой экран Premium Pass в деревне, чтобы выбрать тариф и разблокировать расширенную аналитику.
            </p>
          </div>
        </div>
      </PixelCard>

      <PixelCard>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-white">Сегодня</p>
            <p className="text-xs text-gray-400">{formatDate(today)}</p>
          </div>
          <div className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/40 rounded px-3 py-1">
            +{todayStats.exp} EXP
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-300">
          {radarCategories.map((cat) => (
            <div
              key={`today-${cat.id}`}
              className="bg-black/30 border border-[#1f2937] rounded-lg px-3 py-2 flex items-center justify-between"
            >
              <span>{cat.label}</span>
              <span className="text-emerald-400 font-bold">
                {todayStats.categoryCounts[cat.id] || 0}
              </span>
            </div>
          ))}
          <div className="bg-black/30 border border-[#1f2937] rounded-lg px-3 py-2 flex items-center justify-between">
            <span>Задач за день</span>
            <span className="text-accent font-bold">{todayStats.tasks}</span>
          </div>
        </div>
      </PixelCard>

      <PixelCard>
        <p className="text-sm font-bold text-white mb-3">Последние дни</p>
        {recentDays.length === 0 && (
          <p className="text-xs text-gray-500">Тут появится статистика после выполнения задач.</p>
        )}
        <div className="space-y-2">
          {recentDays.map(([date, summary]) => (
            <div
              key={date}
              className="flex items-center justify-between text-sm bg-black/30 rounded border border-[#1f2937] px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-white text-xs">{formatDate(date)}</span>
                <span className="text-[11px] text-gray-500">{summary.tasks} задач</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-bold">{summary.tasks} задач</span>
                <span className="text-amber-300 font-bold">+{summary.exp} EXP</span>
              </div>
            </div>
          ))}
        </div>
      </PixelCard>

      {weakest && (
        <PixelCard className="bg-[#0f1724] border-[#1f2937]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-white">Слабое место: {weakest.label}</span>
            <span className="text-amber-300 text-xs font-bold">{weakest.value}</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Подтянув эту грань, ускоришь прогресс. Выбери действие:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-2 text-xs rounded border border-amber-500/50 bg-amber-500/10 text-amber-200 hover:border-amber-400"
              onClick={onTalents}
            >
              К талантам
            </button>
            <button
              className="px-3 py-2 text-xs rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
              onClick={onOracle}
            >
              К советнику (AI)
            </button>
            <button
              className="px-3 py-2 text-xs rounded border border-blue-500/50 bg-blue-500/10 text-blue-200 hover:border-blue-400"
              onClick={onShop}
            >
              К магазинам/апгрейдам
            </button>
          </div>
        </PixelCard>
      )}

      <div className="flex justify-end">
        <button
          className="px-3 py-2 text-xs rounded border border-amber-500/50 bg-amber-500/10 text-amber-200 hover:border-amber-400"
          onClick={handleShare}
        >
          Сохранить как PNG
        </button>
      </div>
    </div>
  );
}
