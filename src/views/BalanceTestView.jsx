import { useMemo, useState } from "react";
import { Home, Target, RefreshCcw } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";

const BALANCE_DIMENSIONS = [
  { id: "discipline", label: "Дисциплина" },
  { id: "energy", label: "Энергия" },
  { id: "focus", label: "Фокус" },
  { id: "emotions", label: "Эмоции" },
  { id: "finances", label: "Финансы" },
];

const BALANCE_QUESTIONS = [
  { id: "q1", dimension: "discipline", text: "Следую ли я своим планам и расписанию без частых срывов?" },
  { id: "q2", dimension: "discipline", text: "Довожу ли я начатые задачи до конца и избегаю прокрастинации?" },
  { id: "q3", dimension: "energy", text: "Чувствую ли я бодрость в течение дня и быстро ли восстанавливаюсь?" },
  { id: "q4", dimension: "energy", text: "Регулярно ли сплю и ем так, чтобы хватало сил на цели?" },
  { id: "q5", dimension: "focus", text: "Могу ли я долго удерживать концентрацию без отвлечений?" },
  { id: "q6", dimension: "focus", text: "Планирую ли я глубокую работу и защищаю время от шумов?" },
  { id: "q7", dimension: "emotions", text: "Управляю ли я эмоциями во время стресса и рыночных колебаний?" },
  { id: "q8", dimension: "emotions", text: "Слежу ли я за ментальным состоянием и отдыхаю вовремя?" },
  { id: "q9", dimension: "finances", text: "Есть ли у меня план по финансам и накоплениям?" },
  { id: "q10", dimension: "finances", text: "Контролирую ли я расходы и не делаю импульсивных трат?" },
];

const RadarChart = ({ scores }) => {
  const dims = BALANCE_DIMENSIONS.map((d) => d.id);
  const angle = (i) => (Math.PI * 2 * i) / dims.length;
  const radius = 90;
  const center = 120;

  const points = dims
    .map((dim, i) => {
      const r = ((scores[dim] || 0) / 100) * radius;
      const x = center + r * Math.sin(angle(i));
      const y = center - r * Math.cos(angle(i));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 240 240" className="mx-auto w-full max-w-md">
      {[0.33, 0.66, 1].map((level) => (
        <polygon
          key={level}
          points={dims
            .map((_, i) => {
              const r = radius * level;
              const x = center + r * Math.sin(angle(i));
              const y = center - r * Math.cos(angle(i));
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#1f2937"
          strokeWidth="1"
        />
      ))}

      <polygon points={points} fill="rgba(234,179,8,0.25)" stroke="#facc15" strokeWidth="3" />

      {dims.map((dim, i) => {
        const x = center + (radius + 12) * Math.sin(angle(i));
        const y = center - (radius + 12) * Math.cos(angle(i));
        const pointR = ((scores[dim] || 0) / 100) * radius;
        const px = center + pointR * Math.sin(angle(i));
        const py = center - pointR * Math.cos(angle(i));
        return (
          <g key={dim}>
            <line x1={center} y1={center} x2={x - 8} y2={y - 8} stroke="#374151" strokeWidth="1" />
            <circle cx={px} cy={py} r="4" fill="#facc15" />
            <text x={x} y={y} fill="#d1d5db" fontSize="10" textAnchor="middle">
              {BALANCE_DIMENSIONS.find((d) => d.id === dim)?.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export function BalanceTestView({ onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const allAnswered = BALANCE_QUESTIONS.every((q) => answers[q.id]);

  const scores = useMemo(() => {
    if (!allAnswered) return null;
    const totals = {};
    const counts = {};
    BALANCE_QUESTIONS.forEach((q) => {
      totals[q.dimension] = (totals[q.dimension] || 0) + answers[q.id];
      counts[q.dimension] = (counts[q.dimension] || 0) + 1;
    });
    const computed = {};
    BALANCE_DIMENSIONS.forEach((dim) => {
      const avg = (totals[dim.id] || 0) / (counts[dim.id] || 1);
      computed[dim.id] = Math.round((avg / 5) * 100);
    });
    return computed;
  }, [answers, allAnswered]);

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white">Колесо Баланса</h2>

      <PixelCard className="bg-gray-900/70 border-yellow-500/40">
        <p className="text-xs text-gray-300">
          Оцени по шкале от 1 до 5, насколько ты согласен с утверждением. 1 — совсем не согласен,
          5 — полностью согласен.
        </p>
      </PixelCard>

      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
        {BALANCE_QUESTIONS.map((q, idx) => (
          <PixelCard key={q.id} className="bg-[#111827] border-gray-800">
            <p className="text-xs text-gray-300 mb-3">
              <span className="text-yellow-400 mr-1">#{idx + 1}</span>
              {q.text}
            </p>
            <div className="flex justify-between gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                  className={
                    "flex-1 text-[10px] py-1 rounded border " +
                    (answers[q.id] === v
                      ? "bg-yellow-500 border-yellow-400 text-black font-bold"
                      : "bg-gray-900 border-gray-700 text-gray-300")
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </PixelCard>
        ))}
      </div>

      <Button
        onClick={() => scores && onComplete(scores)}
        disabled={!allAnswered}
        variant={allAnswered ? "accent" : "secondary"}
        className="w-full py-3 mt-2"
      >
        {allAnswered ? "Построить колесо" : "Ответь на все вопросы"}
      </Button>
    </div>
  );
}

const getBalanceRecommendationsFromScores = (scores) => {
  const recs = [];
  if (scores.discipline < 60) recs.push("Укрепи дисциплину: веди расписание, ставь микро-дедлайны, фиксируй прогресс каждый день.");
  if (scores.energy < 60) recs.push("Добавь режим восстановления: сон 7-8 часов, вода, короткие перерывы, нормальный завтрак.");
  if (scores.focus < 60) recs.push("Выдели блоки глубокой работы без уведомлений. Планируй по 60-90 минут на ключевые задачи.");
  if (scores.emotions < 60) recs.push("Практикуй управление эмоциями: дневник эмоций, дыхание 4-7-8, короткие прогулки.");
  if (scores.finances < 60) recs.push("Наведи порядок в финансах: бюджет, подушка, лимиты на импульсивные траты.");
  if (!recs.length) recs.push("Отличный баланс! Держи темп и периодически пересматривай карту, чтобы не упасть в перекос.");
  return recs;
};

const DIMENSION_COPY = {
  discipline: {
    name: "Дисциплина",
    impact: "Управляет соблюдением планов, снижает хаос и срывы.",
  },
  energy: {
    name: "Энергия",
    impact: "Дает ресурс на работу и восстановление, влияет на скорость прогресса.",
  },
  focus: {
    name: "Фокус",
    impact: "Отвечает за глубину работы и качество решений.",
  },
  emotions: {
    name: "Эмоции",
    impact: "Помогают держать спокойствие и не принимать импульсивных решений.",
  },
  finances: {
    name: "Финансы",
    impact: "Дают устойчивость и возможность инвестировать в развитие.",
  },
};

const scoreState = (value) => {
  if (value >= 75) return { label: "Стабильно", tone: "text-emerald-400" };
  if (value >= 50) return { label: "Нужна поддержка", tone: "text-amber-300" };
  return { label: "Зона риска", tone: "text-red-400" };
};

export function BalanceResultsView({ profile, onBack, onRetake, history = [] }) {
  if (!profile?.balanceScores) return null;
  const scores = profile.balanceScores;
  const recs = getBalanceRecommendationsFromScores(scores);
  const prevEntry = history.slice(0, -1).slice(-1)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        >
          <Home size={12} /> Вернуться в деревню
        </button>
        {onRetake && (
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={onRetake}
          >
            <RefreshCcw size={14} /> Перепройти тест
          </Button>
        )}
      </div>

      <h2 className="text-xl font-bold text-white">Твоё колесо баланса</h2>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="text-center text-[11px] text-gray-400 mb-2 uppercase tracking-widest">
          Карта состояния
        </div>
        <RadarChart scores={scores} />
        <p className="text-[11px] text-gray-500 text-center mt-4">
          Это твоё текущее распределение сил: где ты стабилен, а где нужна прокачка, чтобы расти.
        </p>
      </PixelCard>

      {prevEntry && (
        <PixelCard className="bg-[#0f1724] border-[#1f2937]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Сравнение с прошлым разом</h3>
            <span className="text-[11px] text-gray-400">{prevEntry.date}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-300">
            {BALANCE_DIMENSIONS.map(({ id, label }) => {
              const current = scores[id] ?? 0;
              const prev = prevEntry.scores?.[id] ?? 0;
              const diff = current - prev;
              const tone = diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-gray-400";
              return (
                <div key={id} className="bg-black/30 border border-[#1f2937] rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{label}</span>
                    <span className="text-[11px] text-gray-400">{current}</span>
                  </div>
                  <div className={`text-[11px] font-bold ${tone}`}>
                    {diff > 0 ? "↑" : diff < 0 ? "↓" : "•"} {diff === 0 ? "без изменений" : `${diff > 0 ? "+" : ""}${diff}`}
                  </div>
                </div>
              );
            })}
          </div>
        </PixelCard>
      )}

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <h3 className="text-sm font-bold text-white mb-3">Что показывает колесо</h3>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-300">
          {BALANCE_DIMENSIONS.map(({ id, label }) => {
            const val = scores[id] ?? 0;
            const state = scoreState(val);
            return (
              <div
                key={id}
                className="bg-black/30 border border-[#1f2937] rounded-lg p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{label}</span>
                  <span className={`${state.tone} text-[11px] font-bold`}>{state.label}</span>
                </div>
                <div className="text-[11px] text-gray-400">Баллы: {val} / 100</div>
                <p className="text-[11px] text-gray-400">{DIMENSION_COPY[id]?.impact}</p>
              </div>
            );
          })}
        </div>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-center gap-2 mb-3 text-emerald-400">
          <Target size={18} />
          <h3 className="font-bold text-sm uppercase">Фокус на улучшение</h3>
        </div>
        <ul className="space-y-2">
          {recs.map((rec, idx) => (
            <li
              key={idx}
              className="text-xs text-gray-300 flex items-start gap-2 bg-black/30 p-2 rounded"
            >
              <span className="mt-0.5 text-emerald-500">•</span> {rec}
            </li>
          ))}
        </ul>
      </PixelCard>

      {history.length > 1 && (
        <PixelCard className="bg-[#0f1724] border-[#1f2937]">
          <h3 className="text-sm font-bold text-white mb-3">История баланса</h3>
          <div className="space-y-2 text-xs text-gray-300">
            {history.slice(-5).map((entry, idx) => {
              const avg =
                BALANCE_DIMENSIONS.reduce((sum, d) => sum + (entry.scores?.[d.id] || 0), 0) /
                BALANCE_DIMENSIONS.length;
              return (
                <div
                  key={`${entry.date}-${idx}`}
                  className="flex items-center justify-between bg-black/30 border border-[#1f2937] rounded px-3 py-2"
                >
                  <span className="text-white text-[11px]">{entry.date}</span>
                  <span className="text-amber-300 font-bold">{Math.round(avg)} / 100</span>
                </div>
              );
            })}
          </div>
        </PixelCard>
      )}
    </div>
  );
}
