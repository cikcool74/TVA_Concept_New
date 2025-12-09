import { Home, Crown, ExternalLink, ShieldCheck, Star, Sparkles } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";
import { LINKS } from "../data/constants";

const premiumFeatures = [
  "+3 ежедневных слота задач — быстрее прокачаешь дисциплину и уровень",
  "Дополнительные локации: Дворец Стратегов, Зал Мастеров Графиков, Дом Эмоциональной Осознанности",
  "Временные бустеры EXP — x1.2 / x1.5 / x2 на ограниченное время",
  "Эксклюзивные артефакты: Корона Дисциплины, Камень Спокойствия, Свиток Прозорливости",
  "VIP Weekly Boss с увеличенными наградами и шансом редкого дропа",
  "Premium-бейдж в профиле и визуальный статус внутри деревни",
];

const subscriptions = [
  {
    id: "basic",
    name: "Basic",
    price: "$4.99 / месяц",
    perks: ["Облако, extended-статистика, история прогресса", "Неограниченная история привычек", "Базовые отчёты трейдера"],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "$8.99 / месяц",
    perks: ["Глубокая аналитика дисциплины и привычек", "Распределение задач по категориям", "Расширенные рекомендации наставников TVA"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$14.99 / месяц",
    perks: ["Всё из Advanced", "VIP Weekly Boss, повышенный шанс дропа артефактов", "Скидки на бустеры и скины", "Золотой бейдж и премиальные эффекты"],
  },
];

export function PremiumView({ hasPremiumPass, subscriptionTier, onActivate, onSetTier, onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <PixelCard className="border-yellow-500/40 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-400/60">
            <Crown size={32} className="text-yellow-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-400">TVA Premium Pass</h2>
            <p className="text-xs text-gray-300">
              Разблокируй дополнительные локации, бустеры EXP, эксклюзивные артефакты и VIP-испытания.
              Premium — ускоритель дисциплины, а не pay-to-win.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold">
              <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-600/40 text-yellow-300 tracking-widest">
                +3 слота задач
              </span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-600/40 text-emerald-300 tracking-widest">
                VIP weekly boss
              </span>
              <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-600/40 text-purple-300 tracking-widest">
                Эксклюзивные артефакты
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="accent" onClick={onActivate} disabled={hasPremiumPass}>
                {hasPremiumPass ? "Premium уже активен" : "Активировать"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => LINKS.premiumPay && window.open(LINKS.premiumPay, "_blank")}
                disabled={!LINKS.premiumPay}
                className="flex items-center gap-1"
              >
                Оплатить <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-center gap-2 mb-3 text-emerald-400 uppercase text-sm font-bold">
          <ShieldCheck size={18} /> Что даёт Premium Pass
        </div>
        <ul className="text-sm text-gray-200 space-y-1">
          {premiumFeatures.map((p) => (
            <li key={p}>• {p}</li>
          ))}
        </ul>
      </PixelCard>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-center gap-2 mb-3 text-blue-300 uppercase text-sm font-bold">
          <Star size={18} /> Подписки TVA (recurring)
        </div>
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const active = subscriptionTier === sub.id;
            return (
              <PixelCard key={sub.id} className={active ? "border-emerald-500/60 bg-emerald-900/10" : "bg-[#0b1220] border-[#1f2937]"}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-white">{sub.name}</div>
                  <div className="text-xs text-emerald-300 font-bold">{sub.price}</div>
                </div>
                <ul className="text-xs text-gray-300 space-y-1 mb-3">
                  {sub.perks.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
                <Button variant="accent" onClick={() => onSetTier(sub.id)} disabled={active}>
                  {active ? `${sub.name} активен` : `Выбрать ${sub.name}`}
                </Button>
              </PixelCard>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
}
