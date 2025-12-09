import { Home } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { LINKS } from "../data/constants";

export function TelegramHubView({ onBack }) {
  const links = [
    {
      title: "TVA Bot - 7 дней аналитики",
      color: "border-blue-500/40 bg-blue-900/10",
      points: ["Бесплатно 7 дней", "Сигналы Crypto/FX", "Авто-статистика и уровни"],
      href: LINKS.tgBot,
    },
    {
      title: "TVAcademy - основной канал",
      color: "border-indigo-500/40 bg-indigo-900/10",
      points: ["Новости и обновления", "Анонсы событий", "Сообщество трейдеров"],
      href: LINKS.tgChannel,
    },
    {
      title: "Поддержка TVA",
      color: "border-emerald-500/40 bg-emerald-900/10",
      points: ["Ответим на вопросы", "Помощь с подпиской", "Работаем 10:00-22:00 МСК"],
      href: LINKS.tgSupport,
    },
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white">Telegram Центр TVA</h2>

      <div className="space-y-3">
        {links.map((link) => (
          <PixelCard key={link.title} className={link.color}>
            <h3 className="font-bold text-sm text-white mb-2">{link.title}</h3>
            <ul className="text-xs text-gray-300 space-y-1 mb-3">
              {link.points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
            <button
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded border border-white/20 transition"
              onClick={() => window.open(link.href, "_blank")}
            >
              Открыть
            </button>
          </PixelCard>
        ))}
      </div>
    </div>
  );
}
