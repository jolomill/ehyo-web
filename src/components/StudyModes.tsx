/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen, PlayCircle, Music, PenLine, NotebookPen, Headphones, BookText, Layers,
} from 'lucide-react';
import { EhYoMark } from './EhYoMark';

// Who the visitor is. Beginners start on the learning path; experienced learners start
// with their own material. Both use the same two parts, feeding each other.
export type StudyMode = 'beginner' | 'experienced';
type Part = 'path' | 'toolkit';

interface FlowText {
  pathLine: string;
  toolkitLine: string;
  forward: string;
  back: string;
}

export interface StudyJourneyText {
  multi: string;
  chips: { lang: string; level: string; mode: StudyMode }[];
  cards: {
    path: { eyebrow: string; title: string };
    toolkit: { eyebrow: string; title: string };
    start: string;
    then: string;
    soon: string;
  };
  beginner: FlowText;
  experienced: FlowText;
}

const INDIGO = '#6B7FD7';
const CORAL = '#FF8FAB';

const ICONS: Record<Part, typeof BookOpen[]> = {
  path: [NotebookPen, Headphones, BookText, Layers],
  toolkit: [BookOpen, PlayCircle, Music, PenLine],
};

const PartCard: React.FC<{
  part: Part;
  first: boolean;
  line: string;
  text: StudyJourneyText['cards'];
}> = ({ part, first, line, text }) => (
  <motion.div
    layout
    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    className={`w-full md:w-64 rounded-2xl border bg-white p-5 ${first ? 'border-ehyo-indigo/30 shadow-md' : 'border-stone-100 shadow-sm'}`}
  >
    <div className="flex items-center justify-between gap-2 mb-3">
      <span
        className={`text-[11px] font-bold rounded-full px-2.5 py-0.5 whitespace-nowrap ${
          first ? 'bg-ehyo-indigo text-white' : 'bg-stone-100 text-stone-500'
        }`}
      >
        {first ? `① ${text.start}` : `② ${text.then}`}
      </span>
      {part === 'path' && (
        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-ehyo-coral/15 text-[#D9577A] whitespace-nowrap">{text.soon}</span>
      )}
    </div>
    <div className="text-[11px] font-bold tracking-widest uppercase text-stone-400">{text[part].eyebrow}</div>
    <div className="font-serif text-xl font-bold text-ehyo-text mb-2">{text[part].title}</div>
    <p className="text-sm text-stone-500 leading-relaxed mb-4">{line}</p>
    <div className="grid grid-cols-4 gap-2">
      {ICONS[part].map((Icon, i) => (
        <span key={i} className="aspect-square rounded-xl bg-ehyo-bg flex items-center justify-center text-ehyo-indigo">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ))}
    </div>
  </motion.div>
);

// Half of the link between the two cards: the forward lane runs from the first card
// toward the second, the back lane returns. Dots travel along each lane.
const Lanes: React.FC<{ vertical: boolean; still: boolean }> = ({ vertical, still }) => {
  const len = 80;
  const pt = (along: number, lane: number) => (vertical ? `${lane},${along}` : `${along},${lane}`);
  const lanes = [
    { lane: 18, from: 2, to: len - 2, color: INDIGO },
    { lane: 42, from: len - 2, to: 2, color: CORAL },
  ];
  return (
    <svg
      viewBox={vertical ? `0 0 60 ${len}` : `0 0 ${len} 60`}
      className={vertical ? 'w-14 h-16 flex-shrink-0' : 'w-16 lg:w-20 h-14 flex-shrink-0'}
      fill="none"
      aria-hidden="true"
    >
      {lanes.map(({ lane, from, to, color }, i) => (
        <g key={i}>
          <path d={`M${pt(from, lane)} L${pt(to, lane)}`} stroke={color} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="3 4" />
          {still ? (
            <circle cx={vertical ? lane : len / 2} cy={vertical ? len / 2 : lane} r={4} fill={color} />
          ) : (
            [0, 1].map(k => (
              <circle key={k} r={4} fill={color}>
                <animateMotion
                  dur="2s"
                  begin={`${k + i * 0.5}s`}
                  repeatCount="indefinite"
                  path={`M${pt(from, lane)} L${pt(to, lane)}`}
                />
              </circle>
            ))
          )}
        </g>
      ))}
    </svg>
  );
};

const LaneLabel: React.FC<{ color: string; arrow: string; children: React.ReactNode }> = ({ color, arrow, children }) => (
  <span className="flex items-start gap-1.5 text-xs font-semibold text-stone-600 leading-snug">
    <span className="mt-[3px] w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
    <span>
      <span aria-hidden="true" style={{ color }}>{arrow} </span>
      {children}
    </span>
  </span>
);

export const StudyJourney: React.FC<{
  mode: StudyMode;
  text: StudyJourneyText;
  onSelect: (m: StudyMode) => void;
}> = ({ mode, text, onSelect }) => {
  const still = !!useReducedMotion();
  const flow = text[mode];
  const order: Part[] = mode === 'beginner' ? ['path', 'toolkit'] : ['toolkit', 'path'];
  const line = (p: Part) => (p === 'path' ? flow.pathLine : flow.toolkitLine);

  const hub = (
    <div className="w-16 h-16 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center flex-shrink-0">
      <EhYoMark className="w-11" />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* One account, a different starting point per language */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-sm text-stone-500 text-center">
        <span className="w-full md:w-auto">{text.multi}</span>
        {text.chips.map(c => {
          const on = c.mode === mode;
          return (
            <button
              key={c.lang}
              type="button"
              onClick={() => onSelect(c.mode)}
              aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${
                on ? 'border-ehyo-indigo/40 bg-ehyo-indigo/10 text-ehyo-text' : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <span className="font-semibold">{c.lang}</span>
              <span className="text-stone-300">·</span>
              <span>{c.level}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: first card, lanes through EhYo, second card; labels above and below the lanes */}
      <div className="hidden md:flex items-center justify-center gap-2">
        <PartCard key={order[0]} part={order[0]} first line={line(order[0])} text={text.cards} />
        <div className="flex flex-col items-center gap-3 w-64 lg:w-72">
          <LaneLabel color={INDIGO} arrow="→">{flow.forward}</LaneLabel>
          <div className="flex items-center">
            <Lanes vertical={false} still={still} />
            {hub}
            <Lanes vertical={false} still={still} />
          </div>
          <LaneLabel color={CORAL} arrow="←">{flow.back}</LaneLabel>
        </div>
        <PartCard key={order[1]} part={order[1]} first={false} line={line(order[1])} text={text.cards} />
      </div>

      {/* Phone: stacked, lanes run down and back up beside their labels */}
      <div className="flex md:hidden flex-col items-center w-full max-w-sm">
        <PartCard key={order[0]} part={order[0]} first line={line(order[0])} text={text.cards} />
        <div className="flex items-center gap-4 py-2">
          <div className="flex flex-col items-center">
            <Lanes vertical still={still} />
            {hub}
            <Lanes vertical still={still} />
          </div>
          <div className="flex flex-col gap-4 max-w-[11rem]">
            <LaneLabel color={INDIGO} arrow="↓">{flow.forward}</LaneLabel>
            <LaneLabel color={CORAL} arrow="↑">{flow.back}</LaneLabel>
          </div>
        </div>
        <PartCard key={order[1]} part={order[1]} first={false} line={line(order[1])} text={text.cards} />
      </div>
    </div>
  );
};
