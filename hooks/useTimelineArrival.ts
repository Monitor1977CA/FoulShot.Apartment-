/**
 * @file hooks/useTimelineArrival.ts
 * @description A custom hook to manage the "arrival" animation and scroll-to-view
 *              behavior for newly added items on the timeline.
 *
 * @architectural_decision
 * This logic is complex, involving refs, timeouts, and Redux dispatches. Encapsulating it
 * within a dedicated hook keeps the `TimelineEventList` component clean and focused on its
 * primary responsibility: rendering the list. This improves readability, maintainability,
 * and makes the arrival logic reusable if needed elsewhere.
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { clearNewlyAddedEvidenceIds } from '../store/uiSlice';
import { TimelineNode } from './useProcessedTimeline';
import { UI_CONFIG } from '../config';

/**
 * Manages the "arrival" UX for new timeline items.
 * @param {TimelineNode[]} timelineItems - The array of items currently displayed on the timeline.
 * @returns A map of refs that should be attached to the rendered node elements.
 */
export const useTimelineArrival = (timelineItems: TimelineNode[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const newlyAddedEvidenceIds = useSelector((state: RootState) => state.ui.newlyAddedEvidenceIds);
  
  // Use a ref to store a map of item IDs to their DOM elements.
  const itemRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  useEffect(() => {
    // Only run the effect if there are new items to process.
    if (newlyAddedEvidenceIds.length === 0 || timelineItems.length === 0) {
      return;
    }

    // Find the first "new" item in the current timeline view.
    const firstNewItem = timelineItems.find(item => item.isNew);
    if (firstNewItem) {
      // The ID is the evidence ID for single nodes, and the anchor's evidence ID for stacks.
      const id = firstNewItem.type === 'single'
        ? firstNewItem.data.id
        : firstNewItem.data.anchor.id;
        
      const node = itemRefs.current.get(id);

      if (node) {
        // Scroll the new item into view smoothly.
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // After a delay (allowing the animation to play), clear the "new" status.
        const timer = setTimeout(() => {
          dispatch(clearNewlyAddedEvidenceIds());
        }, UI_CONFIG.ARRIVAL_ANIMATION_DURATION);

        return () => clearTimeout(timer);
      }
    }
  }, [newlyAddedEvidenceIds, timelineItems, dispatch]);

  return itemRefs;
};
