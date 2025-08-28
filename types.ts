/**
 * @file types.ts
 * @description This file contains all the core type definitions and interfaces used throughout the application.
 * It serves as the single source of truth for the data structures that model the story, characters, objects, and UI state.
 *
 * @architectural_pattern
 * The data model is designed around a **Component-Based Architecture**. Instead of creating monolithic `Character` or
 * `StoryObject` interfaces with dozens of optional properties, we use a flexible `components` array. Each item in
 * this array is a `DataComponent`, which is a self-contained, typed piece of data (e.g., a character's social media feed,
 * an object's purchase history).
 *
 * @pattern_benefits
 * - **Scalability:** To add a new type of clue or interaction (e.g., "email records"), a developer only needs to define
 *   a new props interface (e.g., `EmailProps`) and a new data component type (`{ type: 'email', props: ... } `). No
 *   changes are needed to the core `Character` or `StoryObject` types.
 * - **Decoupling:** The UI can be built to dynamically render features based on the `components` a character has.
 *   This prevents a tight coupling between the data structure and the presentation layer.
 * - **Maintainability:** Data is organized logically. Instead of a flat, confusing object, data is grouped by its
 *   functional domain, making it easier to read, understand, and debug.
 */

// --- Core UI & Navigation Types ---

/** Defines the main views the user can navigate to. */
export type ViewType = 'people' | 'locations' | 'timeline' | 'card';

/**
 * Defines the types of cards that can be displayed in detail.
 * 'evidenceGroup' is a special container for multiple objects found together.
 * 'collection' is a generic card type for displaying a collection of objects (e.g., phone logs).
 * 'dialogue' is the new unified card type for all interactive conversations (interviews and interrogations).
 */
export type CardType = 'character' | 'object' | 'location' | 'evidenceGroup' | 'socialMediaFeed' | 'mugshot' | 'collection' | 'dialogue';

// --- Gameplay & Story Logic Types ---

/**
 * Defines the possible classifications for a piece of evidence.
 */
export type TimelineTag = 'motive' | 'means' | 'opportunity';

/**
 * Defines the rarity tiers for a piece of evidence, using legal terminology.
 * This is central to the new economy and discovery loop.
 */
export type EvidenceRarity = 'irrelevant' | 'circumstantial' | 'material' | 'critical';

/**
 * Represents a clickable area on a location's image that links to another card.
 * These can be defined with static coordinates or be dynamically placed by AI analysis.
 */
export interface Hotspot {
  id: string;
  type?: 'investigate' | 'move'; // The type of interaction, influences the icon. 'investigate' is default.
  coords?: { top: string; left: string; width: string; height: string }; // Optional static coords
  targetCardId: string; // The ID of the card to navigate to
  targetCardType: CardType; // Can now point to an evidence group
  label: string; // The text displayed on the hotspot
  aiHint?: string; // An optional hint for the AI to locate the object
}

/**
 * Represents a piece of testimony or a formal statement from a character.
 */
export interface Testimony {
  id: string;
  title: string;
  content: string;
  sourceCharacterId: string;
}

/**
 * @deprecated The token economy feature has been removed, but this type is kept
 * to prevent compile errors from components that have not yet been deleted.
 */
export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
}

/** Represents a single entry in the timeline. */
export interface Evidence {
  id: string; // Unique ID for the timeline entry itself (e.g., 'ev-obj-hammer')
  cardId: string; // The ID of the Character or StoryObject it links to
  cardType: CardType;
  name: string;
  imagePrompt: string;
  timestampCollected: string;
  locationId: string;
}

// --- Component-Based Data Model ---
// This is the core of the scalable architecture. Instead of adding properties directly to
// Character or StoryObject, we add `DataComponent`s to their `components` array.

export type DataComponentType = 
  | 'socialMedia' 
  | 'phoneLog' 
  | 'cctv' 
  | 'records' 
  | 'file' 
  | 'purchaseInfo' 
  | 'interaction'
  | 'documentContent'
  | 'dialogue'
  | 'physicalCharacteristics';

/** A generic Data Component, forming the basis of the component-based architecture. */
export interface DataComponent {
  type: DataComponentType;
  props: any;
}

// --- Data Component Prop Interfaces ---

export interface PhysicalCharacteristics {
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  features: string;
}

export interface PurchaseInfo {
  brand?: string;
  model?: string;
  sku?: string;
  manufacturer?: string;
  receipts?: {
    vendor: string;
    date: string;
    price: number;
    imageUrl: string;
  }[];
}

export interface Interaction {
  type: 'phone_unlock' | 'safe_crack' | 'computer_login';
  prompt: string;
  solution: string;
}

export interface DocumentContent {
    title: string;
    sender?: string;
    recipient?: string;
    date?: string;
    subject?: string;
    body: string;
}

// --- Core Data Structures (Characters, Objects, Locations) ---

/** Represents a person in the story. */
export interface Character {
  id: string;
  name: string;
  age: string;
  occupation: string;
  imagePrompt: string;
  description: string;
  role: 'victim' | 'suspect' | 'witness';
  isSuspect: boolean;
  connections: {
    relatedPeople: { id: string, relationship: string }[];
    knownLocations: string[];
    associatedObjects: string[];
  };
  testimonyIds: string[];
  components: DataComponent[];
}

/** Represents an object, piece of evidence, or collectible in the story. */
export interface StoryObject {
  id: string;
  name: string;
  imagePrompt: string;
  description: string;
  timestamp: string;
  isEvidence: boolean;
  assignedToSuspectIds: string[];
  locationFoundId: string;
  rarity: EvidenceRarity;
  category: string;
  ownerCharacterId?: string;
  hasBeenUnlocked: boolean;
  costToUnlock?: number;
  components: DataComponent[];
  unidentifiedDescription?: string;
  tags?: TimelineTag[];
  metadata?: {
    unlocksCaseFileClueId?: string;
    timelineSummary?: string;
  };
  forensicDetails?: {
    analysis: string;
    findings?: string[];
    labNotes?: string;
  };
  isFullyAnalyzed?: boolean;
  forensicScan?: ForensicScanConfig;
  findingIds?: string[];
}

/** Represents a location in the game world. */
export interface Location {
  id: string;
  name: string;
  mapCoords: { top: string; left: string };
  imagePrompt: string;
  description: string;
  lastEventTimestamp: string;
  lastEventDescription: string;
  hotspots: Hotspot[];
  isInternal?: boolean;
  sceneSummary: string;
  detailedDescription?: string;
  associatedCharacterIds?: string[];
  propertyRecords?: {
    owner: string;
    lastSoldDate: string;
    lastSoldPrice: string;
    zoning?: string;
    notes?: string;
  };
   officialReportIds?: { id: string; type: CardType }[];
}

/** Represents a collection of objects found together. */
export interface EvidenceGroup {
  id: string;
  name: string;
  description: string;
  imagePrompt: string;
  objectIds: string[];
}

// --- Story & State Structure ---

/** High-level information about the story. */
export interface StoryInfo {
  mapImagePrompt: string;
  mapTitle: string;
  crimeSceneId: string;
}

/** The complete data structure for a story. */
export interface StoryData {
  title: string;
  storyInfo: StoryInfo;
  characters: Character[];
  objects: StoryObject[];
  locations: Location[];
  evidenceGroups: EvidenceGroup[];
  testimonies: Testimony[];
  canonicalTimeline: CanonicalTimeline | null;
  evidenceStacks?: EvidenceStack[];
}

// --- AI & Player Interaction Types ---

/** An enumeration of player actions for ADA's analysis. */
export enum PlayerAction {
  VIEW_CARD = 'VIEW_CARD',
  VIEW_LIST = 'VIEW_LIST',
  TOGGLE_SUSPECT = 'TOGGLE_SUSPECT',
  TAP_HOTSPOT = 'TAP_HOTSPOT',
  ASSIGN_EVIDENCE = 'ASSIGN_EVIDENCE',
  VIEW_SOCIAL_MEDIA_FEED = 'VIEW_SOCIAL_MEDIA_FEED',
  FILTER_TIMELINE = 'FILTER_TIMELINE',
}

/** Defines the "ground truth" for the case's solution. */
export interface CanonicalTimeline {
  culpritId: string;
  keyEvents: { objectId: string; description: string }[];
}

/** Represents a structured evaluation of the player's timeline. */
export interface TimelineEvaluation {
    verdict: 'Case Accepted' | 'Case Weak' | 'Case Rejected';
    score: number;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
}

/** Represents a group of related evidence items for timeline stacking. */
export interface EvidenceStack {
  anchorId: string;
  linkedIds: string[];
  totalSlots: number;
}

// --- Dialogue & Interrogation System Types ---

/** A key insight or lead discovered during dialogue. */
export interface Insight {
    justification: string;
    newLead: string;
}

/** A single piece of dialogue text from the AI. */
export interface DialogueChunkData {
    id: string;
    text: string;
    isCriticalClue?: boolean;
    insight?: Insight;
}

/** A full response from the witness/suspect AI. */
export interface WitnessResponse {
    sender: 'witness';
    chunks: DialogueChunkData[];
}

/** A line of inquiry for an interrogation. */
export interface LineOfInquiryData {
    id: string;
    label: string;
    initialQuestions: string[];
}

/** The complete data for a character's dialogue component. */
export interface DialogueData {
    mode: 'interview' | 'interrogation';
    buttonText: string;
    persona: string;
    slideshowPrompts: string[];
    interrogation?: {
        linesOfInquiry: LineOfInquiryData[];
    };
    openingStatement?: string;
    suggestedQuestions?: string[];
}

/** Represents ADA's real-time feedback during an interrogation. */
export interface ActiveFeedback {
  text: string;
  progressChange: number;
  source: 'question' | 'evidence';
}

// --- Forensic Lens & Latent Connection Types ---

/** The data for a new StoryObject created from a forensic scan. */
export type ForensicFindingData = Omit<StoryObject, 'id' | 'isEvidence' | 'assignedToSuspectIds' | 'components' | 'hasBeenUnlocked' | 'costToUnlock' | 'unidentifiedDescription' | 'forensicDetails' | 'isFullyAnalyzed' | 'forensicScan' | 'findingIds'>;

/** A single scannable point of interest in the Forensic Lens view. */
export interface ForensicTrace {
    id: string;
    label: string;
    coords: { x: number; y: number; radius: number };
    finding?: ForensicFindingData;
    linkToObjectIds?: string[];
    scanGroupId?: string;
}

/** A group of related traces that must all be scanned to unlock a finding. */
export interface ScanGroup {
  id: string;
  requiredScans: number;
  finding: ForensicFindingData;
  linkToObjectIds: string[];
}

/** The configuration for an object's scannable properties. */
export interface ForensicScanConfig {
  traces: ForensicTrace[];
  groups?: ScanGroup[];
}

/** Represents a connection between a forensic finding and another piece of evidence. */
export interface LatentConnection {
    id: string;
    sourceObjectId: string;
    finding: StoryObject; // The new object that was created
    unresolvedTargetIds: string[];
    isResolved: boolean;
}

// --- Interactive Case File Types ---
export type CaseFileViewMode = 'workspace' | 'evidence_pool';
export type TimelineAnchorCategory = TimelineTag;

export interface Clue {
  id: string;
  eventKey: string;
  text: string;
  type: 'PRIMARY' | 'SUPPORTING';
  category: TimelineAnchorCategory;
}

export interface EvidenceSlot {
  slotId: string;
  correctEventKey?: string;
  placedClueId: string | null;
}

export interface TimelineAnchor {
  id: TimelineAnchorCategory;
  title: string;
  timeLabel: string;
  primarySlot: EvidenceSlot;
  supportingSlots: EvidenceSlot[];
}

export interface CaseFileData {
  title: string;
  clues: Clue[];
  anchors: TimelineAnchor[];
}

// --- System & Debugging Types ---

/** Represents a single entry in the error log. */
export interface ErrorLogEntry {
    id: string;
    message: string;
    stack?: string;
    timestamp: string;
}