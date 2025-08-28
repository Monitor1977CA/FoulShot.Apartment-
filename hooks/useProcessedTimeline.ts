/**
 * @file hooks/useProcessedTimeline.ts
 * @description This custom hook encapsulates the complex logic for processing the evidence
 * timeline. It handles filtering by suspect, grouping evidence into stacks, and sorting
 * the final list chronologically.
 *
 * @architectural_decision
 * By extracting this logic from `TimelineView.tsx`, we adhere to the single-responsibility principle.
 * The `TimelineView` can now focus on layout and user interaction, while this hook focuses purely
 * on data transformation. This makes both pieces of code easier to understand, test, and maintain.
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectAllEvidenceWithDetails, selectEvidenceStacks, selectObjectEntities } from '../store/storySlice';
import { Character, Evidence, StoryObject } from '../types';

// Define the types for the processed timeline items.
export type EvidenceWithDetails = Evidence & { details: Character | StoryObject | undefined };

export type TimelineNode =
  | { type: 'single'; data: EvidenceWithDetails; isNew?: boolean; }
  | { type: 'stack'; data: { anchor: EvidenceWithDetails; linked: EvidenceWithDetails[]; totalSlots: number }; isNew?: boolean; };

/**
 * A custom hook that processes the evidence list into a display-ready timeline format.
 * @returns {{ processedTimelineItems: TimelineNode[] }}
 *          An object containing the structured nodes for rendering the timeline.
 */
export const useProcessedTimeline = () => {
  const allEvidence = useSelector(selectAllEvidenceWithDetails) as EvidenceWithDetails[];
  const objectEntities = useSelector(selectObjectEntities);
  const evidenceStacks = useSelector(selectEvidenceStacks);
  const newlyAddedEvidenceIds = useSelector((state: RootState) => state.ui.newlyAddedEvidenceIds);

  const { processedTimelineItems } = useMemo((): {
    processedTimelineItems: TimelineNode[];
  } => {
    // This hook transforms the raw evidence list into a display-ready format through a clear pipeline:
    // 1. Stack: Groups related evidence into 'stack' nodes according to `evidenceStacks` data.
    // 2. Add Singles: Adds all remaining, non-stacked evidence as 'single' nodes.
    // 3. Sort & Flag: Sorts the final list chronologically and flags new items for animation.
    
    const filteredEvidence = allEvidence;

    // If there are no defined stacks, we can take a fast path.
    if (!evidenceStacks || evidenceStacks.length === 0) {
      const items = filteredEvidence.map(e => ({ type: 'single' as const, data: e, isNew: newlyAddedEvidenceIds.includes(e.id) }));
      return {
        processedTimelineItems: items,
      };
    }

    // Process stacks and single items.
    const processedIds = new Set<string>();
    const items: TimelineNode[] = [];
    const evidenceMap = new Map(filteredEvidence.map(e => [e.cardId, e]));
    
    // First, iterate through defined stacks to find matches in the filtered evidence.
    for (const stack of evidenceStacks) {
      const anchorEvidence = evidenceMap.get(stack.anchorId);
      if (anchorEvidence) {
        const linkedEvidence = stack.linkedIds
          .map(id => evidenceMap.get(id))
          .filter((e): e is EvidenceWithDetails => !!e);

        // A stack is only formed if both the anchor and at least one linked item are present in the filtered evidence.
        if (linkedEvidence.length > 0) {
          const allIdsInStack = [anchorEvidence.id, ...linkedEvidence.map(e => e.id)];
          const isNew = allIdsInStack.some(id => newlyAddedEvidenceIds.includes(id));
          
          items.push({ type: 'stack', data: { anchor: anchorEvidence, linked: linkedEvidence, totalSlots: stack.totalSlots }, isNew });

          processedIds.add(anchorEvidence.id); // Use the evidence's unique timeline ID.
          linkedEvidence.forEach(e => processedIds.add(e.id));
        }
      }
    }

    // Then, add any remaining single items that weren't part of a stack.
    for (const evidence of filteredEvidence) {
      if (!processedIds.has(evidence.id)) {
        items.push({ type: 'single', data: evidence, isNew: newlyAddedEvidenceIds.includes(evidence.id) });
      }
    }

    // Sort the final mixed list of single items and stacks chronologically.
    items.sort((a, b) => {
      const dateA = new Date(a.type === 'stack' ? a.data.anchor.timestampCollected : a.data.timestampCollected);
      const dateB = new Date(b.type === 'stack' ? b.data.anchor.timestampCollected : b.data.timestampCollected);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      processedTimelineItems: items,
    };

  }, [allEvidence, evidenceStacks, objectEntities, newlyAddedEvidenceIds]);

  return { processedTimelineItems };
};