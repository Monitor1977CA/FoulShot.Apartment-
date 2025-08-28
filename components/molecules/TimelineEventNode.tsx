/**
 * @file TimelineEventNode.tsx
 * @description Renders a single, non-stacked event on the timeline.
 * This component has been refactored to use the generic `TimelineNodeWrapper`
 * for its layout, keeping it focused on rendering the `TimelineEventCard`.
 */
import React, { useState } from 'react';
import TimelineEventCard from './TimelineEventCard';
import TimelineNodeWrapper from './TimelineNodeWrapper';
import { selectAllEvidenceWithDetails } from '../../store/storySlice';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface TimelineEventNodeProps {
  evidence: EvidenceWithDetails;
  isLeft: boolean;
  isNew?: boolean;
}

const TimelineEventNode = React.forwardRef<HTMLDivElement, TimelineEventNodeProps>(
  ({ evidence, isLeft, isNew }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isInteractive = evidence.id !== 'ev-initial-crime';

    const handleNodeClick = () => {
      if (isInteractive) {
        setIsExpanded(prev => !prev);
      }
    };

    return (
      <TimelineNodeWrapper
        ref={ref}
        isLeft={isLeft}
        isExpanded={isExpanded}
        onClick={handleNodeClick}
        isInteractive={isInteractive}
        hasHighlight={false}
        isNew={isNew}
      >
        <TimelineEventCard 
          evidence={evidence} 
          isExpanded={isExpanded} 
        />
      </TimelineNodeWrapper>
    );
  }
);

export default TimelineEventNode;
