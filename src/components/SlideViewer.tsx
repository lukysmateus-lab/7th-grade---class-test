import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle2, Gamepad2, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SlideViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const slides = [
    {
      num: 1,
      title: 'LEONARDO DA VINCI',
      subtitle: 'English Language & Storytelling Project',
      content: (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="text-amber-400 font-mono tracking-widest text-xs uppercase px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30">
            Interactive Classroom Presentation
          </div>
          <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight text-white">
            LEONARDO <span className="text-amber-400">DAVINCI</span>
          </h1>
          <p className="text-slate-400 max-w-md text-sm">
            Story Elements · 7th Grade English Project Experience
          </p>
        </div>
      ),
    },
    {
      num: 2,
      title: 'Story Elements',
      subtitle: 'Part 1',
      content: (
        <div className="flex flex-col items-center justify-center py-14 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-12 h-12" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-white">
            Story Elements
          </h2>
          <span className="text-xl sm:text-2xl font-mono text-amber-300 font-bold">
            Part 1
          </span>
          <p className="text-slate-400 max-w-lg text-sm">
            Discover the six essential building blocks that make every great story, book, movie, and video game exciting!
          </p>
        </div>
      ),
    },
    {
      num: 3,
      title: 'Do you like reading books?',
      subtitle: 'What’s your favourite type of story?',
      content: (
        <div className="py-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Do you like reading books?
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">
              What’s your favourite type of story?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            {['Tragedy', 'Comedy', 'Drama', 'Revenge', 'Happy Ending', 'Science Fiction', 'Fantasy'].map((genre) => (
              <div
                key={genre}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-sm font-bold text-slate-200 hover:border-amber-400 hover:text-white transition-all shadow-sm"
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: 4,
      title: "Let's talk about stories!",
      subtitle: 'A story is like forming a puzzle.',
      content: (
        <div className="py-8 space-y-6 max-w-2xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
            Let's talk about stories!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
              <span className="text-2xl">🧩</span>
              <p className="text-sm font-semibold leading-relaxed">
                A story is like forming a puzzle.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 space-y-2">
              <span className="text-2xl">🔍</span>
              <p className="text-sm font-semibold leading-relaxed">
                There are different elements that make a story.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-2">
              <span className="text-2xl">✨</span>
              <p className="text-sm font-semibold leading-relaxed">
                We must put them all together to make a story.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: 'In your opinion:',
      subtitle: 'Classroom inquiry & discussion',
      content: (
        <div className="py-6 space-y-6 max-w-xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white text-center">
            In your opinion:
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-base font-semibold">
              1. What makes a story?
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-base font-semibold">
              2. Are there many elements that compose a good story?
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-base font-semibold">
              3. Can you think of any element that is important for a good story?
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: 'The 6 Story Elements',
      subtitle: 'Pair up the basic elements to their definitions',
      content: (
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Try to pair up the basic elements of a story to their definitions:
            </h3>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5" /> 3:00 Timer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">CHARACTERS</span>
              The people or animals that take part in the story.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-sky-400 block mb-1">SETTING</span>
              The time and place where the story happens.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-rose-400 block mb-1">CONFLICT</span>
              A problem the main character must face and try to solve.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">MAIN EVENTS</span>
              The main actions and events that happen in the story.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">RESOLUTION</span>
              The solution to the central conflict of the story.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">VIVID LANGUAGE</span>
              The use of adjectives, adverbs and other expressions that make the story richer in details.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 7,
      title: 'Your turn! Pop Culture Case Study',
      subtitle: 'The Super Mario Bros. Movie',
      content: (
        <div className="py-6 space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <Gamepad2 className="w-8 h-8 text-rose-500" />
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              The Super Mario Bros. Movie
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <span className="font-bold text-amber-300 block mb-1 font-mono text-xs">1. CHARACTERS</span>
              Mario, Luigi, princess Peach, Toad and The Bowser.
            </div>
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
              <span className="font-bold text-rose-300 block mb-1 font-mono text-xs">2. CONFLICT</span>
              Defeat Bowser to save the Mushroom Kingdom.
            </div>
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30">
              <span className="font-bold text-sky-300 block mb-1 font-mono text-xs">3. SETTING</span>
              Another dimension, The Mushroom Kingdom.
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 8,
      title: 'The Golden Formula: The Plot',
      subtitle: 'Do you know what plot is?',
      content: (
        <div className="py-8 space-y-6 max-w-xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Do you know what plot is?
          </h3>
          <p className="text-lg text-amber-300 font-semibold">
            "Plot is the basic storyline of a text/story."
          </p>

          <div className="p-6 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-white space-y-2 shadow-lg">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-200">The Secret Formula</span>
            <p className="text-xl sm:text-2xl font-black font-display">
              The conflict + The main events + The resolution form one:
            </p>
            <p className="text-3xl font-black text-amber-400 font-mono tracking-wider">
              THE PLOT
            </p>
          </div>
        </div>
      ),
    },
    {
      num: 9,
      title: 'Homework Challenge',
      subtitle: 'Apply the knowledge in your notebook',
      content: (
        <div className="py-10 space-y-4 max-w-xl mx-auto text-center">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Notebook Mission
          </span>
          <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
            Homework
          </h3>
          <p className="text-lg text-slate-200 leading-relaxed p-6 rounded-2xl bg-slate-900 border border-slate-800">
            "Choose a story you like a lot and write in the notebook some information about it."
          </p>
        </div>
      ),
    },
    {
      num: 10,
      title: 'See you next class!',
      subtitle: 'Congratulations on mastering Story Elements!',
      content: (
        <div className="py-16 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-4xl sm:text-6xl font-black font-display text-white">
            See you next class!
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Great teamwork today! Keep your creative storytelling minds sharp and ready.
          </p>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide - 1];

  const handleNext = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide((c) => c + 1);
      soundManager.playCoin();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 1) {
      setCurrentSlide((c) => c - 1);
      soundManager.playCoin();
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Slide Navigation Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
            Slide {currentSlide} of {slides.length}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Original Deck Reference
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 1}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="min-h-[340px] flex items-center justify-center">
        {current.content}
      </div>

      {/* Slide Thumbnails / Quick Jump Strip */}
      <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-slate-800 overflow-x-auto py-1">
        {slides.map((s) => (
          <button
            key={s.num}
            onClick={() => {
              setCurrentSlide(s.num);
              soundManager.playCoin();
            }}
            className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
              currentSlide === s.num
                ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {s.num}
          </button>
        ))}
      </div>
    </div>
  );
};
