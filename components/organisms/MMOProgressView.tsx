/**
 * @file MMOProgressView.tsx
 * @description Renders the progress bars for Motive, Means, and Opportunity for a given suspect.
 * This is the new centerpiece of the timeline view, providing a strategic dashboard of case strength.
 */
import React, { useMemo } from 'react';
import { Character, TimelineTag, StoryObject } from '../../types';
import { useSelector } from 'react-redux';
import { selectAllEvidenceWithDetails, selectObjectEntities } from '../../store/storySlice';
import { BrainCircuit, Hammer, Clock } from 'lucide-react';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface MMOProgressViewProps {
    suspect: Character;
    evidence: EvidenceWithDetails[];
    onMMOTagClick: (tag: TimelineTag | null) => void;
    activeMMOFilter: TimelineTag | null;
}

// Configuration for the visual representation of each MMO tag.
const TAG_CONFIG: { [key in TimelineTag]: { Icon: React.ElementType, label: string, color: string, highlightColor: string } } = {
    motive: { Icon: BrainCircuit, label: 'Motive', color: 'bg-red-500', highlightColor: 'bg-red-500/20' },
    means: { Icon: Hammer, label: 'Means', color: 'bg-blue-500', highlightColor: 'bg-blue-500/20' },
    opportunity: { Icon: Clock, label: 'Opportunity', color: 'bg-green-500', highlightColor: 'bg-green-500/20' },
};

const MMOProgressView: React.FC<MMOProgressViewProps> = ({ suspect, evidence, onMMOTagClick, activeMMOFilter }) => {
    // --- ARCHITECTURAL FIX & BUG FIX ---
    // Previously, this component accessed `state.story.objects.entities` directly.
    // It now correctly uses the memoized `selectObjectEntities` selector, which is more performant
    // and provides correctly typed data from the Redux store.
    const allObjects = useSelector(selectObjectEntities);

    const progressData = useMemo(() => {
        // Correctly filter out undefined values that could come from Object.values.
        const allValidObjects = Object.values(allObjects).filter((obj): obj is StoryObject => !!obj);
        const totalEvidenceWithTags = allValidObjects.filter(obj => obj.tags && obj.tags.length > 0).length;
        
        const counts = { motive: 0, means: 0, opportunity: 0 };

        evidence.forEach(e => {
            // --- ROBUSTNESS IMPROVEMENT: Type Guard ---
            // This check ensures that we only process evidence items that are objects
            // and exist in our `allObjects` map. This prevents crashes if an evidence item
            // is a character or its ID is not found.
            if (e.cardType === 'object') {
                const obj = allObjects[e.cardId];
                if (obj && obj.tags) {
                    obj.tags.forEach(tag => {
                        if (counts.hasOwnProperty(tag)) {
                            counts[tag]++;
                        }
                    });
                }
            }
        });
        
        // --- Developer Note on `maxPerCategory` Heuristic ---
        // This calculates the "denominator" for the progress bar. We don't want the bar to be
        // full after finding just one "motive" clue if there are several to be found.
        // This simple heuristic divides the total number of tagged items in the story by 3 (for MMO)
        // to get an *average* number of clues per category. This provides a more meaningful
        // sense of progress toward completing that aspect of the case.
        const maxPerCategory = Math.max(1, Math.floor(totalEvidenceWithTags / 3));

        return {
            motive: maxPerCategory > 0 ? Math.min(1, counts.motive / maxPerCategory) : 0,
            means: maxPerCategory > 0 ? Math.min(1, counts.means / maxPerCategory) : 0,
            opportunity: maxPerCategory > 0 ? Math.min(1, counts.opportunity / maxPerCategory) : 0,
        };

    }, [evidence, allObjects]);

    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-border">
            <h3 className="text-xl font-oswald text-brand-text mb-3 uppercase tracking-wider">Case Strength: {suspect.name}</h3>
            <div className="space-y-2">
                {Object.entries(TAG_CONFIG).map(([key, config]) => {
                    const tagKey = key as TimelineTag;
                    const isActive = activeMMOFilter === tagKey;
                    return (
                        <div
                            key={key}
                            className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 cursor-pointer border
                                ${isActive ? `${config.highlightColor} border-brand-primary/50` : 'border-transparent hover:bg-white/5'}`
                            }
                            onClick={() => onMMOTagClick(tagKey)}
                        >
                            <config.Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-primary' : 'text-brand-text-muted'}`} />
                            <span className={`w-28 text-sm uppercase font-semibold tracking-wider flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-text-muted'}`}>{config.label}</span>
                            <div className="w-full bg-black/50 rounded-full h-2.5 border border-brand-border/50 relative overflow-hidden">
                                <div
                                    className={`${config.color} h-full rounded-full transition-all duration-500`}
                                    style={{ width: `${progressData[tagKey] * 100}%` }}
                                />
                                {isActive && (
                                     <div className="absolute inset-0 bg-white/20 animate-pulse-subtle"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MMOProgressView;