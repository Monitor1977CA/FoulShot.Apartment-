/**
 * @file TimelineEventList.tsx
 * @description A dedicated component for rendering the list of timeline events.
 * This component was extracted from `TimelineView.tsx` as part of an architectural
 * refactor to improve separation of concerns. Its only job is to render the list
 * of nodes and stacks. It now uses a custom hook to manage the "arrival" animation
 * for new evidence, keeping this component clean and focused.
 */
import React from 'react';
import { TimelineNode } from '../../hooks/useProcessedTimeline';
import TimelineEventNode from '../molecules/TimelineEventNode';
import TimelineEventStackNode from '../molecules/TimelineEventStackNode';
import { useTimelineArrival } from '../../hooks/useTimelineArrival';

interface TimelineEventListProps {
  timelineItems: TimelineNode[];
}

const TimelineEventList: React.FC<TimelineEventListProps> = ({ timelineItems }) => {
  // --- ARCHITECTURAL IMPROVEMENT: Custom Hook ---
  // The complex logic for scrolling to new items and managing animations is now
  // fully encapsulated in the `useTimelineArrival` hook. This keeps the component
  // clean and focused on rendering.
  const itemRefs = useTimelineArrival(timelineItems);

  return (
    <div className="flex-1 overflow-y-auto relative pt-2">
      {/* The central vertical spine of the timeline */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-brand-border/10 via-brand-border/50 to-brand-border/10"></div>

      {timelineItems.length > 1 // Show timeline if there's more than just the initial crime
        ? timelineItems.map((item, index) => {
            const id = item.type === 'single' ? item.data.id : item.data.anchor.id;
            const itemRef = (el: HTMLDivElement | null) => {
              if (el) {
                itemRefs.current.set(id, el);
              } else {
                itemRefs.current.delete(id);
              }
            };

            if (item.type === 'single') {
              return (
                <TimelineEventNode
                  ref={itemRef}
                  key={item.data.id}
                  evidence={item.data}
                  isLeft={index % 2 === 0}
                  isNew={item.isNew}
                />
              );
            } else {
              return (
                <TimelineEventStackNode
                  ref={itemRef}
                  key={item.data.anchor.id}
                  stack={item.data}
                  isLeft={index % 2 === 0}
                  isNew={item.isNew}
                />
              );
            }
          })
        : <p className="text-brand-text-muted text-center mt-8">No evidence found. Add items to the timeline to build your case.</p>}
    </div>
  );
};

export default TimelineEventList;
