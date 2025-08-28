/**
 * @file TimelineEventStackNode.tsx
 * @description Renders a stack of related evidence on the timeline.
 * This component has been refactored to use the generic `TimelineNodeWrapper`
 * for its layout, keeping it focused on rendering the `TimelineEventStackCard`.
 */
import React, { useState } from 'react';
import TimelineEventStackCard from './TimelineEventStackCard';
import TimelineNodeWrapper from './TimelineNodeWrapper';
import { selectAllEvidenceWithDetails } from '../../store/storySlice';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface TimelineEventStackNodeProps {
  stack: {
    anchor: EvidenceWithDetails;
    linked: EvidenceWithDetails[];
    totalSlots: number;
  };
  isLeft: boolean;
  isNew?: boolean;
}

const TimelineEventStackNode = React.forwardRef<HTMLDivElement, TimelineEventStackNodeProps>(
  ({ stack, isLeft, isNew }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleNodeClick = () => {
      setIsExpanded(prev => !prev);
    };

    return (
      <TimelineNodeWrapper
        ref={ref}
        isLeft={isLeft}
        isExpanded={isExpanded}
        onClick={handleNodeClick}
        isInteractive={true}
        hasHighlight={false}
        isNew={isNew}
      >
        <TimelineEventStackCard
          anchor={stack.anchor}
          linked={stack.linked}
          totalSlots={stack.totalSlots}
          isExpanded={isExpanded}
        />
      </TimelineNodeWrapper>
    );
  }
);

export default TimelineEventStackNode;