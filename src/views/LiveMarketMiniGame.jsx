import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock, Sparkles, TrendingUp } from "lucide-react";
import { PixelCard } from "../components/PixelCard";

const BUYERS_COUNT = 7;
const SELLERS_COUNT = 7;
const COLLISION_RADIUS = 16;
const COLLISION_TEXT_LIFETIME = 1200;
const DEFAULT_DURATION = 20000;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

function createDot(type, width, height) {
  const speed = randomBetween(0.5, 1.2);
  const angle = randomBetween(0, Math.PI * 2);
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    x: randomBetween(20, width - 20),
    y: randomBetween(20, height - 20),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

export function LiveMarketMiniGame({
  lessonId,
  miniGameId = "MG2_LIVE_MARKET",
  durationMs = DEFAULT_DURATION,
  onComplete,
  onBack,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const dotsRef = useRef([]);
  const lastCollisionRef = useRef({});
  const collisionTextsRef = useRef([]);
  const attractRef = useRef(null);
  const boostTimeoutRef = useRef(null);
  const boostedRef = useRef(false);
  const baseSpeedRef = useRef(1);
  const [deals, setDeals] = useState(0);
  const [remaining, setRemaining] = useState(durationMs);
  const [isCompleted, setIsCompleted] = useState(false);
  const startRef = useRef(Date.now());
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const turnRef = useRef("buy");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const initDots = [
      ...Array.from({ length: BUYERS_COUNT }, () => createDot("buyer", width, height)),
      ...Array.from({ length: SELLERS_COUNT }, () => createDot("seller", width, height)),
    ];
    dotsRef.current = initDots;

    const update = () => {
      const now = Date.now();
      const elapsed = now - startRef.current;
      const remain = Math.max(durationMs - elapsed, 0);
      setRemaining(remain);
      if (remain <= 0) {
        setIsCompleted(true);
        cancelAnimationFrame(animRef.current);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const dots = dotsRef.current;
      dots.forEach((d) => {
        if (attractRef.current) {
          const { x: ax, y: ay } = attractRef.current;
          const dx = ax - d.x;
          const dy = ay - d.y;
          const dist = Math.max(Math.hypot(dx, dy), 1);
          const pull = 0.12;
          d.vx += (dx / dist) * pull;
          d.vy += (dy / dist) * pull;
        }
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 4 || d.x > width - 4) d.vx *= -1;
        if (d.y < 4 || d.y > height - 4) d.vy *= -1;
      });

      // collision detection
      const buyers = dots.filter((d) => d.type === "buyer");
      const sellers = dots.filter((d) => d.type === "seller");
      buyers.forEach((b) => {
        sellers.forEach((s) => {
          const dx = b.x - s.x;
          const dy = b.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < COLLISION_RADIUS) {
            const key = [b.id, s.id].sort().join("-");
            const last = lastCollisionRef.current[key] || 0;
            if (now - last > 300) {
              lastCollisionRef.current[key] = now;
              setDeals((d) => d + 1);
              collisionTextsRef.current.push({ x: (b.x + s.x) / 2, y: (b.y + s.y) / 2, ts: now });
              if (collisionTextsRef.current.length > 12) collisionTextsRef.current.shift();
              if (turnRef.current === "buy") {
                setBuyCount((c) => c + 1);
                turnRef.current = "sell";
              } else {
                setSellCount((c) => c + 1);
                turnRef.current = "buy";
              }
              // simple bounce
              b.vx *= -1;
              b.vy *= -1;
              s.vx *= -1;
              s.vy *= -1;
            }
          }
        });
      });

      // draw dots
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.fillStyle = d.type === "buyer" ? "#22c55e" : "#ef4444";
        ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // collision text pulses
      const nowTs = Date.now();
      collisionTextsRef.current = collisionTextsRef.current.filter((c) => nowTs - c.ts < COLLISION_TEXT_LIFETIME);
      collisionTextsRef.current.forEach((c) => {
        const alpha = 1 - (nowTs - c.ts) / COLLISION_TEXT_LIFETIME;
        ctx.font = "12px sans-serif";
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.fillText("Сделка!", c.x - 20, c.y - 10);
      });

      animRef.current = requestAnimationFrame(update);
    };

    animRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animRef.current);
  }, [durationMs]);

  useEffect(() => {
    if (isCompleted) return;
  }, [isCompleted]);

  const secondsLeft = Math.ceil(remaining / 1000);

  const handleContinue = () => {
    const timeSpentMs = durationMs - Math.max(remaining, 0);
        onComplete?.({
          miniGameId,
          lessonId,
          success: true,
          attempts: 1,
          timeSpentMs,
          score: 100,
          deals,
          buyCount,
          sellCount,
        });
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
              Мини-игра «Живой рынок»
            </div>
            <h2 className="text-xl font-bold text-white">Смотри, как сделки происходят прямо сейчас</h2>
            <p className="text-sm text-gray-300">
              Каждый раз, когда зелёная точка (покупатель) встречает красную (продавец), происходит сделка. Клик по полю создаёт импульс — точки тянутся к клику, чтобы создать импульс.
            </p>
          </div>
          <div className="flex flex-col items-end text-xs text-gray-400 gap-1">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-amber-300" />
              <span>Осталось: <span className="font-bold text-amber-300">{secondsLeft}</span> сек</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-300" />
              <span>Сделок: <span className="font-bold text-emerald-300">{deals}</span></span>
            </div>
          </div>
        </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="w-full overflow-hidden rounded-xl border border-[#1f2937] bg-[#0b1220] flex justify-center">
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="w-full max-w-md aspect-square"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * e.currentTarget.width;
                const y = ((e.clientY - rect.top) / rect.height) * e.currentTarget.height;
                attractRef.current = { x, y };
              }}
              onMouseUp={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * e.currentTarget.width;
                const y = ((e.clientY - rect.top) / rect.height) * e.currentTarget.height;
                attractRef.current = null;
                const dots = dotsRef.current;
                const maxDist = Math.max(
                  ...dots.map((d) => Math.hypot(d.x - x, d.y - y))
                );
                if (!boostedRef.current && maxDist < 80) {
                  boostedRef.current = true;
                  dots.forEach((d) => {
                    d.vx *= 2;
                    d.vy *= 2;
                  });
                  if (boostTimeoutRef.current) clearTimeout(boostTimeoutRef.current);
                  boostTimeoutRef.current = setTimeout(() => {
                    dots.forEach((d) => {
                      d.vx /= 2;
                      d.vy /= 2;
                    });
                    boostedRef.current = false;
                  }, 2000);
                }
              }}
            />
          </div>
          <div className="text-xs text-gray-500">
            Подсказка: рынок — это тысячи таких столкновений каждый день. Покупатели и продавцы встречаются, и цена рождается из этих сделок.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mt-2">
          <div className="border border-[#1f2937] bg-[#0f1724] rounded-lg p-2 flex items-center justify-between">
            <span>Стакан покупок</span>
            <span className="text-emerald-300 font-bold">{buyCount}</span>
          </div>
          <div className="border border-[#1f2937] bg-[#0f1724] rounded-lg p-2 flex items-center justify-between">
            <span>Стакан продаж</span>
            <span className="text-red-300 font-bold">{sellCount}</span>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-200">
            <Sparkles size={16} className="text-emerald-400" />
            <span>За {Math.round(durationMs / 1000)} секунд произошло {deals} сделок.</span>
          </div>
        )}

        <div className="mt-4">
          <button
            disabled={!isCompleted}
            onClick={handleContinue}
            className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 border-b-4 ${
              isCompleted
                ? "bg-amber-500 text-black border-amber-700 hover:bg-amber-400"
                : "bg-gray-700 text-gray-400 border-gray-900 cursor-not-allowed"
            }`}
          >
            Продолжить
          </button>
        </div>
      </PixelCard>
    </div>
  );
}
