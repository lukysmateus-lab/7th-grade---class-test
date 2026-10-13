import React, { useState, useEffect } from 'react';
import { 
  Palette, Users, Timer, Play, Pause, RotateCcw, 
  Sparkles, Award, CheckCircle2, PenTool, Image as ImageIcon, Mic 
} from 'lucide-react';
import { TeamScore } from '../types/lesson';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ProjectStudioProps {
  teams: TeamScore[];
  onAwardTeamPoints: (teamId: string, points: number, badgeName?: string) => void;
}

interface SquadPosterData {
  title: string;
  mediaType: string;
  year: string;
  creator: string;
  tagline: string;
  characters: string;
  setting: string;
  conflict: string;
  mainEvents: string;
  resolution: string;
  themeStyle: 'pirate' | 'magic' | 'cyber';
}

const DEFAULT_POSTERS: Record<string, SquadPosterData> = {
  'team-1': {
    title: 'One Piece',
    mediaType: 'Anime / Manga',
    year: '1997',
    creator: 'Eiichiro Oda',
    tagline: 'Different dreams. One crew. A new adventure begins!',
    characters: 'Luffy, Zoro, Nami, Usopp, Sanji, Chopper, Robin, Franky, Brook & Jinbe',
    setting: 'A vast ocean full of islands, the Grand Line, and mysterious seas',
    conflict: 'Luffy sets sail to become the Pirate King against the World Government and rival pirates',
    mainEvents: 'Gathering the crew, sailing the Grand Line, unlocking island secrets, epic battles',
    resolution: 'The crew journeys onward, growing closer with the dream of the One Piece ahead',
    themeStyle: 'pirate',
  },
  'team-2': {
    title: 'Harry Potter',
    mediaType: 'Book / Film',
    year: '1997',
    creator: 'J. K. Rowling',
    tagline: 'The boy who lived enters the enchanted halls of Hogwarts.',
    characters: 'Harry, Ron, Hermione, Dumbledore, Quirrell & Voldemort',
    setting: 'Hogwarts, an enchanted medieval castle in Scotland',
    conflict: 'Voldemort seeks the Philosopher’s Stone to regain deadly power',
    mainEvents: 'Sorting into Gryffindor, learning spells, passing the three-headed dog, chess match',
    resolution: 'Harry protects the Stone through courage, preventing Voldemort’s return',
    themeStyle: 'magic',
  },
  'team-3': {
    title: 'Diary of a Wimpy Kid',
    mediaType: 'Book / Comedy',
    year: '2007',
    creator: 'Jeff Kinney',
    tagline: 'Middle school survival through hilarious words and drawings.',
    characters: 'Greg Heffley, Rowley Jefferson, Rodrick, Manny & parents',
    setting: 'Suburban Middle School and neighborhood streets',
    conflict: 'Greg tries to survive the chaos of middle school and become popular',
    mainEvents: 'School play audition, Halloween teenagers chase, wrestling unit, the Cheese Touch',
    resolution: 'Greg takes the blame for the Cheese Touch to save his best friend Rowley',
    themeStyle: 'cyber',
  },
  'team-4': {
    title: 'Brave',
    mediaType: 'Movie / Animation',
    year: '2012',
    creator: 'Pixar / Disney',
    tagline: 'Change your fate through courage and family.',
    characters: 'Merida, Queen Elinor, King Fergus, The Witch & triplet brothers',
    setting: 'Medieval Scottish Highlands with ancient stone circles and clan castles',
    conflict: 'Merida wants independence while her mother demands traditional duty',
    mainEvents: 'Archery challenge, spell transforms mom into a bear, racing against sunrise',
    resolution: 'Merida repairs the family bond and tapestry, breaking the curse',
    themeStyle: 'magic',
  },
};

export const ProjectStudio: React.FC<ProjectStudioProps> = ({
  teams,
  onAwardTeamPoints,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'team-1');
  const [posters, setPosters] = useState<Record<string, SquadPosterData>>(DEFAULT_POSTERS);

  // 25-minute class project timer
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Presentation 60s lightning pitch timer
  const [pitchTimer, setPitchTimer] = useState<number>(60);
  const [isPitchRunning, setIsPitchRunning] = useState<boolean>(false);

  // Active view: 'editor' or 'poster-showcase'
  const [viewTab, setViewTab] = useState<'poster-showcase' | 'editor'>('poster-showcase');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundManager.playFanfare();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPitchRunning && pitchTimer > 0) {
      interval = setInterval(() => {
        setPitchTimer((p) => {
          if (p <= 5 && p > 1) soundManager.playTick();
          else if (p === 1) soundManager.playFanfare();
          return p - 1;
        });
      }, 1000);
    } else if (pitchTimer === 0 && isPitchRunning) {
      setIsPitchRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPitchRunning, pitchTimer]);

  const currentPoster = posters[selectedTeamId] || DEFAULT_POSTERS['team-1'];
  const activeTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const updateField = (field: keyof SquadPosterData, val: string) => {
    setPosters((prev) => ({
      ...prev,
      [selectedTeamId]: {
        ...currentPoster,
        [field]: val,
      },
    }));
  };

  const handleAwardSquad = (badgeName: string) => {
    soundManager.playSuccess();
    confetti({ particleCount: 60, spread: 90, origin: { y: 0.5 } });
    onAwardTeamPoints(activeTeam.id, 50, badgeName);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Project Header Banner & 25-Min Timer */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              Slides 12 to 16 · Project Time & Poster Creation
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              The Story Poster Studio
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Groups of 4 choose a movie, book, series, or game, map out the 5 core elements, and build a glorious story poster to present live on TV!
            </p>
          </div>

          {/* 25-Minute Project Timer on TV */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-indigo-400" /> Project Timer
              </span>
              <span className="text-4xl sm:text-5xl font-mono font-black text-indigo-300 tabular-nums">
                {formatTimer(secondsLeft)}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 border-l border-slate-800 pl-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2 rounded-xl text-xs font-bold text-white transition-all ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setSecondsLeft(25 * 60);
                  setIsTimerRunning(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Squad Selection Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {teams.map((t) => {
              const isSelected = t.id === selectedTeamId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTeamId(t.id);
                    setPitchTimer(60);
                    setIsPitchRunning(false);
                    soundManager.playCoin();
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-950/60 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('poster-showcase')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                viewTab === 'poster-showcase'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              🖼️ TV Poster Showcase
            </button>
            <button
              onClick={() => setViewTab('editor')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                viewTab === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              ✍️ Edit Squad Data
            </button>
          </div>
        </div>
      </div>

      {/* SQUAD PROJECT DEFENSE CHALLENGE (Dedicated Question for Each Team) */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              Poster Project Q&A Challenge
            </span>
            <h4 className="text-lg font-black font-display text-white mt-0.5">
              4 Squad Story Blueprint Questions
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Each squad defends 1 essential element of their poster to earn +25 points!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              teamIdx: 0,
              badge: 'Characters Defense',
              task: 'State your Protagonist, Sidekick, and Antagonist clearly!',
              points: 25,
            },
            {
              teamIdx: 1,
              badge: 'Setting Defense',
              task: 'Describe where and when the story world takes place!',
              points: 25,
            },
            {
              teamIdx: 2,
              badge: 'Conflict Defense',
              task: 'Explain the central dangerous problem threatening the world!',
              points: 25,
            },
            {
              teamIdx: 3,
              badge: 'Resolution Defense',
              task: 'Explain how the crisis is resolved and the adventure ends!',
              points: 25,
            },
          ].map((item) => {
            const team = teams[item.teamIdx];
            return (
              <div
                key={item.teamIdx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${team.color}`} />
                    <span className="font-bold text-xs text-white truncate">{team.name}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-amber-400 block mb-1">
                    {item.badge}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.task}
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundManager.playCoin();
                    confetti({ particleCount: 30, spread: 60 });
                    onAwardTeamPoints(team.id, item.points, item.badge);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" /> Award +{item.points} pts to {team.name.split(' ')[0]} {team.name.split(' ')[1]}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: THE TV POSTER SHOWCASE (Directly Inspired by Slide 16 One Piece Poster!) */}
      {viewTab === 'poster-showcase' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The Grand Interactive Poster Canvas on TV */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border-4 border-amber-600/60 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 text-slate-900 p-6 sm:p-10 shadow-2xl space-y-6">
              {/* Parchment background effect */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-amber-800/40">
                <div>
                  <span className="text-[11px] font-mono font-black text-amber-800 uppercase tracking-widest block">
                    {currentPoster.mediaType} · Created by {currentPoster.creator} ({currentPoster.year})
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-amber-950 mt-1 uppercase">
                    {currentPoster.title}
                  </h3>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-amber-900 text-amber-100 text-xs font-black font-mono uppercase tracking-wider shrink-0 shadow-sm">
                  {activeTeam.name}
                </div>
              </div>

              {/* Tagline Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-900/10 border border-amber-900/20 text-center text-sm font-bold text-amber-950 italic">
                "{currentPoster.tagline}"
              </div>

              {/* The 5 Core Element Post-It Cards on the Poster */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                {/* Characters */}
                <div className="p-4 rounded-2xl bg-white/80 border-2 border-amber-700/30 shadow-md space-y-1">
                  <span className="font-mono text-xs font-black text-red-700 uppercase block">
                    👥 MAIN CHARACTERS:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {currentPoster.characters}
                  </p>
                </div>

                {/* Setting */}
                <div className="p-4 rounded-2xl bg-white/80 border-2 border-sky-700/30 shadow-md space-y-1">
                  <span className="font-mono text-xs font-black text-sky-800 uppercase block">
                    🧭 SETTING:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {currentPoster.setting}
                  </p>
                </div>

                {/* Conflict */}
                <div className="p-4 rounded-2xl bg-white/80 border-2 border-orange-700/30 shadow-md space-y-1">
                  <span className="font-mono text-xs font-black text-orange-800 uppercase block">
                    🔥 CONFLICT:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {currentPoster.conflict}
                  </p>
                </div>

                {/* Resolution */}
                <div className="p-4 rounded-2xl bg-white/80 border-2 border-emerald-700/30 shadow-md space-y-1">
                  <span className="font-mono text-xs font-black text-emerald-800 uppercase block">
                    🏆 RESOLUTION:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {currentPoster.resolution}
                  </p>
                </div>

                {/* Main Events (Full Span) */}
                <div className="p-4 rounded-2xl bg-white/80 border-2 border-teal-700/30 shadow-md space-y-1 md:col-span-2">
                  <span className="font-mono text-xs font-black text-teal-800 uppercase block">
                    ⛵ MAIN EVENTS:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {currentPoster.mainEvents}
                  </p>
                </div>
              </div>

              {/* Poster Footer Ribbon */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-800/20 text-[11px] font-mono text-amber-900 font-bold">
                <span>SLIDE 16 POSTER STANDARD</span>
                <span>7TH GRADE PROJECT LAB</span>
              </div>
            </div>
          </div>

          {/* Right: TV Lightning Pitch Controls & Awards */}
          <div className="lg:col-span-4 space-y-4">
            {/* 60s Pitch Timer on TV */}
            <div className="rounded-2xl border-2 border-indigo-500/40 bg-slate-900/95 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Mic className="w-4 h-4 animate-pulse" />
                  Live TV Presentation
                </div>
                <span className="text-xs font-mono text-slate-400">60s Lightning Pitch</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className={`text-4xl font-mono font-black tabular-nums ${
                  pitchTimer <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'
                }`}>
                  {pitchTimer}s
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPitchRunning(!isPitchRunning)}
                    className={`py-2 px-3.5 rounded-xl font-bold text-xs text-white transition-all ${
                      isPitchRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    {isPitchRunning ? 'Pause' : 'Start Pitch'}
                  </button>
                  <button
                    onClick={() => {
                      setPitchTimer(60);
                      setIsPitchRunning(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Award Badges */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Award Recognition Badge (+50 pts):
                </span>
                <div className="space-y-1.5">
                  {[
                    '🔥 Epic Conflict Master',
                    '✨ Vivid Worldbuilding (Setting)',
                    '🏴‍☠️ Best Character Roster',
                    '⚡ Outstanding Team Pitch',
                  ].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => handleAwardSquad(badge)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between transition-all"
                    >
                      <span>{badge}</span>
                      <span className="font-mono text-amber-400">+50</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notebook Sync Reminder */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300 space-y-2">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5" /> Notebook Requirement:
              </span>
              <p className="text-slate-300 leading-relaxed">
                All 4 squad members must write down the 5 story elements in their notebooks while collaborating on the poster design!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: SQUAD DATA EDITOR */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                Edit Poster Data · {activeTeam.name}
              </h3>
              <p className="text-xs text-slate-400">
                Customize your story details or load one of the classroom presets
              </p>
            </div>
            <button
              onClick={() => setViewTab('poster-showcase')}
              className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
            >
              Back to Poster Showcase
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Story Title</label>
              <input
                type="text"
                value={currentPoster.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Type (Movie / Book / Game)</label>
              <input
                type="text"
                value={currentPoster.mediaType}
                onChange={(e) => updateField('mediaType', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Creator / Director / Year</label>
              <input
                type="text"
                value={currentPoster.creator}
                onChange={(e) => updateField('creator', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-amber-400 block mb-1">Characters</label>
              <textarea
                rows={2}
                value={currentPoster.characters}
                onChange={(e) => updateField('characters', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-sky-400 block mb-1">Setting (Where & When)</label>
              <textarea
                rows={2}
                value={currentPoster.setting}
                onChange={(e) => updateField('setting', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-rose-400 block mb-1">Conflict (The Core Obstacle)</label>
              <textarea
                rows={2}
                value={currentPoster.conflict}
                onChange={(e) => updateField('conflict', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-emerald-400 block mb-1">Resolution (The Solution)</label>
              <textarea
                rows={2}
                value={currentPoster.resolution}
                onChange={(e) => updateField('resolution', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
