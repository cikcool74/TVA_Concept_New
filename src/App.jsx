import { useEffect, useState } from "react";
import { LOCATIONS } from "./data/locations";
import { useGameState } from "./hooks/useGameState";
import { SetupView } from "./views/SetupView";
import { VillageView } from "./views/VillageView";
import { LocationView } from "./views/LocationView";
import { ShopView } from "./views/ShopView";
import { InventoryView } from "./views/InventoryView";
import { TalentTreeView } from "./views/TalentTreeView";
import { StatsView } from "./views/StatsView";
import { OracleView } from "./views/OracleView";
import { HeaderBar } from "./components/HeaderBar";
import { WeeklyChallengeView } from "./views/WeeklyChallengeView";
import { PremiumView } from "./views/PremiumView";
import { TelegramHubView } from "./views/TelegramHubView";
import { ProfileSettingsView } from "./views/ProfileSettingsView";
import { BalanceResultsView, BalanceTestView } from "./views/BalanceTestView";
import { RoadmapView } from "./views/RoadmapView";
import { MapView } from "./views/MapView";
import { LessonView } from "./views/LessonView";
import { StageDialogView } from "./views/StageDialogView";
import { CollectMarketMiniGame } from "./views/CollectMarketMiniGame";
import { LiveMarketMiniGame } from "./views/LiveMarketMiniGame";
import { LessonQuizView } from "./views/LessonQuizView";

import "./index.css";

const layoutClass = "max-w-5xl mx-auto px-4 py-6 space-y-4";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`p-3 rounded-lg border-b-4 shadow-xl cursor-pointer ${
          toast.type === "success"
            ? "bg-emerald-600 border-emerald-800 text-white"
            : "bg-red-600 border-red-800 text-white"
        }`}
        onClick={onClose}
      >
        <p className="text-sm font-bold">{toast.text}</p>
      </div>
    </div>
  );
};

const LevelUpModal = ({ info, onClose }) => {
  if (!info) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a202c] border-4 border-yellow-500 rounded-lg p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
        <h2 className="text-3xl font-bold text-white mb-2 font-mono">НОВЫЙ УРОВЕНЬ!</h2>
        <p className="text-yellow-500 font-bold text-xl mb-6">УРОВЕНЬ {info.level}</p>
        <button
          onClick={onClose}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase py-2 rounded transition-colors"
        >
          Продолжить путь
        </button>
      </div>
    </div>
  );
};

const WeeklyModal = ({ challenge, onClose, onClaim }) => {
  if (!challenge) return null;
  const progress = Math.min(
    100,
    (challenge.currentProgress / challenge.requiredCompletions) * 100
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`bg-[#1a202c] border-4 ${
          challenge.isClaimed ? "border-emerald-500" : "border-red-500"
        } rounded-lg p-6 max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]`}
      >
        <h2 className="text-2xl font-bold text-white mb-2 font-mono">
          {challenge.isCompleted ? "ИСПЫТАНИЕ ЗАВЕРШЕНО!" : "ЕЖЕНЕДЕЛЬНЫЙ БОСС"}
        </h2>
        <p className="text-lg font-bold mb-4">{challenge.title}</p>
        <div className="bg-gray-800 p-4 rounded mb-6 text-sm text-left">
          <p className="font-bold text-gray-300 mb-2">
            Прогресс: {challenge.currentProgress} / {challenge.requiredCompletions}
          </p>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Награда:</p>
          <p className="font-bold text-emerald-400 flex items-center gap-4">
            <span>+{challenge.expReward} EXP</span>
            <span>{challenge.goldReward} золота</span>
          </p>
        </div>
        {challenge.isCompleted && !challenge.isClaimed ? (
          <button
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase py-2 rounded transition-colors"
            onClick={onClaim}
          >
            Получить награду
          </button>
        ) : (
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs uppercase py-2 rounded transition-colors"
            onClick={onClose}
          >
            ОК
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  const {
    profile,
    profileCompleted,
    player,
    tasks,
    stats,
    upgrades,
    artifacts,
    equippedArtifacts,
    totalEquipSlots,
    weeklyChallenge,
    saveProfile,
    completeTask,
    updateTaskComment,
    toggleEquipArtifact,
    unlockTalent,
    upgradeBuilding,
    randomQuote,
    claimWeeklyChallenge,
    activatePremium,
    updateProfileWithCost,
    setSubscriptionTier,
    renameProfile,
    renameCost,
    toast,
    clearToast,
    levelUpInfo,
    clearLevelUp,
    mapProgress,
    completeLesson,
    completeLessonStage,
  } = useGameState();

  const [view, setView] = useState("village");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [activeStage, setActiveStage] = useState(null);
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [stageFocus, setStageFocus] = useState(null);

  const selectedLocation = LOCATIONS.find((l) => l.id === selectedLocationId);
  const locationTasks = tasks.filter((t) => t.locationId === selectedLocationId);

  useEffect(() => {
    if (weeklyChallenge && weeklyChallenge.isCompleted && !weeklyChallenge.isClaimed) {
      setShowWeeklyModal(true);
    }
  }, [weeklyChallenge]);

  if (!profileCompleted) {
    return (
      <main className={layoutClass}>
        <SetupView onComplete={saveProfile} />
      </main>
    );
  }

  return (
    <main className={layoutClass}>
      <HeaderBar
        player={player}
        onHome={() => setView("village")}
        onMap={() => {
          setSelectedLesson(null);
          setView("map");
        }}
      />

      {view === "village" && !profile.balanceScores && (
        <div className="border-yellow-500/40 bg-yellow-900/10 border rounded-xl p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-yellow-400">Пройди тест «Колесо Баланса»</p>
              <p className="text-xs text-gray-300">5 минут, чтобы понять слабые сферы и усилить прогресс.</p>
            </div>
            <button
              className="text-xs font-bold uppercase px-3 py-2 rounded bg-yellow-500 text-black hover:bg-yellow-400"
              onClick={() => setView("balance_test")}
            >
              Пройти
            </button>
          </div>
        </div>
      )}

      {view === "village" && (
        <VillageView
          profile={profile}
          player={player}
          tasks={tasks}
          onSelectLocation={(id) => {
            setSelectedLocationId(id);
            setView("location");
          }}
          quote={randomQuote}
          renameCost={renameCost}
          goProfileSettings={() => setView("profile_settings")}
          goShop={() => setView("shop")}
          goPremium={() => setView("premium")}
          goTalents={() => setView("talents")}
          goInventory={() => setView("inventory")}
          goTelegram={() => setView("telegram")}
          goRoadmap={() => setView("roadmap")}
          goOracle={() => setView("oracle")}
          goBalance={() => setView(profile.balanceScores ? "balance_results" : "balance_test")}
          goStats={() => setView("stats")}
          goBoss={() => setView("weekly")}
        />
      )}

      {view === "location" && selectedLocation && (
        <LocationView
          location={selectedLocation}
          tasks={locationTasks}
          onComplete={completeTask}
          onComment={updateTaskComment}
          onBack={() => setView("village")}
        />
      )}

      {view === "shop" && (
        <ShopView
          upgrades={upgrades}
          playerGold={player.gold}
          onUpgrade={upgradeBuilding}
          onBack={() => setView("village")}
        />
      )}

      {view === "inventory" && (
        <InventoryView
          artifacts={artifacts}
          equippedIds={player.equippedArtifactIds}
          maxSlots={totalEquipSlots}
          onToggle={toggleEquipArtifact}
          onBack={() => setView("village")}
        />
      )}

      {view === "map" && (
        <MapView
          progress={mapProgress}
          onSelect={(lesson) => {
            setSelectedLesson(lesson);
            setView("lesson");
          }}
          onBack={() => setView("village")}
        />
      )}

      {view === "lesson" && (
        <LessonView
          lesson={selectedLesson}
          completed={mapProgress?.completed || []}
          stageProgress={mapProgress?.stages || {}}
          stageFocus={stageFocus}
          onStageFocusHandled={() => setStageFocus(null)}
          onComplete={(id, opts = {}) => {
            completeLesson(id, { isBlock: opts.isBlock, rewardExp: opts.rewardExp, rewardGold: opts.rewardGold });
            if (!opts.stay) setView("map");
          }}
          onStageComplete={(id, stage) => completeLessonStage(id, stage)}
          onStartMiniGame={(subLesson, miniGameId) => {
            setActiveMiniGame({ lesson: selectedLesson, subLesson, miniGameId });
            setView(miniGameId === "MG2_LIVE_MARKET" ? "live_market" : "collect_market");
          }}
          onStartQuiz={(subLesson) => {
            setActiveQuiz({ lesson: selectedLesson, subLesson });
            setView("lesson_quiz");
          }}
          onStartStageDialog={(subLesson, stageId = 1) => {
            setActiveStage({ lesson: selectedLesson, subLesson, stageId });
            setView("stage_dialog");
          }}
          onBack={() => setView("map")}
        />
      )}

      {view === "collect_market" && activeMiniGame && (
        <CollectMarketMiniGame
          lessonId={activeMiniGame.lesson?.id}
          miniGameId={activeMiniGame.miniGameId}
          onComplete={(result) => {
            const targetLessonId = activeMiniGame.subLesson?.id || activeMiniGame.lesson?.id;
            completeLessonStage(targetLessonId, 3);
            setStageFocus({ lessonId: targetLessonId, nextStage: 4 });
            setActiveMiniGame(null);
            setView("lesson");
          }}
          onBack={() => {
            setActiveMiniGame(null);
            setView("lesson");
          }}
        />
      )}

      {view === "live_market" && activeMiniGame && (
        <LiveMarketMiniGame
          lessonId={activeMiniGame.lesson?.id}
          miniGameId={activeMiniGame.miniGameId}
          onComplete={(result) => {
            const targetLessonId = activeMiniGame.subLesson?.id || activeMiniGame.lesson?.id;
            completeLessonStage(targetLessonId, 4);
            setStageFocus({ lessonId: targetLessonId, nextStage: 5 });
            setActiveMiniGame(null);
            setView("lesson");
          }}
          onBack={() => {
            setActiveMiniGame(null);
            setView("lesson");
          }}
        />
      )}

      {view === "lesson_quiz" && activeQuiz && (
        <LessonQuizView
          lessonId={activeQuiz.lesson?.id}
          onComplete={() => {
            const targetLessonId = activeQuiz.subLesson?.id || activeQuiz.lesson?.id;
            completeLessonStage(targetLessonId, 5);
            setStageFocus({ lessonId: targetLessonId, nextStage: 6 });
            setActiveQuiz(null);
            setView("lesson");
          }}
          onBack={() => {
            setActiveQuiz(null);
            setView("lesson");
          }}
        />
      )}

      {view === "stage_dialog" && activeStage && (
        <StageDialogView
          lesson={activeStage.lesson}
          subLesson={activeStage.subLesson}
          stageId={activeStage.stageId}
          onFinish={() => {
            const targetLessonId = activeStage.subLesson?.id || activeStage.lesson.id;
            completeLessonStage(targetLessonId, activeStage.stageId);
            setStageFocus({ lessonId: targetLessonId, nextStage: Math.min(5, activeStage.stageId + 1) });
            setActiveStage(null);
            setView("lesson");
          }}
          onBack={() => {
            setActiveStage(null);
            setView("lesson");
          }}
        />
      )}

      {view === "talents" && (
        <TalentTreeView
          unlockedTalents={player.unlockedTalents}
          gold={player.gold}
          onUnlock={unlockTalent}
          onBack={() => setView("village")}
        />
      )}

      {view === "stats" && (
        <StatsView
          stats={stats}
          profile={profile}
          player={player}
          onBack={() => setView("village")}
          onTalents={() => setView("talents")}
          onOracle={() => setView("oracle")}
          onShop={() => setView("shop")}
        />
      )}

      {view === "roadmap" && (
        <RoadmapView onBack={() => setView("village")} />
      )}

      {view === "oracle" && (
        <OracleView
          player={player}
          stats={stats}
          profile={profile}
          onBack={() => setView("village")}
        />
      )}

      {view === "weekly" && (
        <WeeklyChallengeView
          challenge={weeklyChallenge}
          onBack={() => setView("village")}
          onClaim={() => {
            const result = claimWeeklyChallenge();
            if (result.ok) setView("village");
          }}
        />
      )}

      {view === "premium" && (
        <PremiumView
          hasPremiumPass={player.hasPremiumPass}
          subscriptionTier={player.subscriptionTier}
          onActivate={activatePremium}
          onSetTier={setSubscriptionTier}
          onBack={() => setView("village")}
        />
      )}

      {view === "telegram" && (
        <TelegramHubView onBack={() => setView("village")} />
      )}

      {view === "balance_test" && (
        <BalanceTestView
          onComplete={(scores) => {
            const today = new Date().toISOString().slice(0, 10);
            const history = Array.isArray(profile.balanceHistory) ? profile.balanceHistory : [];
            const nextHistory = [...history, { date: today, scores }];
            saveProfile({
              ...profile,
              balanceScores: scores,
              balanceTestCompleted: true,
              balanceTestDate: today,
              balanceHistory: nextHistory.slice(-20),
            });
            setView("balance_results");
          }}
          onBack={() => setView("village")}
        />
      )}

      {view === "balance_results" && (
        <BalanceResultsView
          profile={profile}
          onBack={() => setView("village")}
          onRetake={() => setView("balance_test")}
          history={profile.balanceHistory || []}
        />
      )}

      {view === "profile_settings" && (
        <ProfileSettingsView
          profile={profile}
          player={player}
          renameCost={renameCost}
          onSave={(changes) => {
            const res = updateProfileWithCost(changes);
            if (res?.ok) setView("village");
          }}
          onBack={() => setView("village")}
        />
      )}

      <LevelUpModal info={levelUpInfo} onClose={clearLevelUp} />
      <WeeklyModal
        challenge={showWeeklyModal ? weeklyChallenge : null}
        onClose={() => setShowWeeklyModal(false)}
        onClaim={() => {
          const res = claimWeeklyChallenge();
          if (res.ok) setShowWeeklyModal(false);
        }}
      />
      <Toast toast={toast} onClose={clearToast} />
    </main>
  );
}

export default App;

