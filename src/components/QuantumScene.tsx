/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Stars, Environment, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingChar = ({ char, position, color, size = 1, rotation = [0, 0, 0] }: { char: string, position: [number, number, number], color: string, size?: number, rotation?: [number, number, number] }) => {
  return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
          <Html 
            transform={false} 
            position={position} 
            occlude="blending"
            style={{ 
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            center
          >
             <span className="font-serif font-bold whitespace-nowrap" style={{ color: color, fontSize: `${size * 2}rem`, opacity: 0.9 }}>
               {char}
             </span>
          </Html>
      </Float>
  )
}

const CulturalRing = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1) * 0.2;
       ref.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={ref}>
       <Torus args={[4, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
         <meshStandardMaterial color="#E6D3A3" emissive="#E6D3A3" emissiveIntensity={0.2} transparent opacity={0.4} />
       </Torus>
       
       <RingText text="Bonjour" angle={0} color="#C06C54" />
       <RingText text="Hola" angle={Math.PI / 4} color="#C06C54" />
       <RingText text="Hej" angle={5 * Math.PI / 7} color="#C06C54" />
       <RingText text="Olá" angle={7 * Math.PI / 4} color="#C06C54" />
    </group>
  );
}

const RingText = ({ text, angle, color }: { text: string, angle: number, color: string }) => {
    const radius = 4;
    // Calculate position on the ring
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Sine wave offset for weaving effect - z axis is "up/down" relative to the flat ring
    const zOffset = Math.sin(angle * 6) * 0.5;

    return (
        <group position={[x, y, zOffset]}>
             <Html center transform={false} occlude="blending" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                 <span className="font-serif text-2xl font-bold whitespace-nowrap opacity-90" style={{ color: color }}>
                     {text}
                 </span>
             </Html>
        </group>
    )
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#C06C54" />
        
        <CulturalRing />
        
        <group>
            {/* Background / Depth Elements */}
            <FloatingChar char="ㄅㄆㄇ" position={[-1.2, 3.2, -4]} color="#C06C54"  rotation={[0, 0, -0.2]} />
            <FloatingChar char="こんにちは" position={[1.2, -3.2, -4]} color="#C06C54"  rotation={[0, 0, 0.2]} />
            <FloatingChar char="식사하셨어요?" position={[-6, 3.2, -10]} color="#C06C54" rotation={[2, 1, 0]} />
            <FloatingChar char="出來𨑨迌" position={[-8, -1.8, -6]} color="#C06C54" rotation={[0, 0, 0]} />
            <FloatingChar char="Danke" position={[4, 3, -4]} color="#C06C54"  rotation={[0, 0, 4]} />
            <FloatingChar char="Ciao" position={[5, -2, -3]} color="#C06C54"  rotation={[0, 0, 0]} />
            <FloatingChar char="สวย" position={[-4, -3, -4]} color="#C06C54"  rotation={[0, 0, 1]} />
        </group>

        <Environment preset="city" />
        {/* Soft atmospheric particles */}
        <Stars radius={100} depth={50} count={300} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

// ... GlobeScene code remains same but keeping file complete
export const GlobeScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={1} />
        <Stars radius={100} depth={50} count={300} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}