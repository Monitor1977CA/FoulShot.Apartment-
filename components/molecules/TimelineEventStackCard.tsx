/**
 * @file TimelineEventStackCard.tsx
 * @description A component that renders a stack of related evidence cards on the timeline.
 * It has been completely redesigned into a "Dossier Card" that expands to show linked items
 * and empty slots, providing a much clearer and more strategic UI.
 */
import React, { useMemo } from 'react';
import TimelineEventCard from './TimelineEventCard';
import { selectAllEvidenceWithDetails } from '../../store/storySlice';
import { useCardImage } from '../../hooks/useCardImage';
import ImageWithLoader from './ImageWithLoader';
import { Link, HelpCircle } from 'lucide-react';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface TimelineEventStackCardProps {
    anchor: EvidenceWithDetails;
    linked: EvidenceWithDetails[];
    totalSlots: number;
    isExpanded: boolean;
}

/**
 * --- Extracted Sub-component: LinkedItemThumbnail ---
 * A dedicated component for displaying a thumbnail of a linked item within the Dossier Card.
 */
const LinkedItemThumbnail: React.FC<{ evidence: EvidenceWithDetails }> = React.memo(({ evidence }) => {
    const { imageUrl, isLoading } = useCardImage(evidence.details, 'monochrome');
    return (
        <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-brand-bg border border-brand-border flex-shrink-0">
                <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={evidence.name} objectFit="cover" />
            </div>
            <p className="text-sm font-semibold text-white truncate">{evidence.name}</p>
        </div>
    );
});

/**
 * --- Extracted Sub-component: EmptySlotPlaceholder ---
 * A dedicated component for visualizing an undiscovered piece of evidence in the Dossier Card.
 */
const EmptySlotPlaceholder: React.FC = React.memo(() => {
    return (
        <div className="flex items-center gap-2 opacity-50">
            <div className="w-12 h-12 rounded-md bg-black/30 border border-dashed border-brand-border flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-brand-text-muted" />
            </div>
            <p className="text-sm font-semibold text-brand-text-muted">Missing Link</p>
        </div>
    );
});


const TimelineEventStackCard: React.FC<TimelineEventStackCardProps> = ({ anchor, linked, totalSlots, isExpanded }) => {
    
    // Calculate the number of empty slots to display.
    const emptySlots = useMemo(() => {
        const discoveredCount = 1 + linked.length; // Anchor + linked items
        return Math.max(0, totalSlots - discoveredCount);
    }, [totalSlots, linked.length]);

    return (
        <div className="w-72">
            {/* The anchor card is always visible */}
            <TimelineEventCard 
                evidence={anchor} 
                isExpanded={isExpanded} 
            />

            {/* --- Expanded View: The Dossier Details --- */}
            {isExpanded && (
                <div className="bg-brand-surface border-x-2 border-b-2 border-brand-primary rounded-b-lg p-3 -mt-1 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-brand-primary">
                        <Link size={16} />
                        <h4 className="font-oswald text-sm uppercase tracking-wider">Linked Items</h4>
                    </div>
                    <div className="space-y-2">
                        {/* Display discovered linked items */}
                        {linked.map(item => <LinkedItemThumbnail key={item.id} evidence={item} />)}
                        
                        {/* Display placeholders for undiscovered items */}
                        {Array.from({ length: emptySlots }).map((_, index) => <EmptySlotPlaceholder key={`empty-${index}`} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelineEventStackCard;
