/**
 * @file store/caseFileSlice.ts
 * @description This Redux slice manages all state for the new "Interactive Case File" feature.
 * It's designed to be a self-contained module for the core puzzle gameplay loop.
 */

import { createSlice, PayloadAction, createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { caseFileData } from '../data/caseFileData';
import { Clue, EvidenceSlot, CaseFileViewMode, TimelineAnchorCategory, TimelineAnchor } from '../types';
import { RootState } from './index';

// Use entity adapters for efficient, normalized state management of clues and slots.
const cluesAdapter = createEntityAdapter<Clue>();
const slotsAdapter = createEntityAdapter<EvidenceSlot, string>({
  selectId: (slot) => slot.slotId,
});

// Define the shape of the state for this slice.
interface CaseFileState {
  viewMode: CaseFileViewMode;
  activeTab: TimelineAnchorCategory;
  clues: EntityState<Clue, string>;
  slots: EntityState<EvidenceSlot, string>;
  anchors: TimelineAnchor[];
  lastIncorrectSlotId: string | null;
}

// Function to create the initial state from the static case file data.
const createInitialState = (): CaseFileState => {
  const allSlots = caseFileData.anchors.flatMap(anchor => [anchor.primarySlot, ...anchor.supportingSlots]);

  return {
    viewMode: 'workspace',
    activeTab: 'motive',
    // The `clues` state starts empty; clues are added as they are discovered.
    clues: cluesAdapter.getInitialState(),
    slots: slotsAdapter.setAll(slotsAdapter.getInitialState(), allSlots),
    anchors: caseFileData.anchors,
    lastIncorrectSlotId: null,
  };
};

const initialState: CaseFileState = createInitialState();

const caseFileSlice = createSlice({
  name: 'caseFile',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<CaseFileViewMode>) {
      state.viewMode = action.payload;
    },
    setActiveTab(state, action: PayloadAction<TimelineAnchorCategory>) {
      state.activeTab = action.payload;
    },
    placeClueInSlot(state, action: PayloadAction<{ clueId: string, slotId: string }>) {
      const { clueId, slotId } = action.payload;

      const clue = state.clues.entities[clueId];
      const slot = state.slots.entities[slotId];
      const anchor = state.anchors.find(a => a.id === state.activeTab);

      if (!clue || !slot || !anchor) return;

      let isCorrect = false;
      // Placement logic for a PRIMARY clue
      if (clue.type === 'PRIMARY') {
        // Must be the primary slot and the event keys must match.
        if (slot.slotId === anchor.primarySlot.slotId && slot.correctEventKey === clue.eventKey) {
          isCorrect = true;
        }
      // Placement logic for a SUPPORTING clue
      } else if (clue.type === 'SUPPORTING') {
        // Must be a supporting slot, the categories must match, and the primary must be filled.
        const primarySlotFilled = !!state.slots.entities[anchor.primarySlot.slotId]?.placedClueId;
        const isSupportingSlot = anchor.supportingSlots.some(s => s.slotId === slotId);
        
        // A supporting clue can be placed in any empty supporting slot of the correct category.
        if (primarySlotFilled && isSupportingSlot && clue.category === anchor.id) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        slotsAdapter.updateOne(state.slots, { id: slotId, changes: { placedClueId: clueId } });
        state.lastIncorrectSlotId = null;
      } else {
        // Incorrect placement, set the slot ID to trigger shake animation.
        state.lastIncorrectSlotId = slotId;
      }
    },
    clearLastIncorrectSlot(state) {
      state.lastIncorrectSlotId = null;
    },
    resetInvestigation(state) {
      // Return to the initial state
      return createInitialState();
    },
    /**
     * Adds a newly discovered clue to the evidence pool for the case file.
     * @param {Clue} action.payload The clue object to add.
     */
    addUnlockedClue(state, action: PayloadAction<Clue>) {
      // Use `addOne` to prevent duplicates if the same evidence is processed multiple times.
      cluesAdapter.addOne(state.clues, action.payload);
    },
  },
});

export const {
  setViewMode,
  setActiveTab,
  placeClueInSlot,
  clearLastIncorrectSlot,
  resetInvestigation,
  addUnlockedClue,
} = caseFileSlice.actions;

// --- Base Selectors ---
export const selectCaseFileState = (state: RootState) => state.caseFile;
export const selectAnchors = (state: RootState) => state.caseFile.anchors;

// --- Entity Selectors ---
export const {
  selectAll: selectAllClues,
  selectById: selectClueById,
  selectEntities: selectClueEntities,
} = cluesAdapter.getSelectors((state: RootState) => state.caseFile.clues);

export const {
  selectAll: selectAllSlots,
  selectById: selectSlotById,
  selectEntities: selectSlotEntities,
} = slotsAdapter.getSelectors((state: RootState) => state.caseFile.slots);

// --- Memoized, Derived Selectors ---

/** Selects the currently active anchor (Motive, Means, or Opportunity) based on the activeTab. */
export const selectActiveAnchor = createSelector(
  [selectAnchors, (state: RootState) => state.caseFile.activeTab],
  (anchors, activeTab) => anchors.find(a => a.id === activeTab)
);

/** Selects only the clues that have not yet been placed in any slot. */
export const selectUnplacedClues = createSelector(
  [selectAllClues, selectAllSlots],
  (allClues, allSlots) => {
    const placedClueIds = new Set(allSlots.map(slot => slot.placedClueId).filter(Boolean));
    return allClues.filter(clue => !placedClueIds.has(clue.id));
  }
);

/** Checks if the primary slot for the currently active anchor is filled. */
export const selectIsPrimarySlotFilledForActiveAnchor = createSelector(
  [selectActiveAnchor, selectSlotEntities],
  (anchor, slots) => {
    if (!anchor) return false;
    return !!slots[anchor.primarySlot.slotId]?.placedClueId;
  }
);

/** Checks if all primary slots across all anchors have been correctly filled. */
export const selectIsInvestigationComplete = createSelector(
    [selectAnchors, selectSlotEntities],
    (anchors, slots) => {
        // The investigation is complete if every primary slot has a clue.
        return anchors.every(anchor => !!slots[anchor.primarySlot.slotId]?.placedClueId);
    }
);

export default caseFileSlice.reducer;