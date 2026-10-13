import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  Sparkles, Timer, Play, Pause, Award, Volume2, Flame, ShieldAlert, Users 
} from 'lucide-react';
import { QuizQuestion, TeamScore } from '../types/lesson';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  teams: TeamScore[];
  onAwardTeamPoints: (teamId: string, points: number) => void;
  onResetTeams: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  teams,
  onAwardTeamPoints,
  onResetTeams,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [fillBlankSelectedWord, setFillBlankSelectedWord] = useState<string | null>(null);

  // 60-Second Countdown Timer Feature
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasTimeExpired, setHasTimeExpired] = useState<boolean>(false);

  // Steal mode if assigned team misses or time expires
  const [isStealMode, setIsStealMode] = useState<boolean>(false);

  // Quiz completed state
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];
  const assignedTeam = teams[question.assignedTeamIndex] || teams[0];

  // 60-Second Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && questionTimeLeft > 0 && !isAnswerRevealed) {
      interval = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 10 && prev > 1) {
            soundManager.playTick();
          } else if (prev === 1) {
            // TIME EXPIRED! Trigger buzzer sound effect immediately
            soundManager.playTimeUp();
            setHasTimeExpired(true);
            setIsStealMode(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (questionTimeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, questionTimeLeft, isAnswerRevealed]);

  const handleSelectOption = (option: string) => {
    if (isAnswerRevealed) return;
    setSelectedOption(option);
    soundManager.playCoin();
  };

  const handleSelectFillBlank = (word: string) => {
    if (isAnswerRevealed) return;
    setFillBlankSelectedWord(word);
    setSelectedOption(word);
    soundManager.playCoin();
  };

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
    setIsTimerRunning(false);

    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      soundManager.playSuccess();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleAwardAssignedTeam = () => {
    soundManager.playCoin();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
    onAwardTeamPoints(assignedTeam.id, question.points);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((c) => c + 1);
      setSelectedOption(null);
      setFillBlankSelectedWord(null);
      setIsAnswerRevealed(false);
      setQuestionTimeLeft(60);
      setIsTimerRunning(false);
      setHasTimeExpired(false);
      setIsStealMode(false);
      soundManager.playCoin();
    } else {
      setIsQuizCompleted(true);
      soundManager.playFanfare();
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setFillBlankSelectedWord(null);
    setIsAnswerRevealed(false);
    setQuestionTimeLeft(60);
    setIsTimerRunning(false);
    setHasTimeExpired(false);
    setIsStealMode(false);
    setIsQuizCompleted(false);
  };

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const leadingTeam = sortedTeams[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Live TV Scoreboard & Question Turn Strip */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Live TV Quiz Tournament
              </h2>
              <p className="text-xs text-slate-400">
                12 Questions total · Exactly 3 questions assigned to each squad!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Current Leader: <strong className="text-amber-400">{leadingTeam?.name}</strong>
            </span>
          </div>
        </div>

        {/* Real-time Team Score Strip on TV */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {teams.map((t, idx) => {
            const isAssignedCurrent = idx === question.assignedTeamIndex;
            const isLeading = t.points > 0 && t.points === leadingTeam?.points;

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isAssignedCurrent
                    ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/50 shadow-lg'
                    : isLeading
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-950/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${t.color}`} />
                    <span className="font-bold text-xs text-slate-200 truncate">
                      {t.name}
                    </span>
                  </div>
                  {isAssignedCurrent ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black font-mono shrink-0">
                      ON TURN
                    </span>
                  ) : isLeading ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : null}
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
                  <span className="text-2xl font-black font-mono text-white tabular-nums">
                    {t.points}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playCoin();
                      onAwardTeamPoints(t.id, question.points);
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg text-white font-bold text-[11px] transition-all active:scale-95 shadow-sm ${
                      isAssignedCurrent ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    +{question.points} pts
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playCoin();
                      onAwardTeamPoints(t.id, 10);
                    }}
                    className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                  >
                    +10
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 12-Question Round Balance Tracker */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
          <span className="font-mono text-[11px]">
            Equally Distributed: 3 turns per squad (Questions {currentQuestionIdx + 1} of 12)
          </span>
          <div className="flex items-center gap-1">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isPast = idx < currentQuestionIdx;
              const isCurrent = idx === currentQuestionIdx;
              return (
                <div
                  key={q.id}
                  className={`w-3.5 h-2 rounded-sm transition-all ${
                    isCurrent
                      ? 'bg-amber-400 w-5 ring-1 ring-white'
                      : isPast
                      ? 'bg-emerald-500'
                      : 'bg-slate-800'
                  }`}
                  title={`Question ${idx + 1} (Assigned to Squad ${q.assignedTeamIndex + 1})`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* QUIZ COMPLETED SCREEN */}
      {isQuizCompleted ? (
        <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white">
            Tournament Champions!
          </h2>
          <p className="text-lg text-slate-300 max-w-lg mx-auto">
            All 4 squads answered their 3 questions with incredible storytelling energy! Here are the final podium standings:
          </p>

          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider mb-2">
              Final Squad Standings
            </h3>
            {sortedTeams.map((t, idx) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">#{idx + 1}</span>
                  <div className={`w-3 h-3 rounded-full ${t.color}`} />
                  <span className="text-white">{t.name}</span>
                </div>
                <span className="font-mono font-bold text-white tabular-nums">
                  {t.points} pts
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={handleRestartQuiz}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
            >
              <RotateCcw className="w-4 h-4" /> Play Quiz Again
            </button>
            <button
              onClick={() => soundManager.playFanfare()}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" /> Replay Fanfare
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD WITH 60-SECOND TIMER */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* ASSIGNED SQUAD CALLOUT BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border-2 border-amber-400/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${assignedTeam.color} shadow-sm`} />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  🎯 DESIGNATED HOT SEAT SQUAD
                </span>
                <span className="text-lg sm:text-xl font-black font-display text-white">
                  {assignedTeam.name}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold shrink-0">
              Turn {Math.floor(currentQuestionIdx / 4) + 1} of 3 for this Squad
            </span>
          </div>

          {/* Question Header & 60-Second Countdown Timer Feature */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <span>{question.roundTitle}</span>
                <span>·</span>
                <span>Ref: {question.slideRef}</span>
              </div>
              <span className="text-xs text-slate-400">
                Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* 60-Second Timer Box */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all shrink-0 ${
              hasTimeExpired
                ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-950/50'
                : questionTimeLeft <= 10 && questionTimeLeft > 0
                ? 'bg-rose-950/40 border-rose-500 animate-pulse'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <Timer className={`w-5 h-5 ${
                hasTimeExpired ? 'text-rose-500 animate-bounce' : 'text-amber-400'
              }`} />

              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  60s Round Timer
                </span>
                <span
                  className={`font-mono text-3xl font-black tabular-nums ${
                    hasTimeExpired
                      ? 'text-rose-500'
                      : questionTimeLeft <= 10
                      ? 'text-rose-500'
                      : 'text-white'
                  }`}
                >
                  {questionTimeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    isTimerRunning ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                  title={isTimerRunning ? 'Pause 60s Timer' : 'Start 60s Timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setQuestionTimeLeft(60);
                    setIsTimerRunning(false);
                    setHasTimeExpired(false);
                    setIsStealMode(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset to 60s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Time Expired Urgency Warning Banner */}
          {hasTimeExpired && !isAnswerRevealed && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 flex items-center justify-between animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold">
                  ⚠️ TIME EXPIRED! The 60-second buzzer has sounded! Open for Steal!
                </span>
              </div>
              <span className="text-xs font-mono text-rose-300 uppercase">Buzzer Triggered</span>
            </div>
          )}

          {/* Question Prompt */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono uppercase text-slate-300">
              Type: {question.type.replace('-', ' ')}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white leading-snug">
              {question.question}
            </h3>
          </div>

          {/* INTERACTIVE QUESTION OPTIONS BY TYPE */}

          {/* 1. MULTIPLE CHOICE OR TRUE/FALSE */}
          {(question.type === 'multiple-choice' || question.type === 'true-false') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {question.options?.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = isAnswerRevealed && opt === question.correctAnswer;
                const isWrong = isAnswerRevealed && isSelected && opt !== question.correctAnswer;

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswerRevealed}
                    className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all font-semibold text-sm sm:text-base flex items-center justify-between ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md'
                        : isWrong
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                        : isSelected
                        ? 'border-amber-400 bg-amber-950/30 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. FILL IN THE BLANK (INTERACTIVE WORD SLOTS) */}
          {question.type === 'fill-blank' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs font-mono text-slate-500 uppercase block mb-2">
                  Select the correct word to fill the blank:
                </span>
                <span className="text-lg sm:text-2xl font-mono font-bold text-amber-300">
                  {fillBlankSelectedWord ? (
                    <span className="underline decoration-amber-400 font-black">
                      [{fillBlankSelectedWord}]
                    </span>
                  ) : (
                    '[ ? ? ? ? ? ]'
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {question.options?.map((word) => {
                  const isSelected = fillBlankSelectedWord === word;
                  const isCorrect = isAnswerRevealed && word === question.correctAnswer;
                  const isWrong = isAnswerRevealed && isSelected && word !== question.correctAnswer;

                  return (
                    <button
                      key={word}
                      onClick={() => handleSelectFillBlank(word)}
                      disabled={isAnswerRevealed}
                      className={`p-3.5 rounded-xl border-2 font-mono font-bold text-sm transition-all ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : isWrong
                          ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                          : isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ANSWER REVEAL & EXPLANATION */}
          {isAnswerRevealed && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Correct Answer: {question.correctAnswer}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* ACTION BUTTONS & POINTS REWARD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAwardAssignedTeam}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Award +{question.points} to {assignedTeam.name}!</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {!isAnswerRevealed ? (
                <button
                  onClick={handleRevealAnswer}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Reveal Correct Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>
                    {currentQuestionIdx < QUIZ_QUESTIONS.length - 1
                      ? 'Next Question'
                      : 'Show Final Standings!'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
