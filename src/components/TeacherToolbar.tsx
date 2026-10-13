import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Trophy, Shuffle, BookOpen, 
  Volume2, VolumeX, HelpCircle, ChevronUp, ChevronDown 
} from 'lucide-react';
import { AppMode } from './Navbar';
import { soundManager } from '../utils/audio';

interface TeacherToolbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenScoreboard: () => void;
  onOpenSpinner: () => void;
  onOpenNotebookGuide: () => void;
  totalTeamPoints: number;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenScoreboard,
  onOpenSpinner,
  onOpenNotebookGuide,
  totalTeamPoints,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(40 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTeacherNotes, setShowTeacherNotes] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      soundManager.playFanfare();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.round(((40 * 60 - secondsLeft) / (40 * 60)) * 100));

  return (
    <div className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
      {/* Teacher Guide Drawer */}
      {showTeacherNotes && (
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-xs sm:text-sm text-slate-200 animate-in slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-amber-400 font-mono uppercase tracking-wider text-xs block">
                Classroom Dynamic Pacing Guide (40 min)
              </span>
              <p className="text-slate-300 leading-relaxed max-w-3xl">
                🌟 <strong>Part 1 to Part 2 Arc:</strong> 1) Quick recall of the 6 Elements & Plot Mountain (7 min) → 2) Story Case Studies with Harry Potter, Wimpy Kid, Brave & Mario (8 min) → 3) Project Time: Squad of 4 Poster Studio with One Piece (20 min) → 4) TV Quiz Celebration (5-10 min)!
              </p>
              <p className="text-emerald-400 font-medium">
                📓 <strong>Notebooks:</strong> Students write the 5 elements in their notebooks while collaborating on their team posters.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-xs font-mono text-slate-400 block">
                Total Lesson Goal: 40 min
              </span>
              <span className="text-xs text-amber-300 font-medium">
                Simple, Joyful & Participatory!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: 40-min Master Class Timer */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Class Clock (40 min)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-black text-amber-400 tabular-nums">
                {formatTimer(secondsLeft)}
              </span>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-1.5 rounded-lg text-white text-xs font-bold transition-all ${
                  isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setSecondsLeft(40 * 60);
                  setIsRunning(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden sm:block w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Center: 4 Agile Stage Modes */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => onSelectMode('mountain')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              currentMode === 'mountain'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⛰️ Mountain
          </button>
          <button
            onClick={() => onSelectMode('cases')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              currentMode === 'cases'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Case Studies
          </button>
          <button
            onClick={() => onSelectMode('project')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              currentMode === 'project'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 Poster Project
          </button>
          <button
            onClick={() => onSelectMode('quiz')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              currentMode === 'quiz'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎮 Quiz Arena
          </button>
        </div>

        {/* Right: Gamification & Tool Triggers */}
        <div className="flex items-center gap-2">
          {/* Scoreboard */}
          <button
            onClick={onOpenScoreboard}
            className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Scores ({totalTeamPoints} pts)</span>
          </button>

          {/* Spinner */}
          <button
            onClick={onOpenSpinner}
            className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Random student or squad spinner"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Spinner</span>
          </button>

          {/* Notebook Guide */}
          <button
            onClick={onOpenNotebookGuide}
            className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Notebook Layout Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Notebook</span>
          </button>

          {/* Sound */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Guide Drawer Toggle */}
          <button
            onClick={() => setShowTeacherNotes(!showTeacherNotes)}
            className={`py-1.5 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              showTeacherNotes
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide</span>
            {showTeacherNotes ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
