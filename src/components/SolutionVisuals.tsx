/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { BookOpen, Newspaper, PlayCircle, Layers, NotebookPen } from 'lucide-react';
import { EhYoMark } from './EhYoMark';

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
export const CentralizeVisual: React.FC = () => {
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
            <div className="-translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-sm border border-stone-100">
              <Icon size={20} style={{ color: s.color }} strokeWidth={1.75} />
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
          <div className="relative w-24 h-24 rounded-full bg-white shadow-md ring-4 ring-ehyo-indigo/30 flex items-center justify-center">
            <EhYoMark className="w-16" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
