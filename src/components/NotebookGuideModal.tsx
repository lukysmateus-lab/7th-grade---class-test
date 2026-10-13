import React from 'react';
import { BookOpen, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface NotebookGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotebookGuideModal: React.FC<NotebookGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const notebookText = `================================================
7TH GRADE ENGLISH · STORY ELEMENTS NOTEBOOK
LESSON PROJECT & STORY LAB
================================================

1. MY FAVORITE GENRE:
   [ ] Fantasy   [ ] Sci-Fi   [ ] Comedy   [ ] Drama
   My pick: _____________________________________

2. THE 6 ESSENTIAL STORY ELEMENTS:
   • CHARACTERS: The people or animals in the story.
   • SETTING: The time and place where it happens.
   • CONFLICT: A problem the main character must face.
   • MAIN EVENTS: The main actions and events that occur.
   • RESOLUTION: The solution to the central conflict.
   • VIVID LANGUAGE: Rich adjectives & expressions.

3. CASE STUDY: THE SUPER MARIO BROS. MOVIE
   • Characters: Mario, Luigi, Princess Peach, Toad & Bowser
   • Conflict: Defeat Bowser to save the Mushroom Kingdom
   • Setting: The Mushroom Kingdom (Another dimension)

4. THE GOLDEN FORMULA:
   CONFLICT + MAIN EVENTS + RESOLUTION = THE PLOT!

5. PROJECT / HOMEWORK BLUEPRINT:
   • Story Title: _______________________________
   • Protagonist & Antagonist: __________________
   • Setting (Time & Place): ____________________
   • The Central Obstacle (Conflict): ___________
   • The Resolution: ____________________________
   • 3 Vivid English Words (Adjectives):
     1) ____________  2) ____________  3) ____________
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(notebookText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Notebook Guide · Classroom Projection</h2>
              <p className="text-xs text-slate-400">Visual layout for students to mirror in their physical notebooks</p>
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

        {/* Notebook sheet rendering */}
        <div className="my-4 overflow-y-auto flex-1 rounded-xl border border-amber-900/30 bg-amber-50/95 text-slate-900 p-6 font-mono text-xs sm:text-sm leading-relaxed shadow-inner">
          <div className="border-b-2 border-dashed border-amber-300 pb-3 mb-4 flex items-center justify-between">
            <span className="font-bold text-amber-950 tracking-wider">7TH GRADE STORY LAB · LOG SHEET</span>
            <span className="text-xs text-amber-800">CLASSROOM WORKBOOK</span>
          </div>

          <pre className="whitespace-pre-wrap font-mono text-slate-800">
            {notebookText}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Template Text'}
          </button>
          <span className="text-slate-400">Project on TV anytime students need reference!</span>
        </div>
      </div>
    </div>
  );
};
