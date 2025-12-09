import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle, PlayCircle, RefreshCcw, Lightbulb, Shield, Trophy } from "lucide-react";
import { PixelCard } from "../components/PixelCard";

const LESSON_REWARD = { exp: 50, gold: 100 };
const BLOCK_REWARD = { exp: 150, gold: 300 };
const STAGES = [
  { id: 1, title: "Чтение основ", pct: 20 },
  { id: 2, title: "Миссия «Что же это такое?»", pct: 40 },
  { id: 3, title: "Мини-игра «Собери рынок»", pct: 60 },
  { id: 4, title: "Мини-игра «Живой рынок»", pct: 80 },
  { id: 5, title: "Тест + закрепление", pct: 100 },
];

export function LessonView({
  lesson,
  completed,
  stageProgress = {},
  stageFocus,
  onStageFocusHandled,
  onComplete,
  onStageComplete,
  onStartMiniGame,
  onStartQuiz,
  onStartStageDialog,
  onBack,
}) {
  if (!lesson) return null;

  const isDone = completed.includes(lesson.id);
  const subLessons = lesson.lessons || [];
  const [selectedSub, setSelectedSub] = useState(subLessons[0]?.id || null);
  const stageListRef = useRef(null);
  const stageButtonRefs = useRef({});

  const subDone = subLessons.filter((l) => completed.includes(l.id)).length;
  const progressPct = subLessons.length ? Math.round((subDone / subLessons.length) * 100) : isDone ? 100 : 0;

  const currentSub = subLessons.find((s) => s.id === selectedSub);
  const currentIndex = subLessons.findIndex((s) => s.id === selectedSub);
  const prevDone = currentIndex <= 0 ? true : completed.includes(subLessons[currentIndex - 1].id);
  const currentSubDone = currentSub ? completed.includes(currentSub.id) : false;
  const currentStage = currentSub ? stageProgress[currentSub.id] || stageProgress[lesson.id] || 0 : 0;

  const handleSubComplete = (id) => {
    if (!currentSub) return;
    if (!prevDone && !currentSubDone) return;
    onComplete(id, { stay: true, isBlock: false });
    setSelectedSub(id);
  };

  const handleStageClick = (stageId) => {
    if (!currentSub) return;
    if (stageId === 1 || stageId === 2) {
      onStartStageDialog(currentSub, stageId);
    } else if (stageId === 3) {
      onStartMiniGame?.(currentSub, "MG1_COLLECT_MARKET");
    } else if (stageId === 4) {
      onStartMiniGame?.(currentSub, "MG2_LIVE_MARKET");
    } else if (stageId === 5) {
      onStartQuiz?.(currentSub);
    } else {
      onStageComplete(currentSub.id, stageId);
    }
  };

  useEffect(() => {
    if (!stageFocus?.lessonId) return;
    if (stageFocus.lessonId !== selectedSub && subLessons.some((s) => s.id === stageFocus.lessonId)) {
      setSelectedSub(stageFocus.lessonId);
    }
  }, [stageFocus, selectedSub, subLessons]);

  useEffect(() => {
    if (!stageFocus || !currentSub || stageFocus.lessonId !== currentSub.id) return;
    const nextStageId = stageFocus.nextStage || currentStage + 1;
    if (stageListRef.current) {
      stageListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const btn = stageButtonRefs.current[nextStageId];
    if (btn && typeof btn.focus === "function") {
      btn.focus({ preventScroll: true });
    }
    onStageFocusHandled?.();
  }, [stageFocus, currentSub, currentStage, onStageFocusHandled]);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
      >
        <ArrowLeft size={12} /> Назад к карте
      </button>

      <PixelCard className="bg-[#0f1724] border-[#1f2937]">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{lesson.icon}</div>
          <div className="flex-1">
            <div className="text-xs text-amber-300 font-bold uppercase tracking-widest">Level {lesson.level}</div>
            <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
            <p className="text-sm text-gray-300 mt-2">{lesson.description}</p>
          </div>
          {isDone && <CheckCircle className="text-emerald-400" />}
        </div>

        {subLessons.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
              <span>Прогресс блока</span>
              <span className="font-bold text-amber-300">{progressPct}%</span>
            </div>
            <div className="h-2 bg-[#111827] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-300" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
              {subLessons.map((sub, idx) => {
                const done = completed.includes(sub.id);
                const selected = selectedSub === sub.id;
                const prevDoneLocal = idx === 0 ? true : completed.includes(subLessons[idx - 1].id);
                const locked = !prevDoneLocal && !done;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      selected
                        ? "border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                        : done
                        ? "bg-emerald-900/20 border-emerald-600/50 text-emerald-100"
                        : "bg-[#111827] border-[#1f2937] hover:border-amber-400 text-gray-200"
                    } ${locked ? "opacity-60" : ""}`}
                  >
                    <div className="text-[11px] text-gray-400 flex items-center justify-between">
                      <span>Блок {idx + 1}</span>
                      {done && <CheckCircle size={14} className="text-emerald-300" />}
                    </div>
                    <div className="text-sm font-bold">{sub.title}</div>
                    {locked && <div className="text-[10px] text-gray-500 mt-1">Сначала пройди предыдущий блок</div>}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 bg-black/30 border border-[#1f2937] rounded-lg p-3 text-sm text-gray-200">
              <div className="font-bold text-white mb-1">{currentSub?.title || "Выбери блок"}</div>
              <p className="text-xs text-gray-400">
                {currentSub?.description || "Выбери блок, чтобы увидеть детали и начать прохождение."}
              </p>
              <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                <div className="flex items-center gap-2 bg-[#0f1724] border border-[#1f2937] rounded px-2 py-1">
                  <Trophy size={14} className="text-amber-300" /> +{LESSON_REWARD.exp} EXP
                </div>
                <div className="flex items-center gap-2 bg-[#0f1724] border border-[#1f2937] rounded px-2 py-1">
                  <Shield size={14} className="text-emerald-300" /> +{LESSON_REWARD.gold} золота
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  className={`px-3 py-2 rounded bg-amber-500 text-black font-bold border-b-4 border-amber-700 active:translate-y-0.5 ${
                    (!prevDone && !currentSubDone) ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={!prevDone && !currentSubDone}
                  onClick={() => {
                    if (!currentSub) return;
                    if (currentStage < 1) {
                      onStartStageDialog(currentSub, 1);
                    } else {
                      handleSubComplete(currentSub.id);
                    }
                  }}
                >
                  Пройти блок
                </button>
                <button
                  className={`px-3 py-2 rounded border-b-4 text-white font-bold active:translate-y-0.5 flex items-center gap-1 ${
                    currentSubDone
                      ? "bg-emerald-600 border-emerald-800"
                      : "bg-gray-700 border-gray-800 opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!currentSubDone}
                  onClick={() => currentSub && handleSubComplete(currentSub.id)}
                >
                  <RefreshCcw size={14} /> Перепройти блок
                </button>
                <button
                  className={`px-3 py-2 rounded border-b-4 text-white font-bold active:translate-y-0.5 flex items-center gap-1 ${
                    currentSubDone
                      ? "bg-blue-600 border-blue-800"
                      : "bg-gray-700 border-gray-800 opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!currentSubDone}
                >
                  <Lightbulb size={14} /> Подсказки
                </button>
              </div>
            </div>

            <div className="mt-4 bg-[#0f1724] border border-[#1f2937] rounded-lg p-3 text-xs text-gray-200">
              <div className="text-amber-300 font-bold uppercase tracking-widest mb-2">Этапы блока</div>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
                ref={stageListRef}
              >
                {STAGES.map((stage) => {
                  const done = stage.id <= currentStage;
                  const available = stage.id === currentStage + 1 || done;
                  return (
                    <button
                      key={stage.id}
                      disabled={!available}
                      onClick={() => handleStageClick(stage.id)}
                      ref={(el) => {
                        if (el) stageButtonRefs.current[stage.id] = el;
                      }}
                      className={`rounded-lg border px-3 py-2 text-left transition ${
                        done
                          ? "bg-emerald-900/20 border-emerald-600/50 text-emerald-100"
                          : available
                          ? "bg-[#111827] border-[#1f2937] hover:border-amber-400 text-gray-200"
                          : "bg-[#0b0f1a] border-[#111827] text-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{stage.title}</span>
                        <span className="text-amber-300 font-bold">{stage.pct}%</span>
                      </div>
                      {!done && !available && <div className="text-[10px] text-gray-500 mt-1">Доступно после предыдущего этапа</div>}
                      {done && <div className="text-[10px] text-emerald-400 mt-1">Завершено</div>}
                    </button>
                  );
                })}
              </div>
              {currentStage >= 5 && (
                <div className="mt-3 text-[11px] text-emerald-300 font-bold flex items-center gap-2">
                  <Shield size={14} /> Блок «Рынок» пройден
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3 mt-6 text-xs text-gray-300">
          <div className="bg-black/30 border border-[#1f2937] rounded-lg p-3">
            <div className="text-amber-300 font-bold mb-1">Что изучаем</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Основы трейдинга</li>
              <li>Структура рынка</li>
              <li>Понятный план прохождения</li>
            </ul>
          </div>
          <div className="bg-black/30 border border-[#1f2937] rounded-lg p-3">
            <div className="text-amber-300 font-bold mb-1">Награды</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>+XP за завершение этапов</li>
              <li>Больше золота за повторение</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded bg-amber-500 text-black font-bold text-sm flex items-center gap-2 border-b-4 border-amber-700 active:translate-y-0.5"
            onClick={() => onComplete(lesson.id, { isBlock: true, rewardExp: BLOCK_REWARD.exp, rewardGold: BLOCK_REWARD.gold })}
          >
            <PlayCircle size={16} /> {isDone ? "Перепройти блок целиком" : "Пройти блок целиком"}
          </button>
          {!isDone && (
            <button
              className="px-4 py-2 rounded bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 border-b-4 border-emerald-800 active:translate-y-0.5"
              onClick={() => onComplete(lesson.id, { isBlock: true, rewardExp: BLOCK_REWARD.exp, rewardGold: BLOCK_REWARD.gold })}
            >
              <CheckCircle size={16} /> Завершить блок
            </button>
          )}
        </div>
      </PixelCard>
    </div>
  );
}
