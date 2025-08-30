// scripts/compileContent.ts
// Purpose: Merge main story data with any stubs in data/_stubs and emit a compiled JSON manifest
// Usage: npx ts-node ./scripts/compileContent.ts

import fs from 'fs';
import path from 'path';
import url from 'url';
import { z } from 'zod';

// Attempt to load the transformation function from either a compiled JS file or the TypeScript source.
// This allows the script to be executed with plain `node` (if transform.js exists) or with `ts-node` (importing transform.ts).
let transformStoryData: any;
async function loadTransform() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  // Try several candidate locations: root-level transform.(js|ts) (common) and data/transform.(js|ts) (older layout)
  const candidates = [
    path.resolve(__dirname, '../transform.js'),
    path.resolve(__dirname, '../transform.ts'),
    path.resolve(__dirname, '../data/transform.js'),
    path.resolve(__dirname, '../data/transform.ts'),
  ];

  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    try {
      const moduleUrl = url.pathToFileURL(p).href;
      const mod = await import(moduleUrl);
      if (mod && typeof mod.transformStoryData === 'function') {
        transformStoryData = mod.transformStoryData;
        console.log(`[compileContent] loaded transform from ${p}`);
        return;
      }
    } catch (err) {
      console.warn(`Import failed for ${p}, trying next candidate.`, err);
    }
  }

  throw new Error('Unable to load transformStoryData from ../transform.(js|ts) or ../data/transform.(js|ts)');
}

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

async function loadArrayExport(filePath: string) {
  const p = path.resolve(root, filePath);
  if (!fs.existsSync(p)) return [];

  // Try to import the module directly (works when running with ts-node/register or similar).
  try {
    const moduleUrl = url.pathToFileURL(p).href;
    const mod = await import(moduleUrl);
    const exportedArray = Object.values(mod).find(v => Array.isArray(v));
    if (exportedArray) return exportedArray as any[];
  } catch (err) {
    console.warn(`Direct import failed for ${filePath}, falling back to regex parse.`);
  }

  // Fallback: attempt to extract the array literal using a bracket-matching parser (more robust than regex).
  try {
    const content = fs.readFileSync(p, 'utf8');

    // Find the start of the exported array assignment: locate '=' after an 'export const' declaration
    const exportIndex = content.indexOf('export const');
    if (exportIndex !== -1) {
      // Find the equals sign after the export const
      const afterExport = content.slice(exportIndex);
      const eqIndexInSlice = afterExport.indexOf('=');
      if (eqIndexInSlice !== -1) {
        const startIndex = exportIndex + eqIndexInSlice + 1;
        // Skip whitespace to the first '['
        let i = startIndex;
        while (i < content.length && /[\s;:=]/.test(content[i])) i++;
        if (content[i] === '[') {
          // Balanced bracket extraction
          let depth = 0;
          let end = i;
          for (; end < content.length; end++) {
            const ch = content[end];
            if (ch === '[') depth++;
            else if (ch === ']') {
              depth--;
              if (depth === 0) { end++; break; }
            }
          }
          if (end > i) {
            const arrText = content.slice(i, end);
            try {
              // eslint-disable-next-line no-new-func
              const evaluated = Function(`"use strict"; return (${arrText})`)();
              if (Array.isArray(evaluated)) return evaluated as any[];
            } catch (err) {
              console.error('Bracket-eval failed for', filePath, err);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to extract array literal for', filePath, err);
  }

  // Final fallback: original regex approach (least preferred)
  try {
    const content = fs.readFileSync(p, 'utf8');
    const match = content.match(/export const \w+\s*(?::[^=]*)?=\s*(\[[\s\S]*?\]);?/m);
    if (match && match[1]) {
      // eslint-disable-next-line no-eval
      return eval(match[1]);
    }
  } catch (err) {
    console.error('Failed to eval array literal for', filePath, err);
  }

  return [];
}

(async function main() {
  // Try to load a transform; if that fails, fall back to assembling simple storyData from raw arrays.
  let storyData: any = null;
  try {
    await loadTransform();
    storyData = transformStoryData();
  } catch (err) {
    console.warn('[compileContent] transform unavailable, falling back to raw data assembly.', err);
    const objects = await loadArrayExport('data/objects.ts');
    const evidenceGroups = await loadArrayExport('data/evidenceGroups.ts');
    const locations = await loadArrayExport('data/locations.ts');
    const characters = await loadArrayExport('data/characters.ts');
    storyData = {
      title: 'Foul Shot',
      storyInfo: { mapImagePrompt: '', title: 'Foul Shot' },
      objects,
      evidenceGroups,
      locations,
      characters,
      testimonies: [],
      canonicalTimeline: null,
    };
  }

  const { objects, evidenceGroups, locations, characters, storyInfo, canonicalTimeline, title } = storyData;

  const stubObjects = await loadArrayExport('data/_stubs/objects_stubs.ts');
  const stubEvidenceGroups = await loadArrayExport('data/_stubs/evidenceGroups_stubs.ts');

  const objectMap = new Map(objects.map((o: any) => [o.id, o]));
  const evidenceMap = new Map(evidenceGroups.map((g: any) => [g.id, g]));
  const locationMap = new Map(locations.map((l: any) => [l.id, l]));
  const characterMap = new Map(characters.map((c: any) => [c.id, c]));

  let addedObjects = 0;
  let addedEvidenceGroups = 0;

  for (const s of stubObjects) {
    if (!s || !s.id) continue;
    if (!objectMap.has(s.id)) {
      objectMap.set(s.id, s);
      addedObjects++;
    }
  }

  for (const s of stubEvidenceGroups) {
    if (!s || !s.id) continue;
    if (!evidenceMap.has(s.id)) {
      evidenceMap.set(s.id, s);
      addedEvidenceGroups++;
    }
  }

  const compiled = {
    title,
    storyInfo,
    objects: Array.from(objectMap.values()),
    evidenceGroups: Array.from(evidenceMap.values()),
    locations: Array.from(locationMap.values()),
    characters: Array.from(characterMap.values()),
    testimonies: storyData.testimonies || [],
    canonicalTimeline,
    generatedAt: new Date().toISOString(),
  };

  const outDir = path.resolve(root, 'data/compiled');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.resolve(outDir, 'content.json');
  fs.writeFileSync(outPath, JSON.stringify(compiled, null, 2), 'utf8');

  // --- ZOD VALIDATION: Run schema check and emit validated copy ---
  try {
    const schemasPath = path.resolve(root, 'data/schemas.ts');
    const schemaModuleUrl = url.pathToFileURL(schemasPath).href;
    const schemaMod = await import(schemaModuleUrl);
    const StoryDataSchema = schemaMod.StoryDataSchema as z.ZodTypeAny;
    const result = StoryDataSchema.safeParse(compiled);
    if (!result.success) {
      console.error('[compileContent] Validation failed for compiled content.json:', result.error.format());
      fs.writeFileSync(path.resolve(outDir, 'content.validation.error.json'), JSON.stringify(result.error.format(), null, 2), 'utf8');
      process.exit(2);
    } else {
      // Write a validated copy for quick inspection
      fs.writeFileSync(path.resolve(outDir, 'content.validated.json'), JSON.stringify(compiled, null, 2), 'utf8');
      console.log('[compileContent] compiled content validated against zod schema.');
    }
  } catch (err) {
    console.warn('[compileContent] Zod validation not performed due to error loading schema module.', err);
  }

  console.log(`Wrote compiled content to ${outPath}`);
  console.log(`Added ${addedObjects} object stubs, ${addedEvidenceGroups} evidenceGroup stubs.`);
  console.log('Review the compiled JSON and integrate into your build as needed.');
  process.exit(0);
})();
