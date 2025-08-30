// Script: scripts/validateHotspots.ts
// Purpose: Validate that every hotspot.targetCardId referenced in data/locations.ts exists in its declared collection.
// Usage: npm run validate:hotspots

import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadData(filePath: string) {
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

const locations = loadData('data/locations.ts') || [];
const objects = loadData('data/objects.ts') || [];
const evidenceGroups = loadData('data/evidenceGroups.ts') || [];
const characters = loadData('data/characters.ts') || [];

const objectIds = new Set(objects.map((o: any) => o.id));
const locationIds = new Set(locations.map((l: any) => l.id));
const evidenceGroupIds = new Set(evidenceGroups.map((e: any) => e.id));
const characterIds = new Set(characters.map((c: any) => c.id));

const report: any[] = [];
for (const loc of locations) {
  if (!loc.hotspots) continue;
  for (const hs of loc.hotspots) {
    const targetId = hs.targetCardId;
    const declared = hs.targetCardType;
    let exists = false;
    if (declared === 'object' && objectIds.has(targetId)) exists = true;
    if (declared === 'location' && locationIds.has(targetId)) exists = true;
    if (declared === 'evidenceGroup' && evidenceGroupIds.has(targetId)) exists = true;
    if (!exists && (objectIds.has(targetId) || locationIds.has(targetId) || evidenceGroupIds.has(targetId) || characterIds.has(targetId))) {
      report.push({ locationId: loc.id, hotspotId: hs.id, targetId, declared, actual: objectIds.has(targetId) ? 'object' : locationIds.has(targetId) ? 'location' : evidenceGroupIds.has(targetId) ? 'evidenceGroup' : characterIds.has(targetId) ? 'character' : 'unknown' });
    } else if (!exists) {
      report.push({ locationId: loc.id, hotspotId: hs.id, targetId, declared, actual: 'missing' });
    }
  }
}

if (report.length === 0) {
  console.log('All hotspots validated successfully. No mismatches found.');
  process.exit(0);
}

console.log('Hotspot validation report:');
console.table(report);
process.exit(1);
