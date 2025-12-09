import { useEffect, useRef, useState } from "react";
import { Home, Map as MapIcon, Lock, CheckCircle } from "lucide-react";
import { MAP_NODES } from "../data/mapNodes";

const statusStyles = {
  locked: "bg-gray-800/70 border-gray-700 text-gray-500",
  available: "bg-[#0f1724] border-[#1f2937] text-white hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]",
  done: "bg-emerald-900/20 border-emerald-600/60 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
};

export function MapView({ progress, onSelect, onBack }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [connections, setConnections] = useState([]);

  const completed = progress?.completed || [];
  const isUnlocked = (node) => {
    if (node.forcedLocked) return false;
    return (node.prerequisites || []).every((req) => completed.includes(req)) || node.prerequisites.length === 0;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const points = MAP_NODES.reduce((acc, node) => {
      const el = nodeRefs.current[node.id];
      if (!el) return acc;
      const rect = el.getBoundingClientRect();
      acc[node.id] = {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
      return acc;
    }, {});

    const nextConnections = [];
    MAP_NODES.forEach((node) => {
      (node.prerequisites || []).forEach((req) => {
        if (!points[node.id] || !points[req]) return;
        nextConnections.push({
          from: points[req],
          to: points[node.id],
          unlocked: isUnlocked(node),
        });
      });
    });
    setConnections(nextConnections);
  }, [progress, completed]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        >
          <Home size={12} /> Назад в деревню
        </button>
        <div className="text-[11px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <MapIcon size={14} className="text-amber-300" /> Village Map
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#1f2937] bg-[#0b0f1a]" ref={containerRef}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative px-4 pb-10 pt-6">
          <div className="text-center text-sm font-bold text-amber-300 mb-2">Trading Путешествие</div>
          <div className="text-center text-xs text-gray-400 mb-6">И вот тут начинается твой путь..</div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
            {connections.map((conn, idx) => (
              <line
                key={idx}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={conn.unlocked ? "rgba(251,191,36,0.5)" : "rgba(148,163,184,0.3)"}
                strokeWidth="3"
                strokeDasharray="8 6"
              />
            ))}
          </svg>

          <div
            className="relative z-10 grid gap-6 max-w-5xl mx-auto pb-6"
            style={{
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gridAutoRows: "minmax(120px, auto)",
            }}
          >
            {MAP_NODES.map((node) => {
              const unlocked = isUnlocked(node);
              const done = completed.includes(node.id);
              const status = done ? "done" : unlocked ? "available" : "locked";
              const extraStyle = node.forcedLocked ? "border-red-600 text-red-200 bg-red-900/20" : "";
              return (
                <button
                  key={node.id}
                  onClick={() => unlocked && onSelect(node)}
                  disabled={!unlocked}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition place-self-center ${statusStyles[status]} ${extraStyle}`}
                  style={{
                    gridColumn: node.col || "auto",
                    gridRow: node.row || "auto",
                    minWidth: "190px",
                    maxWidth: "220px",
                  }}
                  ref={(el) => {
                    if (el) nodeRefs.current[node.id] = el;
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{node.icon}</span>
                    {done ? <CheckCircle size={16} className="text-emerald-300" /> : unlocked ? null : <Lock size={14} />}
                  </div>
                  <div className="text-sm font-bold">{node.title}</div>
                  <div className="text-[11px] text-gray-400 leading-tight mt-1">{node.description}</div>
                  <div className="text-[10px] text-amber-300 mt-1 font-bold uppercase">Level {node.level}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
