import { GoogleGenerativeAI } from "@google/generative-ai";

export const AI_PROVIDER = {
  OLLAMA: "ollama",
  GEMINI: "gemini",
};

export async function askOracle({
  provider,
  host,
  apiKey,
  prompt,
  model = "llama3:8b",
}) {
  if (provider === AI_PROVIDER.OLLAMA) {
    if (!host) {
      throw new Error("Не указан адрес Ollama сервера");
    }
    const endpoint = `${host.replace(/\/$/, "")}/api/generate`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama ответил: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const text = (data.response || data.message || "").trim();
    if (!text) {
      throw new Error("Пустой ответ от модели");
    }
    return text;
  }

  if (!apiKey) {
    throw new Error("Не указан API ключ Gemini");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelClient = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await modelClient.generateContent(prompt);
  return result.response.text();
}
