/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { BookOpen, Music, Film, Pencil } from 'lucide-react';

interface EngineNode {
    label: string;
    text: string;
}

// --- VISUALIZATION: CULTURE CONTEXT ENGINE ---
export const CultureContextEngine: React.FC<{ nodesData?: EngineNode[] }> = ({ nodesData }) => {
  const [activeNode, setActiveNode] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveNode(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const defaultNodes = [
      { id: 0, icon: BookOpen, label: "Literal", text: "Direct meaning" },
      { id: 1, icon: Film, label: "Media", text: "Used in Money Heist S3" },
      { id: 2, icon: Pencil, label: "Slang", text: "Colloquial usage in Madrid" },
      { id: 3, icon: Music, label: "Music", text: "Lyrics in Bad Bunny song" },
  ];

  const nodes = defaultNodes.map((n, i) => ({
      ...n,
      ...(nodesData && nodesData[i] ? nodesData[i] : {})
  }));

  return (
    <div className="relative flex items-center justify-center w-full max-w-md h-80 bg-ehyo-dark/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
      
      {/* Central Word */}
      <div className="absolute z-10 bg-white text-ehyo-text w-24 h-24 rounded-full flex items-center justify-center font-serif text-xl font-bold shadow-lg ring-4 ring-ehyo-indigo/50">
        EhYo
      </div>

      {/* Orbiting Context Nodes */}
      {nodes.map((node, i) => {
          // -90 degrees offset to start at 12 o'clock
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const radius = 110; 
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius; // Inverted Y for CSS top

          const isActive = activeNode === i;

          return (
            <React.Fragment key={i}>
                {/* Connector Line */}
                <div 
                    className={`absolute top-1/2 left-1/2 h-0.5 origin-left transition-colors duration-500 ${isActive ? 'bg-ehyo-coral' : 'bg-white/10'}`}
                    style={{ 
                        width: `${radius}px`, 
                        transform: `rotate(${i * 90 - 90}deg)` 
                    }} 
                />

                {/* Node */}
                <motion.div
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-20 ${isActive ? 'bg-ehyo-coral border-ehyo-coral text-white scale-125 shadow-[0_0_20px_rgba(255,143,171,0.5)]' : 'bg-stone-800 border-stone-600 text-stone-400'}`}
                    style={{ 
                        left: `calc(44.5% + ${x}px)`,
                        top: `calc(42.5% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                    }}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                >
                    <node.icon size={20} />
                </motion.div>

                
            </React.Fragment>
          )
      })}

      
    </div>
  );
};