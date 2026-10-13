import React, { useState } from 'react';
import { Mountain, Sparkles, Flame, PenTool, CheckCircle2, ChevronRight, BookOpen, Volume2 } from 'lucide-react';
import { PLOT_MOUNTAIN_STAGES } from '../data/storyData';
import { TeamScore } from '../types/lesson';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PlotMountainInteractiveProps {
  teams: TeamScore[];
  onAwardTeamPoints: (teamId: string, points: number) => void;
}

export const PlotMountainInteractive: React.FC<PlotMountainInteractiveProps> = ({
  teams,
  onAwardTeamPoints,
}) => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(2); // Climax by default
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const stage = PLOT_MOUNTAIN_STAGES[activeStageIdx];

  const handleSelectStage = (idx: number) => {
    setActiveStageIdx(idx);
    soundManager.playCoin();
    if (idx === 2) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.4 } });
    }
  };

  const toggleQuestion = (num: number) => {
    setRevealedQuestions((prev) => {
      const next = !prev[num];
      if (next) soundManager.playCoin();
      return { ...prev, [num]: next };
    });
  };

  const sharingQuestions = [
    {
      num: 1,
      q: 'What information do you find in the introduction?',
      a: 'We meet the CHARACTERS and discover the SETTING (where and when the world begins)!',
    },
    {
      num: 2,
      q: 'In which part does the plot start?',
      a: 'In the RISING ACTION — when the core problem/conflict appears and adventures begin!',
    },
    {
      num: 3,
      q: 'How do we call the most intense part of a story?',
      a: 'THE CLIMAX! The absolute highest peak of tension, excitement, and decisive action!',
    },
    {
      num: 4,
      q: 'What happened in the falling part in the story from the video?',
      a: 'THE FALLING ACTION — tension cools down, consequences resolve, leading to the Resolution!',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mountain Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Mountain className="w-4 h-4" />
              Part 2 · Story Concepts · Slides 5 & 6
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              The Plot Mountain
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Before exploring our case studies and projects, let’s understand the dramatic curve! Every great book, movie, and video game follows this mountain path.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  soundManager.playCoin();
                  confetti({ particleCount: 20, spread: 50 });
                  onAwardTeamPoints(t.id, 10);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                title={`Award +10 pts to ${t.name}`}
              >
                <div className={`w-2 h-2 rounded-full ${t.color}`} />
                <span>+10 pts {t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Mountain Visual Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PLOT_MOUNTAIN_STAGES.map((st, idx) => {
            const isSelected = activeStageIdx === idx;
            const isClimax = idx === 2;

            return (
              <button
                key={st.id}
                onClick={() => handleSelectStage(idx)}
                className={`p-3.5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                  isSelected
                    ? isClimax
                      ? 'border-amber-400 bg-amber-950/40 text-white shadow-xl scale-102 ring-2 ring-amber-400/50'
                      : 'border-indigo-400 bg-indigo-950/50 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {isClimax && (
                  <div className="absolute top-1 right-2 text-[10px] font-black font-mono text-amber-400 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-rose-500" /> PEAK!
                  </div>
                )}
                <span className="font-mono text-xs font-bold text-indigo-400 block mb-1">
                  STAGE 0{idx + 1}
                </span>
                <span className="font-bold text-sm block text-slate-100">{st.name}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{st.altName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Concept Spotlight */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Stage Explanation · {stage.altName}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
              {stage.name}
            </h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-xs text-slate-300 font-mono">
            {stage.questionPrompt}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              📖 How It Works:
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {stage.description}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              🎬 In Movies & Stories:
            </span>
            <p className="text-sm text-indigo-200 leading-relaxed font-medium">
              {stage.exampleInVideo}
            </p>
          </div>
        </div>

        {/* Notebook Sketch Prompt */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Notebook Activity:</strong> Draw a mountain in your notebook with 5 points: 1) Intro, 2) Rising Action, 3) Climax, 4) Falling Action, 5) Resolution!
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.playFanfare();
              confetti({ particleCount: 30, spread: 60 });
            }}
            className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
          >
            Play Mountain Chime
          </button>
        </div>
      </div>

      {/* Slide 6 "Sharing Time!" Teaching Takeaways */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-xl sm:text-2xl font-black font-display text-white">
              Slide 6 · Sharing Time!
            </h4>
            <p className="text-xs text-slate-400">
              Key understanding checkpoints from the Scratch Garden Plot Mountain video
            </p>
          </div>
          <span className="text-xs text-amber-400 font-mono">Whole-Class Preparation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {sharingQuestions.map((item) => {
            const isRevealed = !!revealedQuestions[item.num];
            return (
              <div
                key={item.num}
                onClick={() => toggleQuestion(item.num)}
                className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    Point 0{item.num}.
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold">
                    {isRevealed ? 'Hide' : 'Show takeaway'}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-100 mb-2">{item.q}</h5>
                {isRevealed ? (
                  <p className="text-xs sm:text-sm text-emerald-300 font-medium leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20 animate-in fade-in">
                    ✅ {item.a}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Tap to show explanation...
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
