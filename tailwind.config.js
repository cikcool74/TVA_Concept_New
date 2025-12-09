/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b0f1a",
        card: "#111827",
        border: "#2a3441",
        accent: "#eab308",
        neon: "#db2777",
      },
      fontFamily: {
        mono: ["'Courier Prime'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(234, 179, 8, 0.2)",
      },
    },
  },
  plugins: [],
};
