/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { BookOpen, Newspaper, PlayCircle, Layers, NotebookPen } from 'lucide-react';

const CYCLE = 5; // seconds per loop

// Starting positions (percent of the stage) arranged around the center
const SOURCES = [
  { icon: BookOpen, left: 50, top: 14, color: '#6B7FD7' },
  { icon: Newspaper, left: 84, top: 36, color: '#FF8FAB' },
  { icon: PlayCircle, left: 74, top: 84, color: '#A3B18A' },
  { icon: Layers, left: 26, top: 84, color: '#6B7FD7' },
  { icon: NotebookPen, left: 16, top: 36, color: '#FF8FAB' },
];

// --- VISUAL: CENTRALIZED MANAGEMENT ---
// Books, news, videos, vocab practice and notes fly into EhYo, shrinking and fading.
export const CentralizeVisual: React.FC<{ labels: string[] }> = ({ labels }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const play = inView && !reduceMotion;

  return (
    <div
      ref={ref}
      className="relative w-full h-56 rounded-xl bg-ehyo-bg border border-stone-100 overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint guide rings */}
      <div className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ehyo-indigo/15" />
      <div className="absolute left-1/2 top-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ehyo-indigo/10" />

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
              duration: CYCLE,
              times: [0, 0.12, 0.4, 0.68, 1],
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.12,
            }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap bg-white rounded-full pl-2 pr-3 py-1.5 shadow-sm border border-stone-100 text-xs font-medium text-ehyo-text">
              <Icon size={14} style={{ color: s.color }} strokeWidth={2} />
              {labels[i]}
            </div>
          </motion.div>
        );
      })}

      {/* Center: EhYo */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-20"
        animate={play ? { scale: [1, 1, 1.15, 1, 1] } : { scale: 1 }}
        transition={{ duration: CYCLE, times: [0, 0.6, 0.72, 0.82, 1], repeat: Infinity, delay: 0.3 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-ehyo-indigo/30"
            animate={play ? { scale: [1, 1, 1.9, 1.9], opacity: [0, 0.6, 0, 0] } : { opacity: 0 }}
            transition={{ duration: CYCLE, times: [0, 0.66, 0.9, 1], repeat: Infinity, delay: 0.3 }}
          />
          <div className="relative w-20 h-20 rounded-full bg-white shadow-md ring-4 ring-ehyo-indigo/40 flex flex-col items-center justify-center">
            <span className="font-serif text-lg font-bold text-ehyo-text leading-none">EhYo</span>
            <svg width="28" height="6" viewBox="0 0 40 8" fill="none" className="mt-0.5">
              <path d="M2 2C10 6 18 6 20 2C22 6 30 6 38 2" stroke="#6B7FD7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
