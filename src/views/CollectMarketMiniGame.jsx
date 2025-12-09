import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, RotateCw, Sparkles } from "lucide-react";
import { PixelCard } from "../components/PixelCard";

const ELEMENTS = [
  { id: "buyer", label: "Покупатель", icon: "🟢", hint: "Кто хочет купить" },
  { id: "price", label: "Цена", icon: "💰", hint: "За сколько готовы купить" },
  { id: "asset", label: "Актив", icon: "🍎/₿", hint: "Что покупают: яблоко или BTC" },
  { id: "seller", label: "Продавец", icon: "🟠", hint: "Кто продаёт" },
];

const CORRECT_ORDER = ["buyer", "price", "asset", "seller"];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export function CollectMarketMiniGame({ lessonId, miniGameId, onComplete, onBack }) {
  const [available, setAvailable] = useState(() => shuffle(ELEMENTS.map((e) => e.id)));
  const [slots, setSlots] = useState([null, null, null, null]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [slotStates, setSlotStates] = useState(["idle", "idle", "idle", "idle"]); // idle | wrong | correct
  const startTime = useRef(Date.now());
  const endTime = useRef(null);

  const canCheck = useMemo(() => slots.every((s) => s !== null), [slots]);

  const handleDrop = (elementId, slotIndex) => {
    setSlots((prevSlots) => {
      const prevSlot = prevSlots[slotIndex];
      const nextSlots = prevSlots.map((val, idx) =>
        idx !== slotIndex && val === elementId ? null : val
      );
      nextSlots[slotIndex] = elementId;

      setAvailable((avail) => {
        const withoutDragged = avail.filter((id) => id !== elementId);
        const next = prevSlot ? [...withoutDragged, prevSlot] : withoutDragged;
        return Array.from(new Set(next));
      });

      setSlotStates(["idle", "idle", "idle", "idle"]);
      return nextSlots;
    });
    setFeedback("");
  };

  const handleReturn = (slotIndex) => {
    setSlots((prev) => {
      const prevSlot = prev[slotIndex];
      if (!prevSlot) return prev;
      setAvailable((avail) => Array.from(new Set([...avail, prevSlot])));
      const next = [...prev];
      next[slotIndex] = null;
      setSlotStates(["idle", "idle", "idle", "idle"]);
      return next;
    });
  };

  const onDragStart = (e, elementId) => {
    e.dataTransfer.setData("text/plain", elementId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropSlot = (e, idx) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    handleDrop(id, idx);
  };

  const checkOrder = () => {
    if (!canCheck || isCompleted) return;
    const nextAttempts = attempts + 1;
    const correctness = slots.map((v, i) => v === CORRECT_ORDER[i]);
    const isCorrect = correctness.every(Boolean);
    setAttempts(nextAttempts);
    setSlotStates(correctness.map((ok) => (ok ? "correct" : "wrong")));
    if (isCorrect) {
      setIsSuccess(true);
      setIsCompleted(true);
      endTime.current = Date.now();
      setFeedback("Это и есть рынок! Покупатель, цена, актив и продавец встретились.");
      const timeSpentMs = endTime.current - startTime.current;
      const score = Math.max(100 - (nextAttempts - 1) * 20, 40);
      onComplete?.({
        miniGameId: miniGameId || "MG1_COLLECT_MARKET",
        lessonId,
        success: true,
        attempts: nextAttempts,
        timeSpentMs,
        score,
      });
    } else {
      setFeedback(
        "Подумай: сначала кто хочет купить, потом за сколько, потом что, и только потом — кто продаёт."
      );
    }
  };

  const resetBoard = () => {
    setAvailable(shuffle(ELEMENTS.map((e) => e.id)));
    setSlots([null, null, null, null]);
    setFeedback("");
    setSlotStates(["idle", "idle", "idle", "idle"]);
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
        <ArrowLeft size={12} /> Назад к уроку
      </button>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-amber-300 font-bold">
              Мини-игра «Собери рынок»
            </div>
            <h2 className="text-xl font-bold text-white">Перетащи элементы в нужном порядке</h2>
            <p className="text-sm text-gray-300">
              Чтобы получилась сделка, выстрой связку: Покупатель → Цена → Актив → Продавец.
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <div>Попытки: <span className="font-bold text-amber-300">{attempts}</span></div>
          </div>
        </div>

        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-xs text-gray-400 uppercase tracking-widest">Карточки</div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {available.map((id) => {
                const el = ELEMENTS.find((e) => e.id === id);
                if (!el) return null;
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={(e) => onDragStart(e, id)}
                    className="border border-[#1f2937] bg-[#111827] rounded-lg p-3 cursor-move hover:border-amber-400 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{el.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{el.label}</div>
                        <div className="text-[11px] text-gray-500">{el.hint}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-gray-400 uppercase tracking-widest">Слоты (порядок)</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {slots.map((slot, idx) => {
                const el = ELEMENTS.find((e) => e.id === slot);
                const state = slotStates[idx];
                const border =
                  state === "correct"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : state === "wrong"
                    ? "border-red-500 bg-red-500/10"
                    : el
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-[#1f2937] bg-[#0b1220]";
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDropSlot(e, idx)}
                    className={`min-h-[88px] rounded-lg border-2 px-2 py-2 flex flex-col items-center justify-center text-center transition ${border}`}
                  >
                    <div className="text-[10px] uppercase text-gray-500 mb-1">Слот {idx + 1}</div>
                    {el ? (
                      <button
                        onClick={() => handleReturn(idx)}
                        className="flex flex-col items-center gap-1 text-white"
                      >
                        <span className="text-xl">{el.icon}</span>
                        <span className="text-sm font-bold">{el.label}</span>
                        <span className="text-[10px] text-gray-400">Нажми, чтобы вернуть</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Перетащи карточку</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 text-sm px-3 py-2 rounded border ${
              isSuccess ? "border-emerald-500 text-emerald-200 bg-emerald-500/10" : "border-amber-500 text-amber-100 bg-amber-500/10"
            }`}
          >
            {feedback}
          </div>
        )}

        {isSuccess && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-200">
            <Sparkles size={16} className="text-emerald-400" />
            <span>Ты получил награду и продвинулся по уроку!</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded bg-amber-500 text-black font-bold text-sm flex items-center gap-2 border-b-4 border-amber-700 active:translate-y-0.5 disabled:opacity-50"
            disabled={!canCheck || isCompleted}
            onClick={checkOrder}
          >
            <Check size={16} /> Проверить
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-700 text-white font-bold text-sm flex items-center gap-2 border-b-4 border-gray-900 active:translate-y-0.5"
            onClick={resetBoard}
          >
            <RotateCw size={16} /> Перемешать
          </button>
        </div>
      </PixelCard>
    </div>
  );
}
