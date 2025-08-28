/**
 * @file SparkleEffect.tsx
 * @description A component that creates a dynamic, cascading sparkle particle effect to visually enhance an element.
 */
import React from 'react';
import { RARITY_CONFIG } from '../../config';
import { EvidenceRarity } from '../../types';

interface SparkleEffectProps {
  rarity: EvidenceRarity;
}

/**
 * A single sparkle particle with randomized animation properties.
 */
const Sparkle: React.FC<{ color: string }> = ({ color }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 20 + 80}%`, // Start at the bottom 20%
    animationDuration: `${Math.random() * 2 + 1.5}s`, // 1.5s to 3.5s
    animationDelay: `${Math.random() * 2}s`, // 0s to 2s
    backgroundColor: color,
  };
  return <div className="absolute w-1 h-1 rounded-full animate-[sparkle]" style={style}></div>;
};

/**
 * Generates a field of sparkles with a color based on the provided evidence rarity.
 */
const SparkleEffect: React.FC<SparkleEffectProps> = ({ rarity }) => {
  const config = RARITY_CONFIG[rarity];
  const color = config ? config.color : '#FFFFFF';
  const sparkles = Array.from({ length: 15 }); // Number of sparkles

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {sparkles.map((_, i) => (
        <Sparkle key={i} color={color} />
      ))}
    </div>
  );
};

export default SparkleEffect;
