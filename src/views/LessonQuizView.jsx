import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, HelpCircle, Lightbulb } from "lucide-react";
import { PixelCard } from "../components/PixelCard";

const QUESTIONS = [
  {
    id: "q1",
    question: "Что такое рынок?",
    options: ["Здание, куда приходят трейдеры", "Место, где люди обмениваются ценностями", "Программа на телефоне"],
    correct: 1,
  },
  {
    id: "q2",
    question: "Что нужно, чтобы рынок существовал?",
    options: ["Мэр города", "Один покупатель и один продавец", "Магический кристалл"],
    correct: 1,
  },
  {
    id: "q3",
    question: "Где происходит современный рынок?",
    options: ["На площади", "На стадионе", "В интернете, через компьютеры и телефоны"],
    correct: 2,
  },
];

const ITEMS = [
  { id: "apple", label: "Яблоко" },
  { id: "gold", label: "Золото" },
  { id: "btc", label: "Биткоин" },
  { id: "bread", label: "Хлеб" },
];

const PAIRS = [
  { id: "bp", label: "Покупатель + продавец", correct: true },
  { id: "pp", label: "Продавец + продавец", correct: false },
  { id: "bb", label: "Покупатель + покупатель", correct: false },
];

export function LessonQuizView({ lessonId, onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedItems, setSelectedItems] = useState(() => new Set(ITEMS.map((i) => i.id)));
  const [pairChoice, setPairChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const allChoiceAnswered = useMemo(
    () => QUESTIONS.every((q) => typeof answers[q.id] === "number"),
    [answers]
  );

  const pairCorrect = pairChoice === "bp";
  const multipleChoiceScore = useMemo(
    () => QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0),
    [answers]
  );

  const itemsExplanation = "На рынке можно обменивать любые ценности: продукты, металлы, цифровые активы.";

  const handleSubmit = () => {
    setSubmitted(true);
    if (!allChoiceAnswered || !pairChoice) return;
    onComplete?.({
      lessonId,
    });
  };

  const toggleItem = (id) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
        <ArrowLeft size={12} /> Назад к уроку
      </button>

      <PixelCard className="bg-[#0f1724] border-[#1f2937] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300 font-bold">Тест + закрепление</div>
            <h2 className="text-xl font-bold text-white">Проверь, что ты понял про рынок</h2>
            <p className="text-sm text-gray-300">
              Ответь на вопросы, объясни своими словами и выбери правильные связки. Это закрепит базу.
            </p>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <HelpCircle size={14} className="text-amber-300" /> Всего вопросов: 3
          </div>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q, idx) => {
            const selected = answers[q.id];
            const showFeedback = submitted;
            const isCorrect = selected === q.correct;
            return (
              <div key={q.id} className="border border-[#1f2937] rounded-lg p-3 bg-[#0b1220]">
                <div className="text-sm font-bold text-white mb-2">
                  Вопрос {idx + 1}. {q.question}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {q.options.map((opt, optIdx) => {
                    const active = selected === optIdx;
                    const color =
                      showFeedback && active
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                          : "border-red-500 bg-red-500/10 text-red-100"
                        : active
                        ? "border-amber-400 bg-amber-500/10 text-white"
                        : "border-[#1f2937] bg-[#111827] text-gray-200 hover:border-amber-400";
                    return (
                      <button
                        key={opt}
                        className={`text-left text-sm rounded-lg px-3 py-2 border transition ${color}`}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showFeedback && (
                  <div className="text-[11px] text-gray-400 mt-1">
                    Правильный ответ: {q.options[q.correct]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border border-[#1f2937] rounded-lg p-3 bg-[#0b1220] space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-300" />
            <div className="text-sm font-bold text-white">Упражнение 1 — Объясни своими словами</div>
          </div>
          <p className="text-xs text-gray-400">Как ты понимаешь слово «рынок»? Напиши коротко.</p>
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="w-full bg-[#0f1724] border border-[#1f2937] rounded-lg p-2 text-sm text-white"
            rows={3}
            placeholder="Например: место, где люди обмениваются ценностями..."
          />
        </div>

        <div className="border border-[#1f2937] rounded-lg p-3 bg-[#0b1220] space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-300" />
            <div className="text-sm font-bold text-white">Упражнение 2 — Построй свой рынок</div>
          </div>
          <p className="text-xs text-gray-400">{itemsExplanation}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ITEMS.map((item) => {
              const active = selectedItems.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${
                    active
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                      : "border-[#1f2937] bg-[#111827] text-gray-200 hover:border-amber-400"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-[#1f2937] rounded-lg p-3 bg-[#0b1220] space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-300" />
            <div className="text-sm font-bold text-white">Упражнение 3 — Найди ошибку</div>
          </div>
          <p className="text-xs text-gray-400">Выбери вариант, где возможна сделка.</p>
          <div className="grid md:grid-cols-3 gap-2">
            {PAIRS.map((p) => {
              const active = pairChoice === p.id;
              const showFeedback = submitted && pairChoice === p.id;
              const color =
                showFeedback && p.correct
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                  : showFeedback && !p.correct
                  ? "border-red-500 bg-red-500/10 text-red-100"
                  : active
                  ? "border-amber-400 bg-amber-500/10 text-white"
                  : "border-[#1f2937] bg-[#111827] text-gray-200 hover:border-amber-400";
              return (
                <button
                  key={p.id}
                  onClick={() => setPairChoice(p.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${color}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-amber-500 text-black font-bold text-sm border-b-4 border-amber-700 active:translate-y-0.5"
          >
            Завершить тест
          </button>
          {submitted && allChoiceAnswered && pairChoice && (
            <div className="text-xs text-emerald-300">
              Молодец! Ответов верно: {multipleChoiceScore} / {QUESTIONS.length}. Сделка возможна только когда есть покупатель и продавец.
            </div>
          )}
          {submitted && (!allChoiceAnswered || !pairChoice) && (
            <div className="text-xs text-red-300">
              Ответь на все вопросы и выбери вариант в упражнении 3.
            </div>
          )}
        </div>
      </PixelCard>
    </div>
  );
}
