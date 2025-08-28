/**
 * @file data/story.ts
 * @description This is the new central file for composing the story data. It imports raw data from
 * modularized files (characters, locations, etc.) and runs them through the transformation
 * layer. This architecture is significantly more maintainable and scalable than the previous
 * single-file approach.
 *
 * @architectural_note Future-Proofing for Build-Time Transformation
 * The `transformStoryData` function currently runs every time the application loads. For the ultimate
 * in performance, this entire file could be executed as part of a "build step" during development.
 * The output of `transformStoryData()` could be saved as a static `story.json` file. The application
 * would then simply fetch this pre-computed JSON, eliminating all runtime transformation costs and
 * enabling data validation before the app is even deployed. This modular structure is the necessary
 * first step to enable such an optimization in the future.
 */

import { StoryData, StoryObject, Character, DataComponent, DialogueData, EvidenceRarity, CardType, Location, CanonicalTimeline } from '../types';
import { rawCharacters } from './characters';
import { rawLocations } from './locations';
import { rawObjects } from './objects';
import { rawEvidenceGroups } from './evidenceGroups';

// The raw story info, kept here for high-level configuration.
const storyInfo = {
    "id": "story_foul_shot_01",
    "title": "Foul Shot",
    "premise": "NBA super-agent Malcolm Cole was found dead in his Atherton Airbnb — his rise ending in an instant. As investigators peel back the layers of his carefully guarded life, they uncover bitter custody fights, volatile clients, and a secret romance that led to murder.",
    "mapImagePrompt": "A photorealistic, satellite-style map of the San Francisco Bay Area at night. The city of Atherton is highlighted with a subtle red glow. The style is modern and clean, like a detective's interactive display."
};

const canonicalTimeline: CanonicalTimeline = {
    culpritId: "char_walter_halley",
    keyEvents: [
        { objectId: "obj_pi_invoice_computer", description: "Shows Walter hired a PI, proving premeditation." },
        { objectId: "obj_walter_cctv_1", description: "Places Walter's truck near the crime scene, establishing opportunity." },
        { objectId: "obj_peel_out_tracks", description: "Links Walter's specific truck type to the crime scene." },
        { objectId: "obj_walter_records_1", description: "Shows Walter owned a 9mm and suspiciously reported it stolen." },
        { objectId: "obj_shell_casings", description: "The primary evidence of the murder weapon." }
    ]
};


// --- DATA TRANSFORMATION LAYER ---
// This is where the simple, author-friendly raw data is processed into the
// more complex, component-based data structure the application needs.

const transformStoryData = (): StoryData => {
    const transformedObjects: StoryObject[] = rawObjects.map(o => ({
        ...o,
        isEvidence: false,
        assignedToSuspectIds: [],
        // --- ARCHITECTURAL FIX: Preserve raw object components ---
        // The previous implementation was stripping all components from the raw data.
        // This fix ensures that components defined in `data/objects.ts` (like readable documents)
        // are correctly passed into the application state.
        components: (o as any).components || [], 
    }));
    const transformedCharacters: Character[] = [];

    rawCharacters.forEach(char => {
        const finalComponents: DataComponent[] = [];
        const dialogueComponent = char.components.find((c: any) => c.type === 'dialogue');
        if (dialogueComponent) {
            finalComponents.push({ type: 'dialogue', props: dialogueComponent.props as DialogueData });
        }
        
        // --- DATA-DRIVEN ENRICHMENT: Physical Characteristics ---
        // Find the physical characteristics from the raw data and add them.
        const physicalCharsComponent = char.components.find((c: any) => c.type === 'physicalCharacteristics');
        if (physicalCharsComponent) {
            finalComponents.push({ type: 'physicalCharacteristics', props: physicalCharsComponent.props });
        }


        // Add a derived 'mugshot' object for every character that has a police file component.
        // This is now determined by checking if there are any `police_file` objects owned by the character.
        const hasPoliceFile = rawObjects.some(o => o.ownerCharacterId === char.id && o.category === 'police_file');
        if (hasPoliceFile) {
            transformedObjects.push({
                id: `obj_mugshot_${char.id}`,
                name: `${char.name} Mugshot`,
                imagePrompt: `A photorealistic police booking photo (mugshot) of ${char.name}. The background is a stark, gray wall with height markers. The lighting is harsh and direct from the front.`,
                description: `Official booking photo for ${char.name}.`,
                timestamp: new Date().toISOString(),
                isEvidence: false,
                assignedToSuspectIds: [],
                locationFoundId: 'loc_police_station', // Conceptual location
                rarity: 'circumstantial' as EvidenceRarity,
                category: 'police_file',
                ownerCharacterId: char.id,
                hasBeenUnlocked: false,
                costToUnlock: 0,
                components: [],
            });
        }
        
        transformedCharacters.push({
            id: char.id,
            name: char.name,
            age: char.age,
            occupation: char.occupation,
            imagePrompt: char.imagePrompt,
            description: char.bio,
            role: char.role as any,
            isSuspect: char.role === 'suspect',
            connections: { relatedPeople: [], knownLocations: [], associatedObjects: [] },
            testimonyIds: [],
            components: finalComponents,
        });
    });
    
    // --- NEW: Automated Evidence Generation from Location Notes ---
    // This is a powerful new feature that makes the world feel more connected.
    // It scans location notes for character names and automatically creates evidence.
    rawLocations.forEach(loc => {
        if (loc.propertyRecords?.notes) {
            transformedCharacters.forEach(char => {
                if (loc.propertyRecords.notes.includes(char.name)) {
                    // Create a new evidence object from the note.
                    transformedObjects.push({
                        id: `obj_cctv_${loc.id}_${char.id}`,
                        name: `Security Log: ${char.name}`,
                        imagePrompt: `A photorealistic image of a security logbook entry. A line with the name '${char.name}' and a timestamp is highlighted with a yellow marker.`,
                        description: `A note from official building records at ${loc.name} states: "${loc.propertyRecords.notes}"`,
                        timestamp: new Date().toISOString(),
                        isEvidence: false,
                        assignedToSuspectIds: [],
                        locationFoundId: loc.id,
                        rarity: 'circumstantial',
                        category: 'cctv_sighting',
                        ownerCharacterId: char.id,
                        hasBeenUnlocked: false,
                        costToUnlock: 0,
                        components: [],
                    });
                }
            });
        }
    });


    return {
        title: storyInfo.title,
        storyInfo: {
            mapImagePrompt: storyInfo.mapImagePrompt,
            mapTitle: storyInfo.title,
            crimeSceneId: "loc_atherton_airbnb",
        },
        characters: transformedCharacters,
        objects: transformedObjects,
        locations: rawLocations.map(loc => ({
            ...loc,
            hotspots: loc.hotspots.map(h => ({ ...h, type: h.type as ('investigate' | 'move'), targetCardType: h.targetCardType as CardType })),
            description: loc.sceneSummary || '',
            lastEventTimestamp: new Date().toISOString(),
            lastEventDescription: loc.sceneSummary || '',
        })) as Location[],
        evidenceGroups: rawEvidenceGroups.map(group => ({
            ...group,
            description: `A collection of items found together related to ${group.name}. Examine them individually to learn more.`,
            imagePrompt: `A photorealistic, top-down view of several pieces of evidence on a metal table in a sterile forensic lab. The evidence relates to ${group.name}.`
        })),
        testimonies: [],
        canonicalTimeline: canonicalTimeline,
    };
};

export const storyData = transformStoryData();