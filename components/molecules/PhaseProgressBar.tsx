/**
 * @file PhaseProgressBar.tsx
 * @description A reusable progress bar for displaying progress toward a single phase objective.
 */
import React from 'react';

interface PhaseProgressBarProps {
  value: number;
  goal: number;
}

const PhaseProgressBar: React.FC<PhaseProgressBarProps> = ({ value, goal }) => {
  const progressPercent = Math.min(100, (value / goal) * 100);
  const isComplete = value >= goal;

  return (
    <div className="w-full flex items-center gap-3">
        <div className="w-full bg-black/50 rounded-full h-2.5 border border-brand-border relative overflow-hidden shadow-inner shadow-black/50">
            <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${isComplete ? 'bg-green-500' : 'bg-brand-primary'}`}
                style={{ width: `${progressPercent}%` }}
            />
        </div>
        <span className="font-mono text-sm text-brand-text-muted font-bold">{value}/{goal}</span>
    </div>
  );
};

export default PhaseProgressBar;