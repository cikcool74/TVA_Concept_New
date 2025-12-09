import { useState } from "react";
import { Home, BrainCircuit } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";
import { askOracle, AI_PROVIDER } from "../services/ai";
import { getRandomAdvice } from "../data/quotes";

export function OracleView({ player, stats, profile, onBack }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem("tva_gemini_key") || "");
  const [provider, setProvider] = useState(localStorage.getItem("tva_ai_provider") || AI_PROVIDER.OLLAMA);
  const [ollamaHost, setOllamaHost] = useState(localStorage.getItem("tva_ollama_host") || "http://localhost:11434");
  const [userQuery, setUserQuery] = useState("");
  const [error, setError] = useState("");

  const saveKey = (val) => {
    setApiKey(val);
    localStorage.setItem("tva_gemini_key", val);
  };

  const saveProvider = (val) => {
    setProvider(val);
    localStorage.setItem("tva_ai_provider", val);
  };

  const saveHost = (val) => {
    setOllamaHost(val);
    localStorage.setItem("tva_ollama_host", val);
  };

  const handleAsk = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const prompt = `
Ты - "Великий Оракул Трейдинга" в игре Trading Village Academy. 
Тон: мудрый, немного мистический, но строгий, как у мастера кунг-фу.

Данные игрока:
Имя: ${profile?.name || "Трейдер"}
Уровень: ${player.level}
Опыт: ${player.currentExp}/${player.expToNextLevel}
Золото: ${player.gold}
Стрик: ${player.streakDays || 0}
Последние статистики: ${JSON.stringify(stats.slice(-3))}
Вопрос: "${userQuery || "Проанализируй мой прогресс и дай совет."}"

Задача: коротко (3-4 предложения) дай совет по дисциплине/психологии/режиму, используя метафоры деревни.
`;

      const result = await askOracle({
        provider,
        host: ollamaHost,
        apiKey,
        prompt,
      });
      setResponse(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <BrainCircuit size={24} className="text-pink-500" /> Хижина Оракула
      </h2>

      <PixelCard className="bg-gray-900/80 border-pink-500/30">
        <p className="text-xs text-gray-400 mb-4">
          Оракул видит твой путь через выбранную ИИ-модель. Задай вопрос или попроси наставления.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => saveProvider(AI_PROVIDER.OLLAMA)}
            className={`text-xs font-bold uppercase py-2 rounded border ${
              provider === AI_PROVIDER.OLLAMA
                ? "bg-pink-700 border-pink-400 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300"
            }`}
          >
            Бесплатно (Ollama)
          </button>
          <button
            onClick={() => saveProvider(AI_PROVIDER.GEMINI)}
            className={`text-xs font-bold uppercase py-2 rounded border ${
              provider === AI_PROVIDER.GEMINI
                ? "bg-pink-700 border-pink-400 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300"
            }`}
          >
            Gemini API
          </button>
        </div>

        <p className="text-[10px] text-gray-500 mb-3">
          Ollama — локальная бесплатная модель (например, llama3:8b). Для Telegram нужен доступный внешний хост или прокси.
        </p>

        {provider === AI_PROVIDER.OLLAMA && (
          <div className="mb-4">
            <label className="text-[10px] uppercase text-gray-600 font-bold">Адрес Ollama / прокси</label>
            <input
              type="text"
              value={ollamaHost}
              onChange={(e) => saveHost(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full bg-black border border-gray-700 text-xs text-white p-2 rounded focus:border-pink-500 outline-none"
            />
          </div>
        )}

        {provider === AI_PROVIDER.GEMINI && (
          <div className="mb-4">
            <label className="text-[10px] uppercase text-gray-600 font-bold">Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="Вставь ключ сюда..."
              className="w-full bg-black border border-gray-700 text-xs text-white p-2 rounded focus:border-pink-500 outline-none"
            />
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-400 underline mt-1 block"
            >
              Получить ключ бесплатно
            </a>
          </div>
        )}

        <div className="mb-4">
          <label className="text-[10px] uppercase text-gray-500 font-bold">Твой вопрос</label>
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Например: Я постоянно нарушаю режим сна, что делать?"
            className="w-full bg-gray-800 border border-gray-600 text-xs text-white p-2 rounded h-20 focus:border-pink-500 outline-none"
          />
        </div>

        <Button
          onClick={handleAsk}
          variant="primary"
          disabled={loading || (provider === AI_PROVIDER.GEMINI && !apiKey)}
          className="w-full py-3 bg-pink-700 hover:bg-pink-600 border-pink-900"
        >
          {loading ? "Оракул думает..." : "Получить предсказание"}
        </Button>

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </PixelCard>

      {response && (
        <PixelCard className="border-pink-500 bg-pink-900/10">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getRandomAdvice().emoji}</div>
            <div>
              <h3 className="text-sm font-bold text-pink-400 mb-1">Голос Бездны:</h3>
              <p className="text-sm text-gray-200 leading-relaxed italic">"{response}"</p>
            </div>
          </div>
        </PixelCard>
      )}
    </div>
  );
}
