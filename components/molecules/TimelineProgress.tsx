import React from 'react';

interface CaseProgressProps {
  current: number;
  total: number;
  accusationThreshold: number;
}

/**
 * A major UI element that shows the player their overall progress in the case.
 * It displays a progress bar for total evidence found and a distinct marker
 * indicating when they have enough evidence to make an accusation.
 * This component was refactored from a milestone-based progress bar to this
 * more central, goal-oriented "Case Progress" view.
 */
const TimelineProgress: React.FC<CaseProgressProps> = React.memo(({ current, total, accusationThreshold }) => {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;
  const thresholdPosition = total > 0 ? (accusationThreshold / total) * 100 : 0;

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1 text-xs text-brand-text-muted font-oswald uppercase tracking-wider">
            <span>Case Progress</span>
            <span>{current} / {total} Evidence</span>
        </div>
        <div className="w-full bg-brand-surface rounded-full h-2.5 border border-brand-border relative overflow-hidden shadow-inner shadow-black/50">
        {/* Progress Fill */}
        <div
            className="bg-brand-primary h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
        />
        {/* Accusation Threshold Marker */}
        <div
            className="absolute top-0 h-full w-1 bg-white/80"
            style={{ left: `${thresholdPosition}%` }}
            title={`Accusation available at ${accusationThreshold} pieces of evidence`}
        />
        </div>
    </div>
  );
});

export default TimelineProgress;