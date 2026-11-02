/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  BookOpen, Newspaper, PlayCircle, Layers, NotebookPen, MousePointer2, PenLine, Languages,
  BookText, XCircle, Bookmark, CheckCircle2, Mic, RotateCcw, FolderOpen, Headphones, Sparkles, Check, X, Brain,
} from 'lucide-react';
import { EhYoMark } from './EhYoMark';

const INDIGO = '#6B7FD7';
const CORAL = '#FF8FAB';
const SAGE = '#A3B18A';
const RED = '#E5484D';

const stageClass = 'relative w-full rounded-xl bg-ehyo-bg border border-stone-100 overflow-hidden';

// Plays only while on screen and when the viewer hasn't asked for reduced motion.
const usePlay = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  return { ref, play: inView && !reduceMotion, reduceMotion };
};

// Steps through phases (durations in seconds) in a loop while playing.
// With reduced motion it rests on `still`, the most descriptive phase.
const usePhase = (steps: number[], play: boolean, reduceMotion: boolean | null, still: number) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = setTimeout(() => setPhase(p => (p + 1) % steps.length), steps[phase] * 1000);
    return () => clearTimeout(id);
  }, [phase, play, steps]);
  return reduceMotion ? still : phase;
};

// ---------------------------------------------------------------------------
// 1. CENTRALIZED MANAGEMENT
// Books, news, videos, vocab practice, speaking, review and notes fly into EhYo, shrinking and fading.
// ---------------------------------------------------------------------------

const CENTRALIZE_CYCLE = 5;

const SOURCES = [
  { icon: BookOpen, left: 50, top: 13, color: INDIGO }, // books
  { icon: Newspaper, left: 78, top: 27, color: CORAL }, // web news
  { icon: PlayCircle, left: 85, top: 58, color: SAGE }, // videos
  { icon: Layers, left: 66, top: 83, color: INDIGO }, // vocab practice
  { icon: Mic, left: 34, top: 83, color: CORAL }, // speaking
  { icon: RotateCcw, left: 15, top: 58, color: SAGE }, // review
  { icon: NotebookPen, left: 22, top: 27, color: INDIGO }, // notes
];

export const CentralizeVisual: React.FC = () => {
  const { ref, play } = usePlay();

  return (
    <div ref={ref} className={`${stageClass} h-56`} aria-hidden="true">
      {SOURCES.map((s, i) => {
        const Icon = s.icon;
        const start = { left: `${s.left}%`, top: `${s.top}%`, opacity: 1, scale: 1 };
        return (
          <motion.div
            key={i}
            className="absolute z-10"
            initial={start}
            animate={
              play
                ? {
                    left: [`${s.left}%`, `${s.left}%`, `${s.left}%`, '50%', '50%'],
                    top: [`${s.top}%`, `${s.top}%`, `${s.top}%`, '50%', '50%'],
                    scale: [0.7, 1, 1, 0.15, 0.15],
                    opacity: [0, 1, 1, 0, 0],
                  }
                : start
            }
            transition={{
              duration: CENTRALIZE_CYCLE,
              times: [0, 0.12, 0.4, 0.68, 1],
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.12,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-sm border border-stone-100">
              <Icon size={20} style={{ color: s.color }} strokeWidth={1.75} />
            </div>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute left-1/2 top-1/2 z-20"
        animate={play ? { scale: [1, 1, 1.15, 1, 1] } : { scale: 1 }}
        transition={{ duration: CENTRALIZE_CYCLE, times: [0, 0.6, 0.72, 0.82, 1], repeat: Infinity, delay: 0.3 }}
      >
        <EhYoMark className="w-28 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. TIME-SAVING
// Selecting a word pops up an example sentence, translation and grammar at once.
// ---------------------------------------------------------------------------

export interface TimeSaveText {
  example: string;
  exampleText: string;
  translate: string;
  translateText: string;
  grammar: string;
  grammarText: string;
  record: string;
  vocab: string;
  grammarBin: string;
}

const TIME_SENTENCE = ['Ella', 'decidió', 'perseguir', 'sus', 'sueños.'];
const TIME_TARGET = 1;
const TIME_FILED = { vocab: 'decidir', grammar: 'Pretérito' };
const TIME_STEPS = [0.8, 0.9, 2.4, 2.4, 0.5]; // idle, select, look-up, file into record, fade

export const TimeSaveVisual: React.FC<{ text: TimeSaveText }> = ({ text }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(TIME_STEPS, play, reduceMotion, 3);
  const selected = phase >= 1 && phase <= 3;
  const showCards = phase === 2 || phase === 3;
  const filed = phase === 3;

  const cards = [
    { icon: PenLine, title: text.example, body: text.exampleText, color: INDIGO },
    { icon: Languages, title: text.translate, body: text.translateText, color: CORAL },
    { icon: BookText, title: text.grammar, body: text.grammarText, color: SAGE },
  ];
  const bins = [
    { label: text.vocab, item: TIME_FILED.vocab, count: 12, color: CORAL },
    { label: text.grammarBin, item: TIME_FILED.grammar, count: 7, color: SAGE },
  ];

  return (
    <div ref={ref} className={`${stageClass} px-4 pt-6 pb-4`} aria-hidden="true">
      <p className="text-center font-serif text-lg md:text-xl text-ehyo-text mb-6">
        {TIME_SENTENCE.map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            {i === TIME_TARGET ? (
              <span className="relative inline-block">
                <motion.span
                  className="absolute -inset-x-1 -inset-y-0.5 rounded bg-ehyo-indigo/20 origin-left"
                  animate={{ scaleX: selected ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                />
                <span className="relative font-semibold">{w}</span>
                <motion.span
                  className="absolute -right-3 top-4 text-ehyo-text"
                  animate={
                    phase === 1 || phase === 2
                      ? { opacity: 1, x: 0, y: 0, scale: [1, 0.8, 1] }
                      : { opacity: 0, x: 24, y: 18, scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <MousePointer2 size={16} fill="white" />
                </motion.span>
              </span>
            ) : (
              w
            )}
          </React.Fragment>
        ))}
      </p>

      {/* Look-up: example, translation, grammar at once */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-h-[6rem]">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={i}
              className="bg-white rounded-lg border border-stone-100 shadow-sm p-2.5 origin-top"
              initial={false}
              animate={showCards ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-1 mb-1 text-[11px] font-bold whitespace-nowrap" style={{ color: c.color }}>
                <Icon size={12} strokeWidth={2.25} />
                {c.title}
              </div>
              <p className="text-[11px] md:text-xs leading-snug text-stone-600">{c.body}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Learning record: new word and grammar get sorted into their own folders */}
      <div className="mt-3 rounded-lg border border-dashed border-stone-200 bg-white/60 p-2.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 mb-2">
          <FolderOpen size={12} />
          {text.record}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {bins.map((b, i) => (
            <div key={i} className="rounded-md bg-white border border-stone-100 px-2 py-1.5 min-h-[3.25rem]">
              <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: b.color }}>
                <span>{b.label}</span>
                <motion.span
                  key={filed ? 'up' : 'base'}
                  initial={filed ? { scale: 1.6 } : false}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.25, type: 'spring', stiffness: 400, damping: 14 }}
                  className="tabular-nums"
                >
                  {filed ? b.count + 1 : b.count}
                </motion.span>
              </div>
              <motion.div
                className="mt-1 inline-block whitespace-nowrap text-[11px] font-semibold text-ehyo-text rounded px-1.5 py-0.5"
                style={{ background: `${b.color}26` }}
                initial={false}
                animate={filed ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
                transition={{ duration: 0.5, delay: filed ? 0.2 + i * 0.25 : 0, ease: 'easeOut' }}
              >
                + {b.item}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. DIFFERENT LEVELS
// The same word ("decide") at A1 vs B2: sentence building, notes and reading.
// ---------------------------------------------------------------------------

export interface LevelText {
  build: string;
  notes: string;
  reading: string;
  notesA1: string;
  notesB2: string;
}

const LEVEL_CONTENT = {
  A1: {
    tiles: ['I', 'decide', 'to', 'go', 'home.'],
    reading: "Tom can't decide. Pizza or rice? He decides: pizza!",
  },
  B2: {
    tiles: ['Having', 'weighed', 'the', 'risks,', 'she', 'decided', 'against', 'it.'],
    reading: 'Regulators have yet to decide whether the merger will be allowed to proceed.',
  },
};
const LEVEL_STEPS = [3.8, 3.8];
const isTarget = (w: string) => /^decid/i.test(w);

const Highlight: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(' ').map((w, i) => (
      <React.Fragment key={i}>
        {i > 0 && ' '}
        {isTarget(w) ? <span className="text-ehyo-coral font-semibold">{w}</span> : w}
      </React.Fragment>
    ))}
  </>
);

export const LevelVisual: React.FC<{ text: LevelText }> = ({ text }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(LEVEL_STEPS, play, reduceMotion, 0);
  const level = phase === 0 ? 'A1' : 'B2';
  const content = LEVEL_CONTENT[level];
  const swap = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.3 },
  };

  const rows = [
    {
      label: text.build,
      body: (
        <div className="flex flex-wrap gap-1">
          {content.tiles.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`px-1.5 py-0.5 rounded border text-xs ${
                isTarget(w) ? 'bg-ehyo-coral/10 border-ehyo-coral/40 text-ehyo-text font-semibold' : 'bg-white border-stone-200 text-stone-600'
              }`}
            >
              {w}
            </motion.span>
          ))}
        </div>
      ),
    },
    {
      label: text.notes,
      body: (
        <div className="flex items-start gap-1.5 text-xs text-stone-600 leading-snug">
          <NotebookPen size={13} className="text-ehyo-indigo mt-0.5 flex-shrink-0" />
          <span>{level === 'A1' ? text.notesA1 : text.notesB2}</span>
        </div>
      ),
    },
    {
      label: text.reading,
      body: (
        <p className="text-xs italic text-stone-600 leading-snug">
          <Highlight text={content.reading} />
        </p>
      ),
    },
  ];

  return (
    <div ref={ref} className={`${stageClass} p-4`} aria-hidden="true">
      {/* The same word at both levels */}
      <div className="text-center mb-2">
        <span className="font-serif text-2xl font-bold text-ehyo-text">decide</span>
        <span className="ml-2 text-xs italic text-stone-400">v.</span>
      </div>

      {/* A1 / B2 switch */}
      <div className="flex justify-center mb-4">
        <div className="relative flex bg-white rounded-full border border-stone-200 p-1 text-sm font-bold">
          <motion.div
            className="absolute top-1 bottom-1 w-14 rounded-full bg-ehyo-indigo"
            animate={{ x: level === 'A1' ? 0 : 56 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
          {(['A1', 'B2'] as const).map(l => (
            <span
              key={l}
              className={`relative w-14 text-center py-0.5 transition-colors duration-300 ${level === l ? 'text-white' : 'text-stone-400'}`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start bg-white/70 rounded-lg px-3 py-2 border border-stone-100">
            <span className="sm:w-14 flex-shrink-0 text-[11px] font-bold text-stone-400 pt-0.5">{r.label}</span>
            <div className="w-full sm:flex-1 min-h-[2.25rem]">
              <AnimatePresence mode="wait">
                <motion.div key={level} {...swap}>{r.body}</motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4. MISTAKE TRACKING
// Wrong sentences get crossed out, flow into EhYo, and EhYo suggests what to train next.
// ---------------------------------------------------------------------------

const WEAK_SENTENCES = [
  { words: ['I', "didn't"], wrong: 'knew', top: 16 },
  { words: ['She', "didn't"], wrong: 'knows', top: 38 },
];
const WEAK_STEPS = [0.5, 1.2, 1.4, 1.1, 2.8, 0.4]; // idle, s1, s2, absorb, bubble, reset
const LOGO_TOP = 80;

export const WeaknessVisual: React.FC<{ bubble: string }> = ({ bubble }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(WEAK_STEPS, play, reduceMotion, 2);

  return (
    <div ref={ref} className={`${stageClass} h-60`} aria-hidden="true">
      {WEAK_SENTENCES.map((s, i) => {
        const shown = phase >= i + 1 && phase <= 2;
        const absorbed = phase >= 3;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 z-10"
            initial={false}
            animate={
              absorbed
                ? { top: `${LOGO_TOP}%`, opacity: 0, scale: 0.2 }
                : { top: `${s.top}%`, opacity: shown ? 1 : 0, scale: shown ? 1 : 0.9 }
            }
            transition={{ duration: absorbed ? 0.8 : 0.35, ease: 'easeInOut', delay: absorbed ? i * 0.1 : 0 }}
          >
            <div className="-translate-x-1/2 flex items-center gap-2 whitespace-nowrap bg-white rounded-lg px-3 py-1.5 shadow-sm border border-stone-100 font-serif text-base text-ehyo-text">
              <span>{s.words.join(' ')}</span>
              <span className="relative">
                <motion.span
                  initial={false}
                  animate={{ color: shown ? RED : '#2D2A26' }}
                  transition={{ delay: shown ? 0.45 : 0 }}
                >
                  {s.wrong}
                </motion.span>
                <motion.span
                  className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#E5484D] origin-left"
                  initial={false}
                  animate={{ scaleX: shown ? 1 : 0 }}
                  transition={{ delay: shown ? 0.45 : 0, duration: 0.25 }}
                />
              </span>
              <motion.span
                initial={false}
                animate={{ scale: shown ? 1 : 0 }}
                transition={{ delay: shown ? 0.6 : 0, type: 'spring', stiffness: 500, damping: 18 }}
              >
                <XCircle size={18} color={RED} />
              </motion.span>
            </div>
          </motion.div>
        );
      })}

      {/* EhYo's suggestion */}
      <motion.div
        className="absolute left-1/2 top-[30%] z-20 w-[85%] max-w-xs"
        initial={false}
        animate={phase === 4 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ x: '-50%', transformOrigin: '50% 100%' }}
      >
        <div className="relative bg-ehyo-indigo text-white text-sm font-medium text-center rounded-2xl px-4 py-2.5 shadow-md">
          {bubble}
          <span className="absolute left-1/2 -bottom-1.5 w-3 h-3 -translate-x-1/2 rotate-45 bg-ehyo-indigo" />
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 z-20"
        style={{ top: `${LOGO_TOP}%` }}
        animate={{ scale: phase === 3 ? [1, 1, 1.15, 1] : 1 }}
        transition={{ duration: 1, times: [0, 0.5, 0.75, 1] }}
      >
        <EhYoMark className="w-24 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// BRAIN MAP (shared by 5 & 6)
// A side-view brain split into skill regions; each fills according to its level.
// ---------------------------------------------------------------------------

export interface BrainLabels {
  listening: string;
  speaking: string;
  reading: string;
  writing: string;
  vocab: string;
  grammar: string;
  weak: string;
}

type Skill = 'speaking' | 'writing' | 'reading' | 'grammar' | 'vocab' | 'listening';
type Levels = Record<Skill, number>;

const BRAIN_OUTLINE =
  'M40 95 C20 90 15 60 35 45 C40 25 70 12 95 18 C115 8 150 12 162 32 C185 40 190 70 178 88 C182 105 165 118 148 112 C140 125 118 128 108 116 C95 124 75 122 68 110 C55 115 42 108 40 95 Z';

const BRAIN_REGIONS: { skill: Skill; points: string; label: [number, number] }[] = [
  { skill: 'speaking', points: '0,0 75,0 65,70 0,110', label: [42, 68] },
  { skill: 'writing', points: '75,0 125,0 112,55 65,70', label: [95, 40] },
  { skill: 'reading', points: '125,0 200,0 200,62 112,55', label: [150, 40] },
  { skill: 'grammar', points: '0,110 65,70 102,82 96,150 0,150', label: [72, 98] },
  { skill: 'vocab', points: '65,70 112,55 200,62 200,86 102,82', label: [140, 73] },
  { skill: 'listening', points: '102,82 200,86 200,150 96,150', label: [130, 102] },
];

// Brain folds, drawn over the regions for texture
const BRAIN_FOLDS = [
  'M48 60 C58 52 62 40 74 36',
  'M100 26 C108 34 104 44 116 48',
  'M138 22 C142 32 156 36 160 48',
  'M150 60 C160 64 170 60 176 70',
  'M60 88 C70 84 80 90 90 86',
  'M118 92 C128 96 140 90 150 96',
];

export const BrainMap: React.FC<{
  levels: Levels;
  color: string;
  labels: BrainLabels;
  weak: Skill;
  filled: boolean;
}> = ({ levels, color, labels, weak, filled }) => (
  <svg viewBox="10 4 186 132" className="w-full max-w-sm mx-auto block">
    <defs>
      <clipPath id="brain-clip">
        <path d={BRAIN_OUTLINE} />
      </clipPath>
    </defs>

    {/* Cerebellum and stem */}
    <path d="M128 112 L134 132 L144 132 L142 112 Z" fill="#E7E5E4" />
    <ellipse cx="158" cy="116" rx="17" ry="10" fill="#E7E5E4" />

    <path d={BRAIN_OUTLINE} fill="white" />
    <g clipPath="url(#brain-clip)">
      {BRAIN_REGIONS.map((r, i) => (
        <motion.polygon
          key={r.skill}
          points={r.points}
          stroke="white"
          strokeWidth={2}
          initial={false}
          animate={{
            fill: color,
            fillOpacity: filled ? 0.12 + levels[r.skill] * 0.78 : 0.06,
          }}
          transition={{ duration: 0.7, delay: filled ? i * 0.12 : 0 }}
        />
      ))}
      {BRAIN_FOLDS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="white" strokeOpacity={0.6} strokeWidth={1.5} strokeLinecap="round" />
      ))}
      {/* Weakest skill: pulsing red outline */}
      <motion.polygon
        points={BRAIN_REGIONS.find(x => x.skill === weak)!.points}
        fill="none"
        stroke={RED}
        strokeWidth={2.5}
        strokeDasharray="5 3"
        initial={false}
        animate={filled ? { opacity: [0, 1, 0.35, 1] } : { opacity: 0 }}
        transition={filled ? { delay: 1.2, duration: 1.6, repeat: Infinity, repeatType: 'reverse' } : { duration: 0.2 }}
      />
    </g>
    <path d={BRAIN_OUTLINE} fill="none" stroke="#D6D3D1" strokeWidth={1.5} />

    {BRAIN_REGIONS.map(r => {
      const isWeak = r.skill === weak;
      return (
        <g key={r.skill} fontFamily="Inter, sans-serif" textAnchor="middle">
          <text x={r.label[0]} y={r.label[1]} fontSize={8.5} fontWeight={700} fill="#2D2A26">
            {labels[r.skill]}
          </text>
          <motion.text
            x={r.label[0]}
            y={r.label[1] + 9}
            fontSize={7}
            fill={isWeak ? RED : '#57534E'}
            initial={false}
            animate={{ opacity: filled ? 1 : 0 }}
            transition={{ delay: filled ? 0.8 : 0 }}
          >
            {Math.round(levels[r.skill] * 100)}%
          </motion.text>
        </g>
      );
    })}

    {/* "Needs work" tag on the weakest skill */}
    {(() => {
      const r = BRAIN_REGIONS.find(x => x.skill === weak)!;
      return (
        <motion.g
          initial={false}
          animate={filled ? { opacity: [0, 1, 0.55, 1] } : { opacity: 0 }}
          transition={filled ? { delay: 1.2, duration: 1.6, repeat: Infinity, repeatType: 'reverse' } : { duration: 0.2 }}
        >
          <rect x={r.label[0] - 20} y={r.label[1] - 26} width={40} height={12} rx={6} fill={RED} />
          <text x={r.label[0]} y={r.label[1] - 17.5} fontSize={7} fontWeight={700} fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">
            {labels.weak}
          </text>
        </motion.g>
      );
    })()}
  </svg>
);

// ---------------------------------------------------------------------------
// 5. PERSONALIZED TRACKING
// ---------------------------------------------------------------------------

const TRACK_LEVELS: Levels = { listening: 0.8, speaking: 0.3, reading: 0.9, writing: 0.55, vocab: 0.75, grammar: 0.6 };
const TRACK_STEPS = [0.6, 6];

export const TrackingVisual: React.FC<{ labels: BrainLabels }> = ({ labels }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(TRACK_STEPS, play, reduceMotion, 1);

  return (
    <div ref={ref} className={`${stageClass} px-4 py-5`} aria-hidden="true">
      <BrainMap levels={TRACK_LEVELS} color={INDIGO} labels={labels} weak="speaking" filled={phase === 1} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// 6. SEPARATE LANGUAGES
// Switching language swaps in that language's own brain map.
// ---------------------------------------------------------------------------

const LANG_TRACKS: { name: string; color: string; weak: Skill; levels: Levels }[] = [
  { name: 'English', color: INDIGO, weak: 'speaking', levels: TRACK_LEVELS },
  { name: '日本語', color: CORAL, weak: 'writing', levels: { listening: 0.7, speaking: 0.5, reading: 0.45, writing: 0.2, vocab: 0.6, grammar: 0.4 } },
  { name: 'Español', color: SAGE, weak: 'grammar', levels: { listening: 0.4, speaking: 0.55, reading: 0.65, writing: 0.5, vocab: 0.7, grammar: 0.25 } },
];
const LANG_STEPS = [3.2, 3.2, 3.2];

export const MultiLangVisual: React.FC<{ labels: BrainLabels }> = ({ labels }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(LANG_STEPS, play, reduceMotion, 0);
  const track = LANG_TRACKS[phase];

  return (
    <div ref={ref} className={`${stageClass} px-4 pt-4 pb-5`} aria-hidden="true">
      <div className="flex justify-center gap-1.5 mb-3">
        {LANG_TRACKS.map((l, i) => (
          <span
            key={l.name}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap border transition-colors duration-300"
            style={
              i === phase
                ? { background: l.color, borderColor: l.color, color: 'white' }
                : { background: 'white', borderColor: '#E7E5E4', color: '#A8A29E' }
            }
          >
            {l.name}
          </span>
        ))}
      </div>
      <BrainMap levels={track.levels} color={track.color} labels={labels} weak={track.weak} filled />
    </div>
  );
};

// ---------------------------------------------------------------------------
// 7. CROSS-DEVICE SYNC
// Save a word while reading on the computer; it lands on the phone as a flashcard.
// ---------------------------------------------------------------------------

export interface SyncText {
  saved: string;
  meaning: string;
  laptop: string;
  phone: string;
}

const SYNC_WORD = 'ephemeral';
const SYNC_STEPS = [0.6, 1.3, 1.0, 1.4, 2.2, 0.4]; // idle, save, fly, card front, card back, reset

export const SyncVisual: React.FC<{ text: SyncText }> = ({ text }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(SYNC_STEPS, play, reduceMotion, 4);
  const saved = phase >= 1 && phase <= 4;
  const flying = phase === 2;
  const onPhone = phase === 3 || phase === 4;

  return (
    <div ref={ref} className={`${stageClass} h-60 px-4 pt-6`} aria-hidden="true">
      <div className="flex items-end justify-between gap-3 h-40">
        {/* Laptop */}
        <div className="flex-1 min-w-0 max-w-[65%] flex flex-col items-center">
          <div className="w-full h-32 rounded-t-lg overflow-hidden border-[5px] border-b-0 border-stone-700 bg-white px-3 py-2.5 flex flex-col gap-1.5">
            <div className="h-1.5 w-3/4 rounded bg-stone-200" />
            <div className="h-1.5 w-full rounded bg-stone-200" />
            <p className="text-[11px] md:text-xs text-stone-600 leading-snug">
              Cherry blossoms are{' '}
              <span className="relative inline-block">
                <motion.span
                  className="absolute -inset-x-0.5 inset-y-0 rounded bg-ehyo-coral/25 origin-left"
                  initial={false}
                  animate={{ scaleX: saved ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative font-semibold text-ehyo-text">{SYNC_WORD}</span>
              </span>
              .
            </p>
            <div className="h-1.5 w-5/6 rounded bg-stone-200" />
            <motion.div
              className="self-end flex items-center gap-1 text-[10px] font-bold text-ehyo-indigo"
              initial={false}
              animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 4 }}
              transition={{ delay: saved ? 0.35 : 0 }}
            >
              <Bookmark size={11} fill="currentColor" />
              {text.saved}
            </motion.div>
          </div>
          <div className="w-[108%] h-2.5 rounded-b-lg bg-stone-300" />
        </div>

        {/* Phone */}
        <div className="w-[4.75rem] flex-shrink-0 h-36 rounded-2xl border-[5px] border-stone-700 bg-white flex items-center justify-center p-1.5 [perspective:400px]">
          <AnimatePresence mode="wait">
            {onPhone && (
              <motion.div
                key={phase === 3 ? 'front' : 'back'}
                className={`w-full h-20 rounded-lg flex flex-col items-center justify-center text-center shadow-sm border ${
                  phase === 3 ? 'bg-ehyo-indigo/10 border-ehyo-indigo/30' : 'bg-ehyo-sage/15 border-ehyo-sage/40'
                }`}
                initial={{ rotateY: -90, opacity: 0.6 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                {phase === 3 ? (
                  <span className="text-[11px] font-bold text-ehyo-text">{SYNC_WORD}</span>
                ) : (
                  <>
                    <span className="text-[11px] font-bold text-ehyo-text leading-tight px-0.5">{text.meaning}</span>
                    <CheckCircle2 size={14} className="text-ehyo-sage mt-1" />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between gap-3 mt-3 text-[11px] text-stone-500">
        <span className="flex-1 max-w-[65%] text-center">{text.laptop}</span>
        <span className="w-[4.75rem] flex-shrink-0 text-center">{text.phone}</span>
      </div>

      {/* The saved word travelling to the phone */}
      <motion.div
        className="absolute z-20"
        initial={false}
        animate={
          flying
            ? { left: ['38%', '62%', '84%'], top: ['40%', '12%', '42%'], opacity: [0, 1, 0], scale: [0.9, 1, 0.8] }
            : { left: '38%', top: '40%', opacity: 0, scale: 0.9 }
        }
        transition={flying ? { duration: 1, ease: 'easeInOut' } : { duration: 0 }}
      >
        <span className="-translate-x-1/2 -translate-y-1/2 inline-block bg-ehyo-coral text-white text-[11px] font-bold rounded-full px-2.5 py-1 shadow-md">
          {SYNC_WORD}
        </span>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CORE CONCEPT: PERSONAL LEARNING PATH (dark section)
// Weak spots flow into EhYo, which lays out a winding route of content made for
// them; a marker travels the route, ticking off each stop until the finish flag.
// ---------------------------------------------------------------------------

export interface LearningPathText {
  weak: string[];
  generating: string;
  steps: string[];
  levelUp: string;
}

// The two blues of the EhYo logo's open-book arcs
const LOGO_LIGHT = '#AEB3F4';
const LOGO_BLUE = '#5258FA';

// Positions in % of the stage, which is ASPECT times as tall as it is wide; the road
// is drawn in a 100 x (100 * ASPECT) viewBox.
const ASPECT = 1.1;
// EhYo sits mid-stage while it takes in the weak spots, then moves up to head the route.
const HUB_START = { x: 50, y: 32 };
const HUB_TOP = { x: 50, y: 9 };
const PATH_NODES = [
  { x: 22, y: 29, icon: NotebookPen, color: INDIGO },
  { x: 78, y: 43, icon: Headphones, color: CORAL },
  { x: 22, y: 57, icon: BookOpen, color: SAGE },
  { x: 78, y: 71, icon: PenLine, color: INDIGO },
];
const PATH_GOAL = { x: 50, y: 87 };
// Six weak spots spread evenly on an arc around EhYo
const PATH_WEAK = [
  { x: 14, y: 32 }, { x: 20, y: 17 }, { x: 34, y: 5 },
  { x: 66, y: 5 }, { x: 80, y: 17 }, { x: 86, y: 32 },
];

// The road starts just under the logo, drops into the first stop from above, then
// weaves between stops leaving and entering each one from the side, so it never
// runs under the logo, an icon or a label.
const ROUTE = [{ x: HUB_TOP.x, y: HUB_TOP.y + 8 }, ...PATH_NODES, PATH_GOAL];
const ROAD = ROUTE.map((p, i) => {
  const y = p.y * ASPECT;
  if (i === 0) return `M${p.x},${y}`;
  const prev = ROUTE[i - 1];
  const py = prev.y * ASPECT;
  if (i === 1) {
    const midY = (py + y) / 2;
    return `C${prev.x},${midY} ${p.x},${midY} ${p.x},${y}`;
  }
  const midX = (prev.x + p.x) / 2;
  return `C${midX},${py} ${midX},${y} ${p.x},${y}`;
}).join(' ');

// idle, weak spots, absorb, building the path, road + stops appear, stops ticked off, level up, fade
const PATH_STEPS = [0.4, 1.8, 0.8, 1.8, 2.2, 1.7, 2.2, 0.5];
const TICK_GAP = 0.35;
const BURST = [0, 60, 120, 180, 240, 300];

export const LearningPathVisual: React.FC<{ text: LearningPathText }> = ({ text }) => {
  const { ref, play, reduceMotion } = usePlay();
  const phase = usePhase(PATH_STEPS, play, reduceMotion, 6);
  const showWeak = phase === 1;
  const absorbed = phase >= 2 && phase <= 6;
  const hubUp = phase >= 3 && phase <= 6;
  const building = phase === 3;
  const showRoad = phase >= 4 && phase <= 6;
  const ticking = phase === 5;
  const done = phase === 6;
  // Seconds until stop i is ticked off; -1 means not yet. With reduced motion the
  // visual rests in the finished state.
  const ticked = (i: number) => (done ? 0 : ticking ? 0.2 + i * TICK_GAP : -1);
  const hub = hubUp ? HUB_TOP : HUB_START;

  return (
    <div
      ref={ref}
      className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-5 md:px-7 md:py-7"
      aria-hidden="true"
    >
      <div className="relative w-full" style={{ aspectRatio: `1 / ${ASPECT}` }}>
        {/* Road */}
        <svg viewBox={`0 0 100 ${100 * ASPECT}`} className="absolute inset-0 w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="path-road" x1="0" y1="0" x2="0" y2={100 * ASPECT} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={LOGO_LIGHT} />
              <stop offset="100%" stopColor={LOGO_BLUE} />
            </linearGradient>
          </defs>
          <motion.path
            d={ROAD}
            stroke="white"
            strokeOpacity={0.07}
            strokeWidth={2.4}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: showRoad ? 1 : 0, opacity: showRoad ? 1 : 0 }}
            transition={{ duration: showRoad ? 1.8 : 0.3, ease: 'easeInOut' }}
          />
          <motion.path
            d={ROAD}
            stroke="url(#path-road)"
            strokeWidth={0.8}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: showRoad ? 1 : 0, opacity: showRoad ? 1 : 0 }}
            transition={{ duration: showRoad ? 1.8 : 0.3, ease: 'easeInOut' }}
          />
        </svg>

        {/* Weak spots, which fly into EhYo */}
        {text.weak.map((w, i) => {
          const p = PATH_WEAK[i];
          return (
            <motion.div
              key={w}
              className="absolute z-10"
              initial={false}
              animate={
                absorbed
                  ? { left: `${HUB_START.x}%`, top: `${HUB_START.y}%`, scale: 0.2, opacity: 0 }
                  : { left: `${p.x}%`, top: `${p.y}%`, scale: showWeak ? 1 : 0.6, opacity: showWeak ? 1 : 0 }
              }
              transition={{ duration: absorbed ? 0.7 : 0.35, delay: absorbed ? i * 0.06 : showWeak ? i * 0.15 : 0, ease: 'easeInOut' }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E5484D]/15 border border-[#E5484D]/35 pl-0.5 pr-2.5 py-0.5">
                <motion.span
                  className="w-5 h-5 rounded-full bg-[#E5484D] flex items-center justify-center flex-shrink-0"
                  initial={false}
                  animate={{ scale: showWeak ? 1 : 0, rotate: showWeak ? 0 : -90 }}
                  transition={{ delay: showWeak ? 0.2 + i * 0.15 : 0, type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <X size={12} strokeWidth={3.5} className="text-white" />
                </motion.span>
                <span className="text-xs font-bold text-[#FF9EA1]">{w}</span>
              </div>
            </motion.div>
          );
        })}

        {/* EhYo hub: takes in the weak spots, then moves up to head the route */}
        <motion.div
          className="absolute z-20"
          initial={false}
          animate={{ left: `${hub.x}%`, top: `${hub.y}%` }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center">
            <motion.div
              className="absolute w-28 h-28 rounded-full bg-[#5258FA]/20 blur-2xl"
              initial={false}
              animate={{ opacity: absorbed ? [0.3, 1, 0.5] : 0.25, scale: absorbed ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="relative"
              initial={false}
              animate={{ scale: phase === 2 ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <EhYoMark className="w-24 md:w-28" textFill="#FFFFFF" />
            </motion.div>

            {/* "EhYo is building your path" loading state */}
            <motion.div
              className="absolute top-full mt-3 left-1/2"
              initial={false}
              animate={{ opacity: building ? 1 : 0, y: building ? 0 : 6 }}
              transition={{ duration: 0.3, delay: building ? 0.5 : 0 }}
            >
              <div className="-translate-x-1/2 flex items-center gap-2 whitespace-nowrap text-sm font-semibold" style={{ color: LOGO_LIGHT }}>
                <motion.span
                  animate={building ? { rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.8, repeat: building ? Infinity : 0 }}
                >
                  <Sparkles size={16} />
                </motion.span>
                {text.generating}
                <span className="flex gap-0.5">
                  {[0, 1, 2].map(d => (
                    <motion.span
                      key={d}
                      className="w-1 h-1 rounded-full"
                      style={{ background: LOGO_LIGHT }}
                      animate={building ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.2 }}
                      transition={{ duration: 0.9, repeat: building ? Infinity : 0, delay: d * 0.15 }}
                    />
                  ))}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stops on the route */}
        {PATH_NODES.map((n, i) => {
          const Icon = n.icon;
          const tick = ticked(i);
          return (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              initial={false}
              animate={{ opacity: showRoad ? 1 : 0, scale: showRoad ? 1 : 0.5 }}
              transition={{ duration: 0.35, delay: showRoad && phase === 4 ? 0.35 + i * 0.35 : 0 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                <div className="relative rounded-xl bg-[#3A3632]">
                <motion.div
                  className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border"
                  initial={false}
                  animate={{
                    backgroundColor: tick >= 0 ? `${n.color}33` : '#3A3632',
                    borderColor: tick >= 0 ? `${n.color}99` : 'rgba(255,255,255,0.12)',
                  }}
                  transition={{ delay: tick > 0 ? tick : 0, duration: 0.3 }}
                >
                  <Icon size={24} style={{ color: n.color }} strokeWidth={1.75} />
                  <motion.div
                    className="absolute -right-1.5 -top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-ehyo-text"
                    style={{ background: n.color }}
                    initial={false}
                    animate={{ scale: tick >= 0 ? 1 : 0 }}
                    transition={{ delay: tick > 0 ? tick : 0, type: 'spring', stiffness: 500, damping: 16 }}
                  >
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </motion.div>
                </motion.div>
                </div>
                <span className="text-xs md:text-sm font-semibold text-stone-300 whitespace-nowrap">{text.steps[i]}</span>
              </div>
            </motion.div>
          );
        })}

        {/* Goal: level up */}
        <motion.div
          className="absolute z-10"
          style={{ left: `${PATH_GOAL.x}%`, top: `${PATH_GOAL.y}%` }}
          initial={false}
          animate={{ opacity: showRoad ? 1 : 0, scale: showRoad ? 1 : 0.5 }}
          transition={{ delay: showRoad && phase === 4 ? 1.8 : 0, duration: 0.35 }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center">
            {/* expanding ring */}
            <motion.div
              className="absolute w-12 h-12 rounded-full border-2"
              style={{ borderColor: LOGO_LIGHT }}
              initial={false}
              animate={done ? { scale: [1, 2.2], opacity: [0.8, 0] } : { scale: 1, opacity: 0 }}
              transition={done ? { duration: 0.9, delay: 0.15 } : { duration: 0 }}
            />
            {/* little stars bursting out */}
            {BURST.map(deg => {
              const r = (deg * Math.PI) / 180;
              return (
                <motion.span
                  key={deg}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ background: deg % 120 === 0 ? LOGO_LIGHT : CORAL }}
                  initial={false}
                  animate={
                    done
                      ? { x: [0, Math.cos(r) * 40], y: [0, Math.sin(r) * 40], opacity: [1, 0], scale: [1, 0.4] }
                      : { x: 0, y: 0, opacity: 0, scale: 1 }
                  }
                  transition={done ? { duration: 0.8, delay: 0.2, ease: 'easeOut' } : { duration: 0 }}
                />
              );
            })}
            <motion.div
              className="relative w-12 h-12 rounded-full flex items-center justify-center border"
              initial={false}
              animate={
                done
                  ? { scale: [1, 1.3, 1], backgroundColor: LOGO_BLUE, borderColor: LOGO_LIGHT }
                  : { scale: 1, backgroundColor: '#3A3632', borderColor: 'rgba(255,255,255,0.12)' }
              }
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={false}
                animate={done ? { y: [4, -3, 0] } : { y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Brain size={24} strokeWidth={2} style={{ color: done ? '#FFFFFF' : LOGO_LIGHT }} />
              </motion.span>
            </motion.div>
            {/* "Level Up!" label */}
            <motion.div
              className="absolute top-full mt-1.5 left-1/2"
              initial={false}
              animate={done ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.8 }}
              transition={{ delay: done ? 0.3 : 0, type: 'spring', stiffness: 400, damping: 14 }}
            >
              <span className="-translate-x-1/2 inline-block whitespace-nowrap text-sm font-extrabold tracking-wide" style={{ color: LOGO_LIGHT }}>
                {text.levelUp}
              </span>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
