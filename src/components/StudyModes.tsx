/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  BookOpen, PlayCircle, Music, PenLine, NotebookPen, Headphones, BookText, Layers,
} from 'lucide-react';
import { EhYoMark } from './EhYoMark';

// Who the visitor is; picks which how-to content shows under the diagram.
export type StudyMode = 'beginner' | 'experienced';
type Part = 'toolkit' | 'path';

export interface StudyDiagramText {
  toolkit: { eyebrow: string; title: string };
  path: { eyebrow: string; title: string };
  soon: string;
}

const INDIGO = '#6B7FD7';
const CORAL = '#FF8FAB';

const ICONS: Record<Part, typeof BookOpen[]> = {
  toolkit: [BookOpen, PlayCircle, Music, PenLine],
  path: [NotebookPen, Headphones, BookText, Layers],
};

const PartCard: React.FC<{ part: Part; text: StudyDiagramText }> = ({ part, text }) => (
  <div className="w-full md:w-60 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <div className="text-xs font-semibold text-stone-400">{text[part].eyebrow}</div>
      {part === 'path' && (
        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-ehyo-coral/15 text-[#D9577A] whitespace-nowrap">{text.soon}</span>
      )}
    </div>
    <div className="font-serif text-xl font-bold text-ehyo-text mt-1 mb-4">{text[part].title}</div>
    <div className="grid grid-cols-4 gap-2">
      {ICONS[part].map((Icon, i) => (
        <span key={i} className="aspect-square rounded-xl bg-ehyo-bg flex items-center justify-center text-ehyo-indigo">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ))}
    </div>
  </div>
);

// A two-way link: one lane flows toward EhYo's far side, the other flows back.
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
      className={vertical ? 'w-14 h-16 flex-shrink-0' : 'w-16 lg:w-24 h-14 flex-shrink-0'}
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
                <animateMotion dur="2s" begin={`${k + i * 0.5}s`} repeatCount="indefinite" path={`M${pt(from, lane)} L${pt(to, lane)}`} />
              </circle>
            ))
          )}
        </g>
      ))}
    </svg>
  );
};

// Self-study toolkit ⇄ EhYo ⇄ personal learning path. Fixed: it never changes with the tabs.
export const StudyDiagram: React.FC<{ text: StudyDiagramText }> = ({ text }) => {
  const still = !!useReducedMotion();
  const hub = (
    <div className="w-20 h-20 rounded-full bg-white border border-stone-100 shadow-md flex items-center justify-center flex-shrink-0">
      <EhYoMark className="w-14" />
    </div>
  );
  return (
    <>
      <div className="hidden md:flex items-center justify-center">
        <PartCard part="toolkit" text={text} />
        <Lanes vertical={false} still={still} />
        {hub}
        <Lanes vertical={false} still={still} />
        <PartCard part="path" text={text} />
      </div>
      <div className="flex md:hidden flex-col items-center w-full max-w-sm mx-auto">
        <PartCard part="toolkit" text={text} />
        <Lanes vertical still={still} />
        {hub}
        <Lanes vertical still={still} />
        <PartCard part="path" text={text} />
      </div>
    </>
  );
};
