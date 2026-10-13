import React, { useState } from 'react';
import { Trophy, Plus, RotateCcw, X, Sparkles, Award, Lock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { TeamScore, PointBadge } from '../types/lesson';
import { SCORE_BADGES } from '../data/quizData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamScore[];
  onUpdateScore: (teamId: string, delta: number) => void;
  onResetScores: () => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  teams,
  onUpdateScore,
  onResetScores,
}) => {
  const [activeTab, setActiveTab] = useState<'scores' | 'badges'>('scores');
  const [inspectedBadge, setInspectedBadge] = useState<PointBadge | null>(null);

  if (!isOpen) return null;

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const highestScore = sortedTeams[0]?.points || 0;

  const handleAdd = (id: string, delta: number) => {
    soundManager.playCoin();
    const team = teams.find((t) => t.id === id);
    const prevPoints = team?.points || 0;
    const newPoints = prevPoints + delta;

    // Check if new threshold reached!
    const newlyUnlocked = SCORE_BADGES.find(
      (b) => prevPoints < b.threshold && newPoints >= b.threshold
    );

    onUpdateScore(id, delta);

    if (newlyUnlocked) {
      soundManager.playFanfare();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else if (delta >= 25) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const getUnlockedBadges = (points: number) => {
    return SCORE_BADGES.filter((b) => points >= b.threshold);
  };

  const getNextBadge = (points: number) => {
    return SCORE_BADGES.find((b) => points < b.threshold) || null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Classroom Squad Scoreboard
              </h2>
              <p className="text-xs text-slate-400">
                Live points & visual unlockable reward badges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Scores vs Badges Overlay */}
            <div className="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('scores')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'scores'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scores
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'badges'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Badges Overlay</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: SQUAD SCORES */}
        {activeTab === 'scores' && (
          <div className="my-5 overflow-y-auto flex-1 space-y-4 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => {
                const isLeader = team.points > 0 && team.points === highestScore;
                const unlocked = getUnlockedBadges(team.points);
                const nextBadge = getNextBadge(team.points);

                return (
                  <div
                    key={team.id}
                    className={`relative p-5 rounded-2xl border-2 transition-all ${
                      isLeader
                        ? 'border-amber-400/80 bg-amber-950/20 shadow-lg shadow-amber-950/40'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    {isLeader && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Leader
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${team.color}`} />
                      <span className="font-bold text-slate-100 text-base">{team.name}</span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                        Points
                      </span>
                      <span className="text-3xl font-black font-mono text-white tabular-nums">
                        {team.points}
                      </span>
                    </div>

                    {/* Unlocked Badges Bar */}
                    <div className="mb-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-slate-400">Badges:</span>
                        <div className="flex items-center gap-1">
                          {SCORE_BADGES.map((b) => {
                            const isAchieved = team.points >= b.threshold;
                            return (
                              <span
                                key={b.id}
                                className={`text-sm select-none transition-transform ${
                                  isAchieved ? 'scale-110 filter-none' : 'opacity-25 grayscale'
                                }`}
                                title={`${b.name} (${b.threshold} pts) - ${isAchieved ? 'Unlocked!' : 'Locked'}`}
                              >
                                {b.icon}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {nextBadge ? (
                        <span className="text-[10px] font-mono text-amber-300">
                          {nextBadge.threshold - team.points} pts to {nextBadge.icon}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          All Badges Unlocked!
                        </span>
                      )}
                    </div>

                    {/* Point Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdd(team.id, 10)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-medium text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> 10 pts
                      </button>
                      <button
                        onClick={() => handleAdd(team.id, 25)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> 25 pts
                      </button>
                      <button
                        onClick={() => handleAdd(team.id, 50)}
                        className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-xs font-bold text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                        title="Super Combo"
                      >
                        +50
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL BADGES OVERLAY SYSTEM */}
        {activeTab === 'badges' && (
          <div className="my-5 overflow-y-auto flex-1 space-y-6 pr-1 animate-in fade-in">
            {/* Badges Threshold Legend */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
              <strong className="text-white block mb-1">
                🏆 Point Milestone Rewards System:
              </strong>
              Special rewards unlock automatically on the TV when squads reach points thresholds during quiz rounds, project pitch presentations, and notebook work!
            </div>

            {/* Badges Grid by Squad */}
            <div className="space-y-4">
              {teams.map((team) => {
                const unlocked = getUnlockedBadges(team.points);
                const nextBadge = getNextBadge(team.points);

                return (
                  <div
                    key={team.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${team.color}`} />
                        <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {team.points} pts ({unlocked.length} of {SCORE_BADGES.length} Badges)
                      </span>
                    </div>

                    {/* Progress Bar to Next Badge */}
                    {nextBadge && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Next: {nextBadge.name} ({nextBadge.threshold} pts)</span>
                          <span>{team.points} / {nextBadge.threshold} pts</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.round((team.points / nextBadge.threshold) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 5 Badges Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {SCORE_BADGES.map((badge) => {
                        const isUnlocked = team.points >= badge.threshold;

                        return (
                          <div
                            key={badge.id}
                            onClick={() => setInspectedBadge(badge)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-center relative select-none ${
                              isUnlocked
                                ? `bg-gradient-to-b ${badge.color} text-white shadow-md shadow-amber-950/20`
                                : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60 hover:opacity-80'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{badge.icon}</span>
                            <span className="font-bold text-[11px] block truncate">
                              {badge.name.split(' ')[0]}
                            </span>
                            <span className="font-mono text-[10px] block opacity-80">
                              {badge.threshold} pts
                            </span>

                            {isUnlocked ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 absolute top-1 right-1" />
                            ) : (
                              <Lock className="w-3 h-3 text-slate-500 absolute top-1 right-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BADGE INSPECTION OVERLAY MODAL */}
        {inspectedBadge && (
          <div className="absolute inset-x-6 top-16 bottom-6 z-20 rounded-2xl bg-slate-950/95 border-2 border-amber-400 p-6 flex flex-col justify-between shadow-2xl animate-in zoom-in-95">
            <div className="space-y-4 text-center">
              <span className="text-6xl block animate-bounce">{inspectedBadge.icon}</span>
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest block">
                  Reward Milestone ({inspectedBadge.threshold} Points)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {inspectedBadge.name}
                </h3>
                <p className="text-sm font-semibold text-amber-200 mt-1">
                  "{inspectedBadge.title}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {inspectedBadge.description}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playFanfare();
                  confetti({ particleCount: 50, spread: 80 });
                }}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
              >
                <Sparkles className="w-4 h-4" /> Celebrate Badge
              </button>
              <button
                onClick={() => setInspectedBadge(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Badge View
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0 text-xs text-slate-400">
          <button
            onClick={() => {
              if (window.confirm('Reset all squad scores to 0?')) {
                onResetScores();
              }
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Scoreboard
          </button>
          <span className="text-slate-500">
            Tip: Points unlock badges automatically on TV!
          </span>
        </div>
      </div>
    </div>
  );
};
