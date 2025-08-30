import { z } from 'zod';

// Lightweight, permissive schemas to validate compiled story shape.
// These schemas focus on required identity fields and major arrays while allowing
// extra properties to pass through. Keep them permissive so existing compiled
// content won't break; enforce more strictly in CI if desired.

export const HotspotSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  coords: z.any().optional(),
  targetCardId: z.string(),
  targetCardType: z.string().optional(),
  label: z.string().optional(),
  aiHint: z.string().optional(),
}).passthrough();

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  role: z.string().optional(),
}).passthrough();

export const StoryObjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  imagePrompt: z.string().optional(),
  isEvidence: z.boolean().optional(),
  assignedToSuspectIds: z.array(z.string()).optional(),
  findingIds: z.array(z.string()).optional(),
}).passthrough();

export const EvidenceGroupSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  objectIds: z.array(z.string()).optional(),
}).passthrough();

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  hotspots: z.array(HotspotSchema).optional(),
}).passthrough();

export const StoryDataSchema = z.object({
  title: z.string().optional(),
  storyInfo: z.any().optional(),
  characters: z.array(CharacterSchema).optional(),
  objects: z.array(StoryObjectSchema).optional(),
  locations: z.array(LocationSchema).optional(),
  evidenceGroups: z.array(EvidenceGroupSchema).optional(),
  testimonies: z.array(z.any()).optional(),
  canonicalTimeline: z.any().nullable().optional(),
}).passthrough();
