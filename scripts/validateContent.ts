// scripts/validateContent.ts
// Purpose: Stronger schema-based validation for story content using zod.
// Usage: npm run validate:content

import fs from 'fs';
import path from 'path';
import url from 'url';
import { z } from 'zod';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadArrayExport(filePath: string) {
  const p = path.resolve(root, filePath);
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, 'utf8');
  // This regex is designed to find an exported array, ignoring any TypeScript type annotations.
  // It looks for `export const variableName: OptionalType = [...]`
  const match = content.match(/export const \w+\s*(?::[^=]*)?=\s*(\[[\s\S]*?\]);?/m);
  if (match && match[1]) {
    try {
      // eslint-disable-next-line no-eval
      return eval(match[1]);
    } catch (err) {
      console.error('Failed to eval', filePath, err);
      return null;
    }
  }
  return null;
}

// Schemas (minimal, focused on referential integrity)
const HotspotSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  targetCardId: z.string().optional(),
  targetCardType: z.string().optional(),
  coords: z.any().optional(),
  aiHint: z.string().optional(),
  type: z.string().optional(),
});

const LocationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  hotspots: z.array(HotspotSchema).optional(),
});

const ObjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  // allow locationFoundId to be a string, null, or omitted for stubs
  locationFoundId: z.union([z.string(), z.null()]).optional(),
});

const EvidenceGroupSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  objectIds: z.array(z.string()).optional(),
});

const CharacterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

// Load data
const compiledPath = path.resolve(root, 'data/compiled/content.json');
let locations: any[] = [];
let objects: any[] = [];
let evidenceGroups: any[] = [];
let characters: any[] = [];

if (fs.existsSync(compiledPath)) {
  try {
    const compiledRaw = fs.readFileSync(compiledPath, 'utf8');
    const compiled = JSON.parse(compiledRaw);
    objects = compiled.objects || [];
    evidenceGroups = compiled.evidenceGroups || [];
    locations = compiled.locations || [];
    characters = compiled.characters || [];
    console.log('Using compiled content at data/compiled/content.json for validation.');
  } catch (err) {
    console.error('Failed to read compiled content; falling back to individual source files.', err);
    locations = loadArrayExport('data/locations.ts') || [];
    objects = loadArrayExport('data/objects.ts') || [];
    evidenceGroups = loadArrayExport('data/evidenceGroups.ts') || [];
    characters = loadArrayExport('data/characters.ts') || [];
  }
} else {
  locations = loadArrayExport('data/locations.ts') || [];
  objects = loadArrayExport('data/objects.ts') || [];
  evidenceGroups = loadArrayExport('data/evidenceGroups.ts') || [];
  characters = loadArrayExport('data/characters.ts') || [];
}

// Validate shapes
const errors: any[] = [];

function validateArray(items: any[], schema: any, fileLabel: string) {
  items.forEach((it, idx) => {
    const r = schema.safeParse(it);
    if (!r.success) {
      errors.push({ file: fileLabel, index: idx, id: it?.id || '(missing id)', issues: r.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) });
    }
  });
}

validateArray(locations, LocationSchema, 'locations.ts');
validateArray(objects, ObjectSchema, 'objects.ts');
validateArray(evidenceGroups, EvidenceGroupSchema, 'evidenceGroups.ts');
validateArray(characters, CharacterSchema, 'characters.ts');

// Referential checks
const objectIds = new Set(objects.map((o: any) => o.id));
const locationIds = new Set(locations.map((l: any) => l.id));
const evidenceGroupIds = new Set(evidenceGroups.map((g: any) => g.id));
const characterIds = new Set(characters.map((c: any) => c.id));

const referentialIssues: any[] = [];

// Hotspot checks
for (const loc of locations) {
  if (!loc.hotspots) continue;
  for (const hs of loc.hotspots) {
    const targetId = hs.targetCardId;
    const declared = hs.targetCardType;
    if (!targetId) {
      referentialIssues.push({ type: 'hotspot.missingTargetId', locationId: loc.id, hotspotId: hs.id });
      continue;
    }

    let existsInDeclared = false;
    if (declared === 'object') existsInDeclared = objectIds.has(targetId);
    else if (declared === 'location') existsInDeclared = locationIds.has(targetId);
    else if (declared === 'evidenceGroup') existsInDeclared = evidenceGroupIds.has(targetId);
    else if (declared === 'character' || ['socialMediaFeed','mugshot','collection','dialogue'].includes(declared)) existsInDeclared = characterIds.has(targetId);

    if (!existsInDeclared) {
      // check if it exists somewhere else
      const actual = objectIds.has(targetId) ? 'object' : locationIds.has(targetId) ? 'location' : evidenceGroupIds.has(targetId) ? 'evidenceGroup' : characterIds.has(targetId) ? 'character' : null;
      if (actual) {
        referentialIssues.push({ type: 'hotspot.typeMismatch', locationId: loc.id, hotspotId: hs.id, targetId, declared, actual });
      } else {
        referentialIssues.push({ type: 'hotspot.missingTarget', locationId: loc.id, hotspotId: hs.id, targetId, declared });
      }
    }
  }
}

// EvidenceGroup -> objectIds checks
for (const g of evidenceGroups) {
  if (!g.objectIds) continue;
  for (const oid of g.objectIds) {
    if (!objectIds.has(oid)) {
      referentialIssues.push({ type: 'evidenceGroup.missingObject', groupId: g.id, objectId: oid });
    }
  }
}

// Report
if (errors.length === 0 && referentialIssues.length === 0) {
  console.log('Content validation passed. No structural or referential issues found.');
  process.exit(0);
}

console.error('\nContent validation failed.');
if (errors.length > 0) {
  console.error('\nSchema validation errors:');
  console.table(errors);
}
if (referentialIssues.length > 0) {
  console.error('\nReferential integrity issues:');
  console.table(referentialIssues);
}

process.exit(1);
