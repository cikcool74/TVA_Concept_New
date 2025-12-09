import { Home, CheckSquare } from "lucide-react";
import { PixelCard } from "../components/PixelCard";
import { Button } from "../components/Button";

export function LocationView({ location, tasks, onComplete, onComment, onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <Home size={12} /> Вернуться в деревню
      </button>

      <PixelCard className="border-accent/30">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-lg border border-border ${location.color}`}>
            <CheckSquare size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{location.tvaName}</h2>
            <p className="text-xs text-gray-400">{location.description}</p>
          </div>
        </div>
      </PixelCard>

      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">
          Задачи на сегодня
        </h3>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
              task.completed
                ? "bg-emerald-900/10 border-emerald-900/30 opacity-70"
                : "bg-[#151a25] border-[#2a3441] hover:border-gray-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4
                  className={`font-bold text-sm ${
                    task.completed ? "text-gray-400 line-through" : "text-gray-200"
                  }`}
                >
                  {task.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block text-[10px] font-bold text-yellow-600 bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-900/30">
                    +{task.exp} EXP
                  </span>
                  <span className="inline-block text-[10px] font-bold text-yellow-600 bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-900/30">
                    +{task.exp * 2} 💰
                  </span>
                </div>
              </div>

              <Button
                onClick={() => onComplete(task.id)}
                disabled={task.completed}
                variant={task.completed ? "success" : "secondary"}
                className="w-24 justify-center"
              >
                {task.completed ? "Готово" : "Выполнить"}
              </Button>
            </div>

            {task.completed && (
              <div className="mt-3">
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">
                  Комментарий (что сделал?)
                </label>
                <textarea
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-gray-200 p-2 rounded resize-y focus:border-accent outline-none"
                  rows={2}
                  placeholder="Например: разобрал BTC, зафиксировал ошибку во входе..."
                  value={task.comment || ""}
                  onChange={(e) => onComment(task.id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
