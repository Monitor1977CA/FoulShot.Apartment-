/**
 * @file data/caseFileData.ts
 * @description This file contains the complete dataset for the new "Interactive Case File" feature.
 * It is structured to be self-contained and easily imported by the case file's Redux slice.
 */

import { CaseFileData, Clue } from '../types';

// This is the complete list of all clues that can be discovered for the case file.
// The application state will start with an empty `clues` array, and these will be
// added to it as the player discovers the corresponding evidence objects.
const allCaseFileClues: Clue[] = [
  // --- Motive Clues ---
  { id: 'clue-motive-primary', eventKey: 'MOTIVE_PRIMARY_PI_REPORT', text: "Private investigator photos show Malcolm Cole and Camille Halley in an intimate embrace.", type: 'PRIMARY', category: 'motive' },
  { id: 'clue-motive-support-1', eventKey: 'MOTIVE_SUPPORT_ARIEL_CUSTODY', text: "Digital custody papers show Malcolm was escalating the legal conflict with Ariel Cole.", type: 'SUPPORTING', category: 'motive' },
  { id: 'clue-motive-support-2', eventKey: 'MOTIVE_SUPPORT_TREVON_TRADE', text: "An internal memo confirms Malcolm blocked Trevon Ford's trade, creating a professional motive.", type: 'SUPPORTING', category: 'motive' },
  
  // --- Opportunity Clues ---
  { id: 'clue-opp-primary', eventKey: 'OPP_PRIMARY_NEIGHBOR_TRUCK', text: "Tire marks at the scene are consistent with a heavy truck, like Walter Halley's Ford F-150.", type: 'PRIMARY', category: 'opportunity' },
  
  // --- Means Clues ---
  { id: 'clue-means-primary', eventKey: 'MEANS_PRIMARY_9MM_CASINGS', text: "Five 9mm shell casings were found near the victim, indicating the murder weapon.", type: 'PRIMARY', category: 'means' },
  { id: 'clue-means-support-2', eventKey: 'MEANS_SUPPORT_TREVON_ALIBI', text: "CCTV footage and witness statements confirm Trevon Ford was at a nightclub during the incident.", type: 'SUPPORTING', category: 'means' },
  { id: 'clue-means-support-3', eventKey: 'MEANS_SUPPORT_ARIEL_GUN', text: "Ballistics confirm Ariel Cole's registered .380 ACP handgun was NOT the murder weapon.", type: 'SUPPORTING', category: 'means' },
];

// Export a Map for O(1) lookups. This is used by AssignSuspectModal to find the correct
// clue data to dispatch when a piece of evidence is processed.
export const caseFileCluesById = new Map<string, Clue>(allCaseFileClues.map(c => [c.id, c]));

// Define the structure of the timeline anchors and their slots.
// This defines the "board" for the puzzle.
export const caseFileData: CaseFileData = {
  title: "Foul Shot Case File",
  // The `clues` array in the initial state will be empty.
  clues: [], 
  anchors: [
    {
      id: 'motive',
      title: "The Motive",
      timeLabel: "Days Before The Incident",
      primarySlot: { slotId: 'motive-primary', correctEventKey: 'MOTIVE_PRIMARY_PI_REPORT', placedClueId: null },
      supportingSlots: [
        { slotId: 'motive-support-1', placedClueId: null },
        { slotId: 'motive-support-2', placedClueId: null },
      ]
    },
    {
      id: 'opportunity',
      title: "The Opportunity",
      timeLabel: "Night of The Incident, ~11:30 PM",
      primarySlot: { slotId: 'opportunity-primary', correctEventKey: 'OPP_PRIMARY_NEIGHBOR_TRUCK', placedClueId: null },
      supportingSlots: [
        { slotId: 'opportunity-support-1', placedClueId: null },
      ]
    },
    {
      id: 'means',
      title: "The Means",
      timeLabel: "The Act Itself",
      primarySlot: { slotId: 'means-primary', correctEventKey: 'MEANS_PRIMARY_9MM_CASINGS', placedClueId: null },
      supportingSlots: [
        { slotId: 'means-support-1', placedClueId: null },
        { slotId: 'means-support-2', placedClueId: null },
        { slotId: 'means-support-3', placedClueId: null },
      ]
    },
  ],
};