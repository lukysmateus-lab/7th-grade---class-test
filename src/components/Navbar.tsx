import React from 'react';
import { Maximize, Minimize } from 'lucide-react';

export type AppMode = 'mountain' | 'cases' | 'project' | 'quiz';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-lg font-black tracking-tight text-white font-display whitespace-nowrap">
          Story Elements <span className="text-amber-400 font-semibold text-sm">· Parts 1 & 2</span>
        </span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectMode('mountain')}
          className={`whitespace-nowrap transition-colors text-xs font-semibold py-1 ${
            currentMode === 'mountain'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'hover:text-slate-200'
          }`}
        >
          1. Plot Mountain
        </button>
        <button
          onClick={() => onSelectMode('cases')}
          className={`whitespace-nowrap transition-colors text-xs font-semibold py-1 ${
            currentMode === 'cases'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'hover:text-slate-200'
          }`}
        >
          2. Story Case Studies
        </button>
        <button
          onClick={() => onSelectMode('project')}
          className={`whitespace-nowrap transition-colors text-xs font-semibold py-1 ${
            currentMode === 'project'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'hover:text-slate-200'
          }`}
        >
          3. Poster Project Studio
        </button>
        <button
          onClick={() => onSelectMode('quiz')}
          className={`whitespace-nowrap transition-colors text-xs font-semibold py-1 ${
            currentMode === 'quiz'
              ? 'text-rose-400 border-b-2 border-rose-400'
              : 'hover:text-slate-200'
          }`}
        >
          4. TV Quiz Arena
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleFullscreen}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap flex items-center gap-2"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit TV Mode' : 'Classroom TV Mode'}</span>
        </button>
      </div>
    </header>
  );
};
