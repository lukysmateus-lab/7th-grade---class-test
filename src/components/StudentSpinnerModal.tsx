import React, { useState } from 'react';
import { Shuffle, X, Users, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StudentSpinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { role: 'Conflict Detective', desc: 'Identify the main obstacle the protagonist faces' },
  { role: 'Setting Cartographer', desc: 'Describe the time and place of the story' },
  { role: 'Character Scout', desc: 'Spot the hero, sidekick, and antagonist' },
  { role: 'Resolution Master', desc: 'Explain how the problem is finally solved' },
  { role: 'Vivid Language Guru', desc: 'Provide 2 rich English adjectives to power up the scene' },
  { role: 'Plot Architect', desc: 'Connect the Conflict + Main Events + Resolution' },
];

export const StudentSpinnerModal: React.FC<StudentSpinnerModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'row' | 'number' | 'role'>('row');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultSub, setResultSub] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    setSpinning(true);
    setResult(null);
    setResultSub(null);
    soundManager.playDrumroll();

    setTimeout(() => {
      setSpinning(false);
      soundManager.playSuccess();

      if (mode === 'row') {
        const rows = ['Squad 1 (Window Row)', 'Squad 2 (Center-Left Row)', 'Squad 3 (Center-Right Row)', 'Squad 4 (Door Row)'];
        const chosen = rows[Math.floor(Math.random() * rows.length)];
        setResult(chosen);
        setResultSub('Your squad is called up to answer or volunteer!');
      } else if (mode === 'number') {
        const num = Math.floor(Math.random() * 32) + 1;
        setResult(`Student #${num} on the Roster!`);
        setResultSub('Share your notebook answer with the classroom!');
      } else {
        const chosenRole = ROLES[Math.floor(Math.random() * ROLES.length)];
        setResult(chosenRole.role);
        setResultSub(chosenRole.desc);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Classroom Volunteer Spinner</h2>
              <p className="text-xs text-slate-400">Picks who answers next on the TV screen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded-xl my-5 border border-slate-700">
          <button
            onClick={() => { setMode('row'); setResult(null); }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              mode === 'row' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            By Squad / Row
          </button>
          <button
            onClick={() => { setMode('number'); setResult(null); }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              mode === 'number' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Roster #
          </button>
          <button
            onClick={() => { setMode('role'); setResult(null); }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              mode === 'role' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Special Role
          </button>
        </div>

        {/* Display area */}
        <div className="h-44 flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center">
          {spinning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-purple-300 animate-pulse">Spinning on the TV screen...</p>
            </div>
          ) : result ? (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Selected!
              </div>
              <h3 className="text-2xl font-black font-display text-white">{result}</h3>
              {resultSub && <p className="text-sm text-slate-300 max-w-sm mx-auto">{resultSub}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">Click below to randomly select a student or squad!</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            disabled={spinning}
            onClick={handleSpin}
            className="flex-1 py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-sm font-bold text-white transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Shuffle className="w-4 h-4" />
            {spinning ? 'Selecting...' : 'Spin Now on TV!'}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
