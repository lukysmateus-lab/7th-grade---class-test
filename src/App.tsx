/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TeamScore } from './types/lesson';
import { Navbar, AppMode } from './components/Navbar';
import { TeacherToolbar } from './components/TeacherToolbar';
import { PlotMountainInteractive } from './components/PlotMountainInteractive';
import { CaseStudyArena } from './components/CaseStudyArena';
import { ProjectStudio } from './components/ProjectStudio';
import { QuizArena } from './components/QuizArena';
import { ScoreboardModal } from './components/ScoreboardModal';
import { StudentSpinnerModal } from './components/StudentSpinnerModal';
import { NotebookGuideModal } from './components/NotebookGuideModal';
import { soundManager } from './utils/audio';

const INITIAL_TEAMS: TeamScore[] = [
  { id: 'team-1', name: 'Squad 1 · Straw Hat Pirates', color: 'bg-rose-500', points: 0 },
  { id: 'team-2', name: 'Squad 2 · Hogwarts Wizards', color: 'bg-indigo-500', points: 0 },
  { id: 'team-3', name: 'Squad 3 · Wimpy Survivors', color: 'bg-amber-500', points: 0 },
  { id: 'team-4', name: 'Squad 4 · Brave Highlanders', color: 'bg-emerald-500', points: 0 },
];

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('mountain');
  const [teams, setTeams] = useState<TeamScore[]>(INITIAL_TEAMS);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals state
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(false);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState<boolean>(false);
  const [isNotebookGuideOpen, setIsNotebookGuideOpen] = useState<boolean>(false);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
      handleToggleFullscreen();
    } else if (e.key.toLowerCase() === 'p') {
      setIsScoreboardOpen((prev) => !prev);
    } else if (e.key.toLowerCase() === 's') {
      setIsSpinnerOpen((prev) => !prev);
    } else if (e.key === '1') {
      setCurrentMode('mountain');
    } else if (e.key === '2') {
      setCurrentMode('cases');
    } else if (e.key === '3') {
      setCurrentMode('project');
    } else if (e.key === '4') {
      setCurrentMode('quiz');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleUpdateScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, points: Math.max(0, t.points + delta) } : t))
    );
  };

  const handleAwardTeamPoints = (teamId: string, points: number, badgeName?: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            points: t.points + points,
            badgeAwarded: badgeName || t.badgeAwarded,
          };
        }
        return t;
      })
    );
  };

  const handleResetScores = () => {
    setTeams(INITIAL_TEAMS.map((t) => ({ ...t, points: 0, posterTitle: undefined, badgeAwarded: undefined })));
  };

  const handleSelectMode = (mode: AppMode) => {
    setCurrentMode(mode);
    soundManager.playCoin();
  };

  const totalTeamPoints = teams.reduce((acc, t) => acc + t.points, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Classroom Screen Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'mountain' && (
          <PlotMountainInteractive
            teams={teams}
            onAwardTeamPoints={handleAwardTeamPoints}
          />
        )}

        {currentMode === 'cases' && (
          <CaseStudyArena
            teams={teams}
            onAwardTeamPoints={handleAwardTeamPoints}
          />
        )}

        {currentMode === 'project' && (
          <ProjectStudio
            teams={teams}
            onAwardTeamPoints={handleAwardTeamPoints}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizArena
            teams={teams}
            onAwardTeamPoints={handleAwardTeamPoints}
            onResetTeams={handleResetScores}
          />
        )}
      </main>

      {/* Teacher Command Toolbar */}
      <TeacherToolbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onOpenScoreboard={() => setIsScoreboardOpen(true)}
        onOpenSpinner={() => setIsSpinnerOpen(true)}
        onOpenNotebookGuide={() => setIsNotebookGuideOpen(true)}
        totalTeamPoints={totalTeamPoints}
      />

      {/* Classroom Modals */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        teams={teams}
        onUpdateScore={handleUpdateScore}
        onResetScores={handleResetScores}
      />

      <StudentSpinnerModal
        isOpen={isSpinnerOpen}
        onClose={() => setIsSpinnerOpen(false)}
      />

      <NotebookGuideModal
        isOpen={isNotebookGuideOpen}
        onClose={() => setIsNotebookGuideOpen(false)}
      />
    </div>
  );
}
