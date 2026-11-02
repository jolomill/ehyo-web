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

export type StudyMode = 'toolkit' | 'path';

export interface StudyLoopText {
  toolkitEyebrow: string;
  pathEyebrow: string;
  toolkit: string;
  path: string;
  center: string;
  mistakes: string;
  next: string;
  soon: string;
}

const RED = '#E5484D';
const BLUE = '#5258FA';

const TOOLKIT_ICONS = [BookOpen, PlayCircle, Music, PenLine];
const PATH_ICONS = [NotebookPen, Headphones, BookText, Layers];

// One side of the loop: what you study with.
const SideCard: React.FC<{
  eyebrow: string;
  title: string;
  icons: typeof TOOLKIT_ICONS;
  active: boolean;
  badge?: string;
  onSelect: () => void;
}> = ({ eyebrow, title, icons, active, badge, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={active}
    className={`w-full md:w-56 text-left rounded-2xl border bg-white p-5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${
      active ? 'border-ehyo-indigo/30 shadow-md' : 'border-stone-100 opacity-55 hover:opacity-80'
    }`}
  >
    <div className="flex items-center justify-between gap-2 mb-1">
      <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400">{eyebrow}</span>
      {badge && (
        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-ehyo-coral/15 text-[#D9577A] whitespace-nowrap">{badge}</span>
      )}
    </div>
    <div className="font-serif text-lg font-bold text-ehyo-text mb-4">{title}</div>
    <div className="grid grid-cols-4 gap-2">
      {icons.map((Icon, i) => (
        <span key={i} className="aspect-square rounded-xl bg-ehyo-bg flex items-center justify-center text-ehyo-indigo">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ))}
    </div>
  </button>
);

// Two lanes between a side and the centre: mistakes flow in (red), better next steps flow out (blue).
// `centreAtEnd` says which end of the connector the centre sits at.
const Connector: React.FC<{ vertical: boolean; centreAtEnd: boolean; still: boolean }> = ({ vertical, centreAtEnd, still }) => {
  const len = 110;
  const a = 4;
  const b = len - 4;
  // in-lane runs side -> centre, out-lane runs centre -> side
  const inFrom = centreAtEnd ? a : b;
  const inTo = centreAtEnd ? b : a;
  const pt = (along: number, lane: number) => (vertical ? `${lane},${along}` : `${along},${lane}`);
  const lanes = [
    { lane: 18, from: inFrom, to: inTo, color: RED },
    { lane: 42, from: inTo, to: inFrom, color: BLUE },
  ];
  return (
    <svg
      viewBox={vertical ? `0 0 60 ${len}` : `0 0 ${len} 60`}
      className={vertical ? 'w-14 h-24' : 'w-24 lg:w-32 h-14'}
      fill="none"
      aria-hidden="true"
    >
      {lanes.map(({ lane, from, to, color }, i) => {
        const dir = Math.sign(to - from);
        const head = `M${pt(to - dir * 7, lane - 5)} L${pt(to, lane)} L${pt(to - dir * 7, lane + 5)}`;
        return (
          <g key={i}>
            <path d={`M${pt(from, lane)} L${pt(to, lane)}`} stroke={color} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="3 4" />
            <path d={head} stroke={color} strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {still ? (
              <circle cx={vertical ? lane : (from + to) / 2} cy={vertical ? (from + to) / 2 : lane} r={4} fill={color} />
            ) : (
              [0, 1].map(k => (
                <circle key={k} r={4} fill={color}>
                  <animateMotion
                    dur="2.4s"
                    begin={`${k * 1.2 + i * 0.6}s`}
                    repeatCount="indefinite"
                    path={`M${pt(from, lane)} L${pt(to - dir * 8, lane)}`}
                  />
                </circle>
              ))
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const StudyLoopDiagram: React.FC<{
  active: StudyMode;
  text: StudyLoopText;
  onSelect: (m: StudyMode) => void;
}> = ({ active, text, onSelect }) => {
  const still = !!useReducedMotion();
  const centre = (
    <div className="relative flex flex-col items-center gap-2 flex-shrink-0">
      <div className="relative w-28 h-28 rounded-full bg-white border border-stone-100 shadow-md flex items-center justify-center">
        {!still && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-ehyo-indigo/30"
            animate={{ scale: [1, 1.18], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <EhYoMark className="w-20" />
      </div>
      <span className="text-sm font-bold text-ehyo-text whitespace-nowrap">{text.center}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Desktop: side - lanes - centre - lanes - side */}
      <div className="hidden md:flex items-center justify-center">
        <SideCard eyebrow={text.toolkitEyebrow} title={text.toolkit} icons={TOOLKIT_ICONS} active={active === 'toolkit'} onSelect={() => onSelect('toolkit')} />
        <Connector vertical={false} centreAtEnd still={still} />
        {centre}
        <Connector vertical={false} centreAtEnd={false} still={still} />
        <SideCard eyebrow={text.pathEyebrow} title={text.path} icons={PATH_ICONS} active={active === 'path'} badge={text.soon} onSelect={() => onSelect('path')} />
      </div>

      {/* Phone: the same loop, stacked */}
      <div className="flex md:hidden flex-col items-center w-full max-w-xs">
        <SideCard eyebrow={text.toolkitEyebrow} title={text.toolkit} icons={TOOLKIT_ICONS} active={active === 'toolkit'} onSelect={() => onSelect('toolkit')} />
        <Connector vertical centreAtEnd still={still} />
        {centre}
        <Connector vertical centreAtEnd={false} still={still} />
        <SideCard eyebrow={text.pathEyebrow} title={text.path} icons={PATH_ICONS} active={active === 'path'} badge={text.soon} onSelect={() => onSelect('path')} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-stone-500">
        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: RED }} />{text.mistakes}</span>
        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: BLUE }} />{text.next}</span>
      </div>
    </div>
  );
};
