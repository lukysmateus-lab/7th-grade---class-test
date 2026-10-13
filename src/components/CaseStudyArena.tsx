import React, { useState } from 'react';
import { SLIDE_STORIES } from '../data/storyData';
import { TeamScore } from '../types/lesson';
import { BookOpen, Sparkles, Eye, EyeOff, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CaseStudyArenaProps {
  teams: TeamScore[];
  onAwardTeamPoints: (teamId: string, points: number) => void;
}

interface CaseStudyTeamQuestion {
  squadIndex: number;
  storyTitle: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

const SQUAD_CASE_QUESTIONS: CaseStudyTeamQuestion[] = [
  {
    squadIndex: 0, // Squad 1
    storyTitle: 'Harry Potter (Slide 7)',
    question: 'In "Harry Potter and the Philosopher’s Stone", what enchanted medieval castle serves as the main SETTING?',
    options: [
      'Hogwarts Castle',
      'The Batcave',
      'Willy Wonka’s Chocolate Factory',
      'Neverland Lagoon',
    ],
    correctAnswer: 'Hogwarts Castle',
    explanation: 'Slide 7: Most of the story takes place in Hogwarts, an enchanted medieval castle in the late 1990s!',
    points: 25,
  },
  {
    squadIndex: 1, // Squad 2
    storyTitle: 'Diary of a Wimpy Kid (Slide 8)',
    question: 'In "Diary of a Wimpy Kid", who is the protagonist and what is his central CONFLICT?',
    options: [
      'Greg Heffley; surviving middle school among meaner older teenagers',
      'Peter Pan; fighting flying dragons in space',
      'Mario; rescuing Princess Peach from a volcano',
      'Luffy; opening a bakery in Paris',
    ],
    correctAnswer: 'Greg Heffley; surviving middle school among meaner older teenagers',
    explanation: 'Slide 8: Greg Heffley starts middle school and records the hazards of growing up in his diary!',
    points: 25,
  },
  {
    squadIndex: 2, // Squad 3
    storyTitle: 'Brave (Slide 11)',
    question: 'In Disney’s "Brave", what is the SETTING and the core clash between Merida and her mother?',
    options: [
      'Medieval Scotland; Merida’s independence vs her mom’s values of duty',
      'Modern New York; choosing which pizza topping to order',
      'Ancient Egypt; building a pyramid for the pharaoh',
      'Outer Space; navigating an alien asteroid field',
    ],
    correctAnswer: 'Medieval Scotland; Merida’s independence vs her mom’s values of duty',
    explanation: 'Slide 11: Medieval Scotland! Merida wants to follow her heart while her mother fears it destabilizes the family.',
    points: 25,
  },
  {
    squadIndex: 3, // Squad 4
    storyTitle: 'Mario Bros. & One Piece (Slides 10 & 15)',
    question: 'In Nintendo’s classic Mario Bros, what represents the RESOLUTION of each level?',
    options: [
      'When enemies are defeated, players advance to the next phase (= the happy ending)',
      'The console turns off automatically',
      'Mario gives up and returns to plumbing school',
      'The pipes disappear forever',
    ],
    correctAnswer: 'When enemies are defeated, players advance to the next phase (= the happy ending)',
    explanation: 'Slide 10: "When enemies are killed, players go to the next phase (= the happy ending)"!',
    points: 25,
  },
];

export const CaseStudyArena: React.FC<CaseStudyArenaProps> = ({
  teams,
  onAwardTeamPoints,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('one-piece');
  const [revealedElements, setRevealedElements] = useState<Record<string, boolean>>({});

  // 4 Squad Case Questions State
  const [activeSquadQIdx, setActiveSquadQIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const story = SLIDE_STORIES.find((s) => s.id === selectedStoryId) || SLIDE_STORIES[0];
  const squadQ = SQUAD_CASE_QUESTIONS[activeSquadQIdx];
  const targetTeam = teams[squadQ.squadIndex] || teams[0];

  const handleSelectStory = (id: string) => {
    setSelectedStoryId(id);
    setRevealedElements({});
    soundManager.playCoin();
  };

  const toggleElement = (elemKey: string) => {
    setRevealedElements((prev) => {
      const next = !prev[elemKey];
      if (next) soundManager.playCoin();
      return { ...prev, [elemKey]: next };
    });
  };

  const revealAllForStory = () => {
    setRevealedElements({
      characters: true,
      setting: true,
      conflict: true,
      mainEvents: true,
      resolution: true,
    });
    soundManager.playSuccess();
  };

  const handleChooseAnswer = (qIdx: number, opt: string) => {
    if (revealedAnswers[qIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: opt }));
    soundManager.playCoin();
  };

  const handleRevealSquadAnswer = (qIdx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [qIdx]: true }));
    const isCorrect = selectedAnswers[qIdx] === SQUAD_CASE_QUESTIONS[qIdx].correctAnswer;
    if (isCorrect) {
      soundManager.playSuccess();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleAwardPoints = (squadIdx: number, pts: number) => {
    const t = teams[squadIdx];
    if (t) {
      soundManager.playCoin();
      confetti({ particleCount: 35, spread: 60 });
      onAwardTeamPoints(t.id, pts);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Tab 2 · Story Case Studies & 4 Squad Questions
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              Pay Attention to the Stories!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Analyze real story elements from the slides. Below, each of the <strong className="text-amber-400">4 Squads</strong> has a dedicated question on the stories!
            </p>
          </div>

          <button
            onClick={revealAllForStory}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Reveal All Cards
          </button>
        </div>

        {/* Story Selector Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SLIDE_STORIES.map((item) => {
            const isSelected = selectedStoryId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectStory(item.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 text-white shadow-lg scale-102'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-2xl block mb-1">{item.coverEmoji}</span>
                <span className="font-bold text-xs text-slate-100 block truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {item.mediaType.toUpperCase()} · {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DEDICATED QUESTIONS FOR THE 4 SQUADS */}
      <div className="rounded-3xl border-2 border-amber-500/40 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              Classroom Case Study Duel
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
              Case Study Questions for the 4 Squads
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            1 Question Assigned to each Squad (Earn +25 pts on correct answer!)
          </span>
        </div>

        {/* 4 Squad Question Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SQUAD_CASE_QUESTIONS.map((q, idx) => {
            const team = teams[q.squadIndex];
            const isCurrent = activeSquadQIdx === idx;
            const isAnswered = revealedAnswers[idx];

            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveSquadQIdx(idx);
                  soundManager.playCoin();
                }}
                className={`p-3 rounded-2xl border-2 transition-all text-left ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-950/30 text-white shadow-md'
                    : isAnswered
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${team.color}`} />
                  <span className="font-bold text-xs truncate">{team.name}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 block truncate">
                  {q.storyTitle}
                </span>
                {isAnswered && (
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                    ✓ Completed
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Squad Question Box */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className={`w-3.5 h-3.5 rounded-full ${targetTeam.color}`} />
              <span className="font-black text-sm text-white">
                Assigned to: <strong className="text-amber-400">{targetTeam.name}</strong>
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
              {squadQ.storyTitle} · +{squadQ.points} Points
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {squadQ.question}
          </h4>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {squadQ.options.map((opt) => {
              const isSelected = selectedAnswers[activeSquadQIdx] === opt;
              const isRevealed = revealedAnswers[activeSquadQIdx];
              const isCorrect = isRevealed && opt === squadQ.correctAnswer;
              const isWrong = isRevealed && isSelected && opt !== squadQ.correctAnswer;

              return (
                <button
                  key={opt}
                  onClick={() => handleChooseAnswer(activeSquadQIdx, opt)}
                  disabled={isRevealed}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all text-xs sm:text-sm font-semibold flex items-center justify-between ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md'
                      : isWrong
                      ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                      : isSelected
                      ? 'border-amber-400 bg-amber-950/30 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealedAnswers[activeSquadQIdx] && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 space-y-1 animate-in fade-in">
              <strong className="text-white block">Explanation:</strong>
              <p>{squadQ.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {!revealedAnswers[activeSquadQIdx] ? (
              <button
                onClick={() => handleRevealSquadAnswer(activeSquadQIdx)}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
              >
                Reveal Answer
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAwardPoints(squadQ.squadIndex, squadQ.points)}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Award +{squadQ.points} pts to {targetTeam.name}!
                </button>
                <button
                  onClick={() => {
                    const next = (activeSquadQIdx + 1) % SQUAD_CASE_QUESTIONS.length;
                    setActiveSquadQIdx(next);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Next Squad</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Story Spotlight Cards */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-semibold">
              <span>{story.mediaType.toUpperCase()}</span>
              <span>·</span>
              <span>By {story.creator} ({story.year})</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
              {story.title}
            </h3>
            {story.tagline && (
              <p className="text-xs sm:text-sm text-slate-400 italic mt-0.5">
                "{story.tagline}"
              </p>
            )}
          </div>
        </div>

        {/* 5 Element Cards with interactive reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CHARACTERS */}
          <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-amber-400 uppercase">
                  1. CHARACTERS
                </span>
                <button
                  onClick={() => toggleElement('characters')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {revealedElements.characters ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealedElements.characters ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Who are the characters?</h4>
              {revealedElements.characters ? (
                <p className="text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
                  {story.characters}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">Tap Reveal to show on TV...</p>
              )}
            </div>
          </div>

          {/* SETTING */}
          <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-sky-400 uppercase">
                  2. SETTING
                </span>
                <button
                  onClick={() => toggleElement('setting')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {revealedElements.setting ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealedElements.setting ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">What is the setting?</h4>
              {revealedElements.setting ? (
                <p className="text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
                  {story.setting}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">Tap Reveal to show on TV...</p>
              )}
            </div>
          </div>

          {/* CONFLICT */}
          <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-rose-400 uppercase">
                  3. CONFLICT
                </span>
                <button
                  onClick={() => toggleElement('conflict')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {revealedElements.conflict ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealedElements.conflict ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">What is the conflict?</h4>
              {revealedElements.conflict ? (
                <p className="text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
                  {story.conflict}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">Tap Reveal to show on TV...</p>
              )}
            </div>
          </div>

          {/* MAIN EVENTS */}
          <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3 md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                  4. MAIN EVENTS
                </span>
                <button
                  onClick={() => toggleElement('mainEvents')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {revealedElements.mainEvents ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealedElements.mainEvents ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">What are the main events?</h4>
              {revealedElements.mainEvents ? (
                <p className="text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
                  {story.mainEvents}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">Tap Reveal to show on TV...</p>
              )}
            </div>
          </div>

          {/* RESOLUTION */}
          <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-teal-400 uppercase">
                  5. RESOLUTION
                </span>
                <button
                  onClick={() => toggleElement('resolution')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {revealedElements.resolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealedElements.resolution ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">What is the resolution?</h4>
              {revealedElements.resolution ? (
                <p className="text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
                  {story.resolution}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">Tap Reveal to show on TV...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
