import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { CardType } from '../types';
import { addTimelineMessage } from '../store/uiSlice';
import { useMemo } from 'react';
import { selectObjectIds, selectLocationIds, selectEvidenceGroupIds, selectCharacterIds } from '../store/storySlice';

type Resolved = { id: string; type: CardType | 'evidenceGroup' | 'character'; source: 'declared' | 'corrected' };

// A small hook that centralizes logic to resolve a card target id + declared type to an actual in-game card type.
// Returns a resolve function: (targetId, declaredType, announce?) => Resolved | null
export default function useCardResolver() {
  const dispatch = useDispatch<AppDispatch>();

  // Use memoized selectors that return stable arrays when entities do not change
  const objectIdsArr = useSelector((s: RootState) => selectObjectIds(s));
  const locationIdsArr = useSelector((s: RootState) => selectLocationIds(s));
  const evidenceGroupIdsArr = useSelector((s: RootState) => selectEvidenceGroupIds(s));
  const characterIdsArr = useSelector((s: RootState) => selectCharacterIds(s));

  const objectIds = useMemo(() => new Set(objectIdsArr), [objectIdsArr]);
  const locationIds = useMemo(() => new Set(locationIdsArr), [locationIdsArr]);
  const evidenceGroupIds = useMemo(() => new Set(evidenceGroupIdsArr), [evidenceGroupIdsArr]);
  const characterIds = useMemo(() => new Set(characterIdsArr), [characterIdsArr]);

  const resolve = (targetId?: string, declaredType?: string, announce: boolean = true): Resolved | null => {
    if (!targetId) return null;

    // Check declared type first
    if (declaredType === 'object' && objectIds.has(targetId)) {
      return { id: targetId, type: 'object', source: 'declared' };
    }
    if (declaredType === 'location' && locationIds.has(targetId)) {
      return { id: targetId, type: 'location', source: 'declared' };
    }
    if (declaredType === 'evidenceGroup' && evidenceGroupIds.has(targetId)) {
      return { id: targetId, type: 'evidenceGroup', source: 'declared' };
    }
    if (['socialMediaFeed', 'mugshot', 'collection', 'dialogue'].includes(declaredType || '') && characterIds.has(targetId)) {
      return { id: targetId, type: 'character', source: 'declared' };
    }

    // Auto-correct by searching other collections
    if (objectIds.has(targetId)) {
      const res: Resolved = { id: targetId, type: 'object', source: 'corrected' };
      if (announce) dispatch(addTimelineMessage(`Developer: Hotspot auto-corrected — ${targetId} resolved as object (declared ${declaredType})`));
      return res;
    }
    if (locationIds.has(targetId)) {
      const res: Resolved = { id: targetId, type: 'location', source: 'corrected' };
      if (announce) dispatch(addTimelineMessage(`Developer: Hotspot auto-corrected — ${targetId} resolved as location (declared ${declaredType})`));
      return res;
    }
    if (evidenceGroupIds.has(targetId)) {
      const res: Resolved = { id: targetId, type: 'evidenceGroup', source: 'corrected' };
      if (announce) dispatch(addTimelineMessage(`Developer: Hotspot auto-corrected — ${targetId} resolved as evidenceGroup (declared ${declaredType})`));
      return res;
    }
    if (characterIds.has(targetId)) {
      const res: Resolved = { id: targetId, type: 'character', source: 'corrected' };
      if (announce) dispatch(addTimelineMessage(`Developer: Hotspot auto-corrected — ${targetId} resolved as character (declared ${declaredType})`));
      return res;
    }

    if (announce) dispatch(addTimelineMessage(`Developer: Hotspot blocked — target not found (${targetId}, declared ${declaredType})`));
    return null;
  };

  return resolve;
}
