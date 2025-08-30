// scripts/autoFixHotspots.ts
// Auto-correct hotspot.targetCardType when the targetId exists in a different collection.
// Usage: npx ts-node ./scripts/autoFixHotspots.ts

import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const locationsPath = path.resolve(root, 'data/locations.ts');
const objectsPath = path.resolve(root, 'data/objects.ts');
const evidenceGroupsPath = path.resolve(root, 'data/evidenceGroups.ts');
const charactersPath = path.resolve(root, 'data/characters.ts');

function extractArray(content: string) {
  // This regex is designed to find an exported array, ignoring any TypeScript type annotations.
  // It looks for `export const variableName: OptionalType = [...]`
  const match = content.match(/export const \w+\s*(?::[^=]*)?=\s*(\[[\s\S]*?\]);?/m);
  if (!match) return null;
  // eslint-disable-next-line no-eval
  try { return eval(match[1]); } catch (e) { return null; }
}

const locationsRaw = fs.readFileSync(locationsPath, 'utf8');
const objectsRaw = fs.readFileSync(objectsPath, 'utf8');
const evidenceGroupsRaw = fs.existsSync(evidenceGroupsPath) ? fs.readFileSync(evidenceGroupsPath, 'utf8') : '';
const charactersRaw = fs.existsSync(charactersPath) ? fs.readFileSync(charactersPath, 'utf8') : '';

const locations = extractArray(locationsRaw) || [];
const objects = extractArray(objectsRaw) || [];
const evidenceGroups = extractArray(evidenceGroupsRaw) || [];
const characters = extractArray(charactersRaw) || [];

const objectIds = new Set(objects.map((o: any) => o.id));
const locationIds = new Set(locations.map((l: any) => l.id));
const evidenceGroupIds = new Set(evidenceGroups.map((e: any) => e.id));
const characterIds = new Set(characters.map((c: any) => c.id));

let updatedText = locationsRaw;
const corrections: any[] = [];
const missing: any[] = [];

for (const loc of locations) {
  if (!loc.hotspots) continue;
  for (const hs of loc.hotspots) {
    const targetId = hs.targetCardId;
    const declared = hs.targetCardType;
    let actual: string | null = null;
    if (objectIds.has(targetId)) actual = 'object';
    else if (locationIds.has(targetId)) actual = 'location';
    else if (evidenceGroupIds.has(targetId)) actual = 'evidenceGroup';
    else if (characterIds.has(targetId)) actual = 'character';

    if (actual && actual !== declared) {
      // Replace the targetCardType value in the source text for this hotspot entry.
      // We look for the specific hotspot id block to minimize accidental replacements.
      const hotspotBlockRegex = new RegExp(`(\{[\s\S]*?\"id\"\s*:\s*\"${hs.id}\"[\s\S]*?\})`,'m');
      const blockMatch = updatedText.match(hotspotBlockRegex);
      if (blockMatch && blockMatch[1]) {
        const block = blockMatch[1];
        const replacedBlock = block.replace(/"targetCardType"\s*:\s*"[^"]+"/, `"targetCardType": "${actual}"`);
        updatedText = updatedText.replace(block, replacedBlock);
        corrections.push({ locationId: loc.id, hotspotId: hs.id, targetId, declared, actual });
      }
    } else if (!actual) {
      missing.push({ locationId: loc.id, hotspotId: hs.id, targetId, declared });
    }
  }
}

if (corrections.length > 0) {
  // backup
  fs.copyFileSync(locationsPath, locationsPath + '.bak');
  fs.writeFileSync(locationsPath, updatedText, 'utf8');
  console.log(`Applied ${corrections.length} corrections. Backup saved to locations.ts.bak`);
  console.table(corrections);
} else {
  console.log('No corrections needed.');
}

if (missing.length > 0) {
  console.log('\nHotspots with missing target IDs (no matching object/location/evidenceGroup/character found):');
  console.table(missing);
  process.exit(1);
} else {
  process.exit(0);
}
