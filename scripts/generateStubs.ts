// scripts/generateStubs.ts
// Purpose: Generate minimal stub entries for missing hotspot targets into data/_stubs/*.ts
// Usage: npx ts-node ./scripts/generateStubs.ts

import fs from 'fs';
import path from 'path';
import url from 'url';

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

function humanizeId(id: string) {
  return id.replace(/^(obj_|group_|loc_|char_)/, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const locations = loadArrayExport('data/locations.ts') || [];
const objects = loadArrayExport('data/objects.ts') || [];
const evidenceGroups = loadArrayExport('data/evidenceGroups.ts') || [];
const characters = loadArrayExport('data/characters.ts') || [];

const objectIds = new Set(objects.map((o: any) => o.id));
const evidenceGroupIds = new Set(evidenceGroups.map((g: any) => g.id));
const characterIds = new Set(characters.map((c: any) => c.id));

const missingObjects = new Set<string>();
const missingEvidenceGroups = new Set<string>();

for (const loc of locations) {
  if (!loc.hotspots) continue;
  for (const hs of loc.hotspots) {
    const targetId = hs.targetCardId;
    const declared = hs.targetCardType;
    if (!targetId) continue;
    if (declared === 'object' && !objectIds.has(targetId)) missingObjects.add(targetId);
    if (declared === 'evidenceGroup' && !evidenceGroupIds.has(targetId)) missingEvidenceGroups.add(targetId);
  }
}

if (missingObjects.size === 0 && missingEvidenceGroups.size === 0) {
  console.log('No stubs required.');
  process.exit(0);
}

// Ensure _stubs dir exists
const stubsDir = path.resolve(root, 'data/_stubs');
if (!fs.existsSync(stubsDir)) fs.mkdirSync(stubsDir, { recursive: true });

const objectStubs: any[] = [];
for (const id of Array.from(missingObjects)) {
  objectStubs.push({ id, name: humanizeId(id), locationFoundId: null });
}

const evidenceGroupStubs: any[] = [];
for (const id of Array.from(missingEvidenceGroups)) {
  evidenceGroupStubs.push({ id, name: humanizeId(id), objectIds: [] });
}

// Write files
const objsPath = path.resolve(stubsDir, 'objects_stubs.ts');
const groupsPath = path.resolve(stubsDir, 'evidenceGroups_stubs.ts');

fs.writeFileSync(objsPath, `export const objects_stubs = ${JSON.stringify(objectStubs, null, 2)};\n`, 'utf8');
fs.writeFileSync(groupsPath, `export const evidenceGroups_stubs = ${JSON.stringify(evidenceGroupStubs, null, 2)};\n`, 'utf8');

console.log(`Wrote ${objectStubs.length} object stubs to data/_stubs/objects_stubs.ts`);
console.log(`Wrote ${evidenceGroupStubs.length} evidence group stubs to data/_stubs/evidenceGroups_stubs.ts`);
console.log('Please review the stubs before merging into main story data.');
process.exit(0);
