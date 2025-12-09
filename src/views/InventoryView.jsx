import { Home, Gem } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";

export function InventoryView({ artifacts, equippedIds, maxSlots, onToggle, onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Gem size={18} className="text-blue-400" />
        Артефакты
      </h2>
      <p className="text-xs text-gray-500">Доступно слотов: {equippedIds.length}/{maxSlots}</p>

      <PixelCard>
        <div className="grid md:grid-cols-2 gap-3">
          {artifacts.map((artifact) => {
            const equipped = equippedIds.includes(artifact.id);
            return (
              <div
                key={artifact.id}
                className={`p-3 rounded-lg border ${
                  equipped ? "border-emerald-500 bg-emerald-900/10" : "border-border bg-black/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{artifact.visual}</span>
                      {artifact.name}
                    </p>
                    <p className="text-xs text-gray-400">{artifact.description}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Цена: {artifact.cost} 💰</p>
                  </div>
                  <Button onClick={() => onToggle(artifact.id)} variant={equipped ? "success" : "secondary"}>
                    {equipped ? "Снять" : "Надеть"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
}
