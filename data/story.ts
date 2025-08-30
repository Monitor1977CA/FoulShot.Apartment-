/**
 * @file data/story.ts
 * @description This is the central file for loading the story data at runtime.
 * It is responsible for importing the pre-compiled `content.json` file.
 *
 * @architectural_note Build-Time Transformation
 * The data transformation logic has been moved to `data/transform.ts`. The build script
 * (`scripts/compileContent.ts`) now imports and runs that function to generate the static
 * `data/compiled/content.json`. This file (`story.ts`) is now a simple loader for that
 * compiled data, ensuring a clean separation between build-time and run-time logic and
 * preventing circular dependencies on the compiled output.
 */

import { StoryData } from '../types';
// Runtime schema validation (dev-only) to catch authoring/build regressions early.
import { StoryDataSchema } from './schemas';

let _storyData: StoryData;

function normalizeStoryData(raw: any): StoryData {
  const safe = (val: any, fallback: any) => (val === undefined || val === null ? fallback : val);

  const characters = (safe(raw.characters, []) as any[]).map((c: any) => ({
    id: String(c.id),
    name: safe(c.name, ''),
    age: safe(c.age, ''),
    occupation: safe(c.occupation, ''),
    imagePrompt: safe(c.imagePrompt, ''),
    description: safe(c.description, ''),
    role: safe(c.role, 'witness'),
    isSuspect: !!c.isSuspect,
    connections: safe(c.connections, { relatedPeople: [], knownLocations: [], associatedObjects: [] }),
    testimonyIds: safe(c.testimonyIds, []),
    components: safe(c.components, []),
  })) as StoryData['characters'];

  const objects = (safe(raw.objects, []) as any[]).map((o: any) => ({
    id: String(o.id),
    name: safe(o.name, ''),
    imagePrompt: safe(o.imagePrompt, ''),
    description: safe(o.description, ''),
    timestamp: safe(o.timestamp, ''),
    isEvidence: !!o.isEvidence,
    assignedToSuspectIds: safe(o.assignedToSuspectIds, []),
    locationFoundId: safe(o.locationFoundId, null),
    rarity: safe(o.rarity, 'irrelevant'),
    category: safe(o.category, ''),
    ownerCharacterId: safe(o.ownerCharacterId, undefined),
    hasBeenUnlocked: !!o.hasBeenUnlocked,
    costToUnlock: safe(o.costToUnlock, undefined),
    components: safe(o.components, []),
    unidentifiedDescription: safe(o.unidentifiedDescription, undefined),
    tags: safe(o.tags, []),
    metadata: safe(o.metadata, {}),
    forensicDetails: safe(o.forensicDetails, undefined),
    isFullyAnalyzed: !!o.isFullyAnalyzed,
    forensicScan: safe(o.forensicScan, undefined),
    findingIds: safe(o.findingIds, []),
  })) as StoryData['objects'];

  const locations = (safe(raw.locations, []) as any[]).map((l: any) => ({
    id: String(l.id),
    name: safe(l.name, ''),
    mapCoords: safe(l.mapCoords, { top: '0%', left: '0%' }),
    imagePrompt: safe(l.imagePrompt, ''),
    description: safe(l.description, ''),
    lastEventTimestamp: safe(l.lastEventTimestamp, ''),
    lastEventDescription: safe(l.lastEventDescription, ''),
    hotspots: (safe(l.hotspots, []) as any[]).map((h: any) => ({
      id: String(h.id),
      type: safe(h.type, 'investigate'),
      coords: safe(h.coords, undefined),
      targetCardId: String(h.targetCardId),
      targetCardType: safe(h.targetCardType, inferTypeFromId(h.targetCardId)),
      label: safe(h.label, ''),
      aiHint: safe(h.aiHint, undefined),
    })),
    isInternal: !!l.isInternal,
    sceneSummary: safe(l.sceneSummary, ''),
    detailedDescription: safe(l.detailedDescription, undefined),
    associatedCharacterIds: safe(l.associatedCharacterIds, []),
    propertyRecords: safe(l.propertyRecords, undefined),
    officialReportIds: safe(l.officialReportIds, []),
  })) as StoryData['locations'];

  const evidenceGroups = (safe(raw.evidenceGroups, []) as any[]).map((g: any) => ({
    id: String(g.id),
    name: safe(g.name, ''),
    description: safe(g.description, ''),
    imagePrompt: safe(g.imagePrompt, ''),
    objectIds: safe(g.objectIds, []),
  })) as StoryData['evidenceGroups'];

  const testimonies = safe(raw.testimonies, []);
  const canonicalTimeline = safe(raw.canonicalTimeline, null);

  const storyInfo = safe(raw.storyInfo, { mapImagePrompt: '', mapTitle: '', crimeSceneId: '' });

  return {
    title: safe(raw.title, 'Untitled Story'),
    storyInfo,
    characters,
    objects,
    locations,
    evidenceGroups,
    testimonies,
    canonicalTimeline,
    evidenceStacks: safe(raw.evidenceStacks, []),
  } as StoryData;
}

function inferTypeFromId(id: any): string {
  if (!id || typeof id !== 'string') return 'object';
  if (id.startsWith('loc_')) return 'location';
  if (id.startsWith('char_')) return 'character';
  if (id.startsWith('group_') || id.startsWith('eg_')) return 'evidenceGroup';
  return 'object';
}

// Attempt to load pre-compiled content.json.
let compiledStoryData: any = null;
try {
  console.log('[story] attempting to import compiled content at data/compiled/content.json');
  const compiledModule = await import('./compiled/content.json');
  compiledStoryData = compiledModule?.default || compiledModule;
  console.log('[story] Using compiled story data from data/compiled/content.json');
} catch (err) {
  console.error('[story] FATAL: Could not load compiled story data. This is a build error. Run `npm run build-content`.', err);
  compiledStoryData = null;
  try { (globalThis as any).__COMPILED_IMPORT_ERROR = err; } catch (e) {}
}

// If we have compiled data, run a runtime validation in non-production builds to surface
// any schema mismatches early. This is intentionally permissive in production to avoid
// breaking the app for players while still giving developers a fast feedback loop.
if (compiledStoryData && typeof StoryDataSchema !== 'undefined') {
  try {
    // Only validate in development to avoid perf and noise in production.
    if (process.env.NODE_ENV !== 'production') {
      const validation = StoryDataSchema.safeParse(compiledStoryData);
      if (!validation.success) {
        console.error('[story] compiled content failed schema validation:', validation.error);
        try { (globalThis as any).__STORY_VALIDATION_ERROR = validation.error; } catch (e) {}
        // Keep compiledStoryData as-is so normalize can still coerce missing fields.
      } else {
        // Use the parsed (and possibly coerced) data from the schema to feed normalization.
        compiledStoryData = validation.data;
        try { delete (globalThis as any).__STORY_VALIDATION_ERROR; } catch (e) {}
      }
    }
  } catch (e) {
    console.warn('[story] runtime schema validation encountered an unexpected error', e);
  }
}

if (compiledStoryData) {
  // Normalize to ensure all optional fields are present and types are consistent.
  _storyData = normalizeStoryData(compiledStoryData as any);
  try { (globalThis as any).__STORY_DATA_SOURCE = 'compiled'; } catch (e) {}
  console.log('[story] storyData seeded from compiled content:', { objects: _storyData.objects.length, evidenceGroups: _storyData.evidenceGroups.length });
  // remove debug globals in production
  try { delete (globalThis as any).__COMPILED_IMPORT_ERROR; } catch (e) {}
} else {
  // Fallback to an empty story if the compiled data is missing.
  // This prevents the app from crashing but indicates a build problem.
  _storyData = {
    title: 'Error',
    storyInfo: { mapImagePrompt: '', mapTitle: 'Error', crimeSceneId: '' },
    characters: [],
    objects: [],
    locations: [],
    evidenceGroups: [],
    testimonies: [],
    canonicalTimeline: null,
    evidenceStacks: [],
  };
  try { (globalThis as any).__STORY_DATA_SOURCE = 'fallback'; } catch (e) {}
}

export const storyData: StoryData = _storyData;
export const STORY_DATA_SOURCE = (globalThis as any).__STORY_DATA_SOURCE || 'unknown';

// NOTE: removed global __STORY_DATA exposure to avoid leaking large runtime state in production.