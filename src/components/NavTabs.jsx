import { Home, ShoppingBag, Gem, Star, BarChart2, BrainCircuit, Calendar, Crown, MessageCircle, Target } from "lucide-react";

const tabs = [
  { id: "village", label: "Деревня", icon: Home },
  { id: "shop", label: "Лавка", icon: ShoppingBag },
  { id: "inventory", label: "Артефакты", icon: Gem },
  { id: "talents", label: "Таланты", icon: Star },
  { id: "stats", label: "Статистика", icon: BarChart2 },
  { id: "oracle", label: "Оракул", icon: BrainCircuit },
  { id: "weekly", label: "Босс недели", icon: Calendar },
  { id: "premium", label: "Премиум", icon: Crown },
  { id: "balance_results", label: "Баланс", icon: Target },
  { id: "telegram", label: "TG", icon: MessageCircle },
];

export function NavTabs({ current, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase transition ${
              isActive
                ? "bg-accent text-black border-yellow-500"
                : "bg-black/40 text-gray-300 border-border hover:border-gray-500"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
