export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

export interface QuizQuestion {
  id: string;
  round: number;
  roundTitle: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  slideRef: string;
  points: number;
  assignedTeamIndex: number; // 0, 1, 2, or 3 (Equal distribution!)
}

export interface StoryCaseStudy {
  id: string;
  title: string;
  creator: string;
  year: string;
  mediaType: 'book' | 'movie' | 'game' | 'anime';
  coverEmoji: string;
  characters: string;
  setting: string;
  conflict: string;
  mainEvents: string;
  resolution: string;
  tagline?: string;
}

export interface PlotMountainStage {
  id: string;
  name: string;
  altName: string;
  description: string;
  questionPrompt: string;
  exampleInVideo: string;
}

export interface PointBadge {
  id: string;
  name: string;
  title: string;
  icon: string;
  threshold: number;
  description: string;
  color: string;
}

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  points: number;
  chosenStory?: string;
  posterTitle?: string;
  badgeAwarded?: string;
}
