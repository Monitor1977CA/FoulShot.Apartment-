/**
 * @file store/storySlice.ts
 * @description This Redux slice manages the core data of the story.
 * It uses Redux Toolkit's `createEntityAdapter` to maintain a normalized state
 * for all primary data types (characters, objects, etc.), which is efficient for data lookups and updates.
 * It also includes a robust, high-performance, concurrent batching system for image generation
 * to prevent API rate limiting while maximizing speed.
 */

import { createSlice, PayloadAction, createSelector, createAsyncThunk, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { storyData } from '../data/story';
import { introSlideshowData } from '../data/introSlideshowData';
import { Character, StoryObject, Evidence, CardType, Location, Testimony, StoryInfo, EvidenceGroup, CanonicalTimeline, EvidenceStack, DialogueChunkData, LatentConnection, Bounty, TimelineTag } from '../types';
import { RootState, AppDispatch } from './index';
import { generateImage as generateImageAPI } from '../services/geminiService';
import { dbService, b64toBlob } from '../services/dbService';
import { GAME_MECHANICS, API_CONFIG } from '../config';
import { logError } from './errorLogSlice';
import { v4 as uuidv4 } from 'uuid';
import { showModal } from './uiSlice';


// --- Image Generation Queue System ---

/** Interface for a single image generation request in the queue. */
interface ImageGenerationRequest {
  cardId: string;
  prompt: string;
  colorTreatment: 'monochrome' | 'selectiveColor' | 'map';
}

// --- Entity Adapters ---
const charactersAdapter = createEntityAdapter<Character>();
const objectsAdapter = createEntityAdapter<StoryObject>();
const locationsAdapter = createEntityAdapter<Location>();
const evidenceGroupsAdapter = createEntityAdapter<EvidenceGroup>();
const testimoniesAdapter = createEntityAdapter<Testimony>();
const bountiesAdapter = createEntityAdapter<Bounty>();
const latentConnectionsAdapter = createEntityAdapter<LatentConnection>();

// --- State Interface ---
interface StoryState {
  title: string;
  storyInfo: StoryInfo;
  // FIX: EntityState requires a second type argument for the ID type. All IDs in this app are strings.
  characters: EntityState<Character, string>;
  objects: EntityState<StoryObject, string>;
  locations: EntityState<Location, string>;
  evidenceGroups: EntityState<EvidenceGroup, string>;
  testimonies: EntityState<Testimony, string>;
  canonicalTimeline: CanonicalTimeline | null;
  evidenceStacks: EvidenceStack[];
  bounties: EntityState<Bounty, string>;
  latentConnections: EntityState<LatentConnection, string>;
  evidence: Evidence[];
  imageUrls: { [id: string]: string };
  imageErrors: { [id: string]: boolean };
  imageLoading: { [id: string]: boolean };
  imageGenerationQueue: ImageGenerationRequest[];
  isQueueProcessing: boolean;
  hasDiscoveredPaint: boolean;
  dynamicHotspotCoords: { [locationId: string]: { [hotspotId: string]: { x: number; y: number } } };
  milestoneThreshold: number;
  accusationThreshold: number;
  totalDiscoverableEvidence: number;
  playerTokens: number;
}

const initialState: StoryState = {
  title: storyData.title,
  storyInfo: storyData.storyInfo,
  characters: charactersAdapter.setAll(charactersAdapter.getInitialState(), storyData.characters),
  objects: objectsAdapter.setAll(objectsAdapter.getInitialState(), storyData.objects),
  locations: locationsAdapter.setAll(locationsAdapter.getInitialState(), storyData.locations),
  evidenceGroups: evidenceGroupsAdapter.setAll(evidenceGroupsAdapter.getInitialState(), storyData.evidenceGroups),
  testimonies: testimoniesAdapter.setAll(testimoniesAdapter.getInitialState(), storyData.testimonies),
  canonicalTimeline: storyData.canonicalTimeline,
  evidenceStacks: storyData.evidenceStacks || [],
  bounties: bountiesAdapter.getInitialState(),
  latentConnections: latentConnectionsAdapter.getInitialState(),
  evidence: [],
  imageUrls: {},
  imageErrors: {},
  imageLoading: {},
  imageGenerationQueue: [],
  isQueueProcessing: false,
  hasDiscoveredPaint: false,
  dynamicHotspotCoords: {},
  milestoneThreshold: GAME_MECHANICS.MILESTONE_THRESHOLD,
  accusationThreshold: GAME_MECHANICS.ACCUSATION_THRESHOLD,
  totalDiscoverableEvidence: storyData.objects.filter(o => o.rarity !== 'irrelevant').length,
  playerTokens: 100, // Starting tokens for playtesting
};

/**
 * An async thunk to hydrate the image URL cache from IndexedDB on app startup.
 * This loads previously generated images without needing to call the API again.
 */
export const hydrateImageCache = createAsyncThunk(
  'story/hydrateImageCache',
  async (_, { dispatch, getState }) => {
    try {
      const cachedImages = await dbService.getAllImages();
      const urls: { [id: string]: string } = {};
      const existingUrls = (getState() as RootState).story.imageUrls;

      for (const item of cachedImages) {
        // --- CRITICAL FIX: Idempotent Hydration ---
        // This check prevents a race condition where a pre-existing image URL
        // from the initial state could be overwritten by a new
        if (!existingUrls[item.id] && item.blob) {
            urls[item.id] = URL.createObjectURL(item.blob);
        }
      }
      return urls;
    } catch (error) {
      dispatch(logError({ message: 'Failed to hydrate image cache from IndexedDB.', stack: (error as Error).stack }));
      return {};
    }
  }
);

export const processImageGenerationQueue = createAsyncThunk(
    'story/processImageGenerationQueue',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;
        if (state.story.isQueueProcessing || state.story.imageGenerationQueue.length === 0) {
            return;
        }

        dispatch(storySlice.actions.setIsQueueProcessing(true));

        const queue = [...state.story.imageGenerationQueue];
        const requestsToProcess = queue.slice(0, API_CONFIG.CONCURRENT_REQUEST_LIMIT);
        const remainingRequests = queue.slice(API_CONFIG.CONCURRENT_REQUEST_LIMIT);

        dispatch(storySlice.actions.setImageGenerationQueue(remainingRequests));

        const promises = requestsToProcess.map(async (request) => {
            try {
                const result = await generateImageAPI(request.prompt, request.colorTreatment);
                if (result) {
                    const blob = b64toBlob(result.bytes, result.mimeType);
                    await dbService.saveImage(request.cardId, blob);
                    const url = URL.createObjectURL(blob);
                    return { cardId: request.cardId, url, error: false };
                }
                return { cardId: request.cardId, url: null, error: true };
            } catch (error) {
                dispatch(logError({ message: `Image generation failed for ${request.cardId}`, stack: (error as Error).stack }));
                return { cardId: request.cardId, url: null, error: true };
            }
        });

        const results = await Promise.all(promises);
        dispatch(storySlice.actions.updateImageCache(results));
        
        dispatch(storySlice.actions.setIsQueueProcessing(false));

        if (remainingRequests.length > 0) {
            setTimeout(() => dispatch(processImageGenerationQueue()), API_CONFIG.IMAGE_QUEUE_BATCH_DELAY);
        }
    }
);

export const preloadKeyStoryAssets = createAsyncThunk(
  'story/preloadKeyStoryAssets',
  async (_, { getState, dispatch }) => {
      const state = getState() as RootState;
      
      // --- QUOTA OPTIMIZATION ---
      // To significantly reduce the number of initial image generation calls and conserve API quota,
      // we now preload only the most essential assets for the game to start.
      // Other images will be generated on-demand as the user navigates.
      
      const storyInfo = selectStoryInfo(state);
      const victim = selectVictims(state)[0]; // Assuming there's always one victim
      const crimeScene = selectLocationById(state, storyInfo.crimeSceneId);

      // 1. Queue the victim's image
      if (victim) {
        dispatch(storySlice.actions.queueImageGeneration({ 
            cardId: victim.id, 
            prompt: victim.imagePrompt, 
            colorTreatment: 'selectiveColor' 
        }));
      }

      // 2. Queue the main crime scene image
      if (crimeScene) {
        dispatch(storySlice.actions.queueImageGeneration({ 
            cardId: crimeScene.id, 
            prompt: crimeScene.imagePrompt, 
            colorTreatment: 'selectiveColor' 
        }));
      }

      // 3. Queue the main map image
      if (storyInfo.mapImagePrompt) {
          dispatch(storySlice.actions.queueImageGeneration({
              cardId: 'map',
              prompt: storyInfo.mapImagePrompt,
              colorTreatment: 'map'
          }));
      }
      
      // Kick off the queue processor.
      dispatch(processImageGenerationQueue());
  }
);

export const checkAndResolveConnections = createAsyncThunk(
  'story/checkAndResolveConnections',
  async (targetObjectId: string, { getState, dispatch }) => {
      const state = getState() as RootState;
      const allConnections = Object.values(state.story.latentConnections.entities).filter((c): c is LatentConnection => !!c);
      const unresolved = allConnections.filter(c => !c.isResolved && c.unresolvedTargetIds.includes(targetObjectId));

      if (unresolved.length > 0) {
          const targetObject = state.story.objects.entities[targetObjectId];
          if (!targetObject) return;
          
          for (const connection of unresolved) {
              dispatch(storySlice.actions.resolveLatentConnection({ connectionId: connection.id, targetObjectId }));
              dispatch(showModal({
                  type: 'latentConnection',
                  props: { connection, targetObject }
              }));
          }
      }
  }
);


const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    toggleSuspect(state, action: PayloadAction<{ id: string; isSuspect: boolean }>) {
        charactersAdapter.updateOne(state.characters, { id: action.payload.id, changes: { isSuspect: action.payload.isSuspect } });
    },
    setAssignedSuspects(state, action: PayloadAction<{ objectId: string, suspectIds: string[] }>) {
        objectsAdapter.updateOne(state.objects, { 
            id: action.payload.objectId, 
            changes: { 
                assignedToSuspectIds: action.payload.suspectIds,
                isEvidence: true,
                hasBeenUnlocked: true
            } 
        });
    },
    addToTimeline(state, action: PayloadAction<string>) {
        const object = state.objects.entities[action.payload];
        if (object) {
            const newEvidence: Evidence = {
                id: `ev-${object.id}`,
                cardId: object.id,
                cardType: 'object',
                name: object.name,
                imagePrompt: object.imagePrompt,
                timestampCollected: new Date().toISOString(),
                locationId: object.locationFoundId,
            };
            if (!state.evidence.find(e => e.id === newEvidence.id)) {
                state.evidence.push(newEvidence);
            }
        }
    },
    setHasDiscoveredPaint(state, action: PayloadAction<boolean>) {
      state.hasDiscoveredPaint = action.payload;
    },
    queueImageGeneration(state, action: PayloadAction<ImageGenerationRequest>) {
        if (!state.imageUrls[action.payload.cardId] && !state.imageLoading[action.payload.cardId]) {
            state.imageGenerationQueue.push(action.payload);
            state.imageLoading[action.payload.cardId] = true;
        }
    },
    setImageGenerationQueue(state, action: PayloadAction<ImageGenerationRequest[]>) {
        state.imageGenerationQueue = action.payload;
    },
    setIsQueueProcessing(state, action: PayloadAction<boolean>) {
        state.isQueueProcessing = action.payload;
    },
    updateImageCache(state, action: PayloadAction<{ cardId: string, url: string | null, error: boolean }[]>) {
        action.payload.forEach(result => {
            state.imageLoading[result.cardId] = false;
            if (result.url) {
                state.imageUrls[result.cardId] = result.url;
                delete state.imageErrors[result.cardId];
            } else {
                state.imageErrors[result.cardId] = true;
            }
        });
    },
    setDynamicHotspotCoords(state, action: PayloadAction<{ locationId: string; coords: { [hotspotId: string]: { x: number; y: number } } }>) {
        state.dynamicHotspotCoords[action.payload.locationId] = action.payload.coords;
    },
    markObjectAsAnalyzed(state, action: PayloadAction<string>) {
        objectsAdapter.updateOne(state.objects, { id: action.payload, changes: { isFullyAnalyzed: true } });
    },
    addDynamicObject(state, action: PayloadAction<StoryObject>) {
        objectsAdapter.addOne(state.objects, action.payload);
    },
    addFindingIdToObject(state, action: PayloadAction<{ originalObjectId: string; findingId: string }>) {
        const { originalObjectId, findingId } = action.payload;
        const originalObject = state.objects.entities[originalObjectId];
        if (originalObject) {
            const updatedFindingIds = [...(originalObject.findingIds || []), findingId];
            objectsAdapter.updateOne(state.objects, { id: originalObjectId, changes: { findingIds: updatedFindingIds } });
        }
    },
    addLatentConnection(state, action: PayloadAction<Omit<LatentConnection, 'id'>>) {
        const newConnection: LatentConnection = {
            id: `conn-${uuidv4()}`,
            ...action.payload
        };
        latentConnectionsAdapter.addOne(state.latentConnections, newConnection);
    },
    resolveLatentConnection(state, action: PayloadAction<{ connectionId: string, targetObjectId: string }>) {
        const connection = state.latentConnections.entities[action.payload.connectionId];
        if (connection) {
            const newUnresolved = connection.unresolvedTargetIds.filter(id => id !== action.payload.targetObjectId);
            const isNowResolved = newUnresolved.length === 0;
            latentConnectionsAdapter.updateOne(state.latentConnections, {
                id: action.payload.connectionId,
                changes: {
                    unresolvedTargetIds: newUnresolved,
                    isResolved: isNowResolved,
                }
            });
        }
    },
    createEvidenceFromTestimony(state, action: PayloadAction<{ chunk: DialogueChunkData, character: Character }>) {
      const { chunk, character } = action.payload;
      const newObject: StoryObject = {
        id: `obj-testimony-${chunk.id}`,
        name: `Testimony: ${chunk.insight?.newLead || character.name}`,
        imagePrompt: `A photorealistic image of a legal document containing a transcript of an interrogation. The text "${chunk.text}" is highlighted with a yellow marker.`,
        description: `During interrogation, ${character.name} made the following statement: "${chunk.text}"`,
        timestamp: new Date().toISOString(),
        isEvidence: true,
        assignedToSuspectIds: [character.id],
        locationFoundId: 'loc_interrogation_room', // A conceptual location
        rarity: chunk.isCriticalClue ? 'material' : 'circumstantial',
        category: 'testimony_fragment',
        ownerCharacterId: character.id,
        hasBeenUnlocked: true,
        components: [],
      };
      
      objectsAdapter.addOne(state.objects, newObject);
      
      const newEvidence: Evidence = {
          id: `ev-${newObject.id}`,
          cardId: newObject.id,
          cardType: 'object',
          name: newObject.name,
          imagePrompt: newObject.imagePrompt,
          timestampCollected: new Date().toISOString(),
          locationId: newObject.locationFoundId,
      };
      if (!state.evidence.find(e => e.id === newEvidence.id)) {
          state.evidence.push(newEvidence);
      }
    },
    addTokens(state, action: PayloadAction<number>) {
      state.playerTokens += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateImageCache.fulfilled, (state, action: PayloadAction<{ [id: string]: string }>) => {
        state.imageUrls = { ...state.imageUrls, ...action.payload };
    });
  }
});

export const {
    toggleSuspect,
    setAssignedSuspects,
    addToTimeline,
    setHasDiscoveredPaint,
    queueImageGeneration,
    markObjectAsAnalyzed,
    addDynamicObject,
    addFindingIdToObject,
    addLatentConnection,
    createEvidenceFromTestimony,
    addTokens,
    setDynamicHotspotCoords,
} = storySlice.actions;

// --- Entity Selectors ---
// Corrected to pass a selector for the specific entity slice state, not the whole story slice.
export const { selectAll: selectAllCharacters, selectById: selectCharacterById } = 
    charactersAdapter.getSelectors((state: RootState) => state.story.characters);
export const { selectAll: selectAllObjects, selectById: selectObjectById, selectEntities: selectObjectEntities } = 
    objectsAdapter.getSelectors((state: RootState) => state.story.objects);
export const { selectAll: selectAllLocations, selectById: selectLocationById } = 
    locationsAdapter.getSelectors((state: RootState) => state.story.locations);
export const { selectAll: selectAllEvidenceGroups, selectById: selectEvidenceGroupById } = 
    evidenceGroupsAdapter.getSelectors((state: RootState) => state.story.evidenceGroups);

// --- Memoized, Derived Selectors ---
export const selectStoryInfo = (state: RootState) => state.story.storyInfo;
export const selectPlayerTokens = (state: RootState) => state.story.playerTokens;
export const selectBounties = (state: RootState) => Object.values(state.story.bounties.entities).filter((b): b is Bounty => !!b);
export const selectCanonicalTimeline = (state: RootState) => state.story.canonicalTimeline;
export const selectImageUrls = (state: RootState) => state.story.imageUrls;
export const selectImageErrors = (state: RootState) => state.story.imageErrors;
export const selectEvidenceStacks = (state: RootState) => state.story.evidenceStacks;
export const selectDynamicHotspotsForLocation = (state: RootState, locationId: string) => state.story.dynamicHotspotCoords[locationId];

export const selectVictims = createSelector(selectAllCharacters, (chars) => chars.filter(c => c.role === 'victim'));
export const selectSuspects = createSelector(selectAllCharacters, (chars) => chars.filter(c => c.role === 'suspect'));
export const selectWitnesses = createSelector(selectAllCharacters, (chars) => chars.filter(c => c.role === 'witness'));
export const selectVisitedLocations = createSelector(
  [selectAllLocations, (state: RootState) => state.ui.visitedLocationIds],
  (locations, visitedIds) => locations.filter(loc => visitedIds.includes(loc.id))
);

export const selectAllEvidenceWithDetails = createSelector(
    [
        (state: RootState) => state.story.evidence,
        (state: RootState) => state.story.characters.entities,
        (state: RootState) => state.story.objects.entities,
    ],
    (evidenceList, characterEntities, objectEntities) => {
        return evidenceList.map(evidence => ({
            ...evidence,
            details: evidence.cardType === 'character' 
                ? characterEntities[evidence.cardId] 
                : objectEntities[evidence.cardId]
        }));
    }
);

export const selectUnassignedEvidence = createSelector(
    selectAllObjects,
    (objects) => objects.filter(o => o.isEvidence && o.assignedToSuspectIds.length === 0)
);

export const selectEvidenceForSuspect = createSelector(
    [selectAllObjects, (state: RootState, suspectId: string) => suspectId],
    (objects, suspectId) => objects.filter(o => o.isEvidence && o.assignedToSuspectIds.includes(suspectId))
);

export const selectObjectsInGroup = createSelector(
    [selectObjectEntities, selectAllEvidenceGroups, (state: RootState, groupId: string) => groupId],
    (objectEntities, allGroups, groupId) => {
        const group = allGroups.find(g => g.id === groupId);
        if (!group) return [];
        return group.objectIds.map(id => objectEntities[id]).filter((obj): obj is StoryObject => !!obj);
    }
);

const CATEGORY_MAP: { [key: string]: string } = {
  socialMedia: 'socialMedia',
  phoneLog: 'phone_log',
  cctv: 'cctv_sighting',
  records: 'financial_record',
  file: 'police_file',
};

export const selectObjectsForCharacterCollection = createSelector(
    [selectAllObjects, (state: RootState, characterId: string) => characterId, (state: RootState, characterId: string, collectionType: string) => collectionType],
    (allObjects, characterId, collectionType) => {
        const targetCategory = CATEGORY_MAP[collectionType] || collectionType;
        return allObjects.filter(obj => obj.ownerCharacterId === characterId && obj.category === targetCategory);
    }
);

export default storySlice.reducer;