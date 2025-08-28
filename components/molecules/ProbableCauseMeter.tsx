import React from 'react';

interface ProbableCauseMeterProps {
  value: number; // Assume this is a percentage from 0-100
  goalName: string;
}

const ProbableCauseMeter: React.FC<ProbableCauseMeterProps> = ({ value, goalName }) => {
  const progressPercent = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full space-y-1">
        <div className="flex justify-between items-baseline">
            <span className="font-oswald text-sm uppercase text-brand-text-muted tracking-wider">{goalName}</span>
            <span className="font-mono text-lg text-white font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-3 border border-brand-border relative overflow-hidden shadow-inner shadow-black/50">
            <div
                className="bg-brand-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
            />
        </div>
    </div>
  );
};

export default ProbableCauseMeter;
