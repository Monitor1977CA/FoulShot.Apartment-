/**
 * @file RarityBadge.tsx
 * @description A reusable component for displaying the rarity of a piece of evidence.
 * This component has been redesigned into a prominent "plaque" for maximum visual impact and readability.
 */

import React from 'react';
import { EvidenceRarity } from '../../types';
import { RARITY_CONFIG } from '../../config';

interface RarityBadgeProps {
  rarity: EvidenceRarity;
  className?: string;
}

const RarityBadge: React.FC<RarityBadgeProps> = React.memo(({ rarity, className }) => {
  const config = RARITY_CONFIG[rarity];

  if (!config) {
    return null;
  }

  // --- Redesigned "Plaque" Style ---
  // This new design is larger, more legible, and feels more significant,
  // addressing user feedback about readability and impact.
  return (
    <div
      className={`w-full text-center p-3 rounded-lg border-t-2 animate-fade-in ${className}`}
      style={{
        // Using inline styles for dynamic colors sourced from the config file.
        // A subtle gradient provides depth.
        background: `linear-gradient(to top, ${config.color}1A, ${config.color}05)`,
        borderColor: config.color,
      }}
    >
      <span
        className="font-oswald text-xl uppercase tracking-widest"
        style={{
          color: config.color,
          // Add a dark shadow for readability against any background.
          textShadow: `0 0 10px ${config.color}, 0 0 5px #000`, 
        }}
      >
        {config.label}
      </span>
    </div>
  );
});

export default RarityBadge;
