/**
 * @file TimelineHeader.tsx
 * @description A dedicated component for rendering the header of the Timeline view.
 * This component was extracted from `TimelineView.tsx` as part of an architectural
 * refactor to improve separation of concerns and make the codebase more modular.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TimelineProgress from '../molecules/TimelineProgress';
import FilterButton from '../atoms/FilterButton';

interface TimelineHeaderProps {
  playerEvidenceCount: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = React.memo(({ playerEvidenceCount }) => {
  const { accusationThreshold, totalDiscoverableEvidence } = useSelector((state: RootState) => state.story);

  return (
    <div className="flex-shrink-0 mb-4">
      <h1 className="text-4xl font-oswald text-brand-accent mb-2 uppercase">Timeline</h1>
      
      {/* Master Case Progress Bar */}
      <div className="mb-4">
        <TimelineProgress 
          current={playerEvidenceCount} 
          total={totalDiscoverableEvidence} 
          accusationThreshold={accusationThreshold} 
        />
      </div>

      {/* Filter bar */}
      <div className="bg-brand-surface/50 p-1 rounded-lg flex space-x-1 border border-brand-border">
          <FilterButton
            label="All"
            isActive={true} // Always active since it's the only option
            onClick={() => {}} // No-op since there are no other filters
          />
      </div>
    </div>
  );
});

export default TimelineHeader;
