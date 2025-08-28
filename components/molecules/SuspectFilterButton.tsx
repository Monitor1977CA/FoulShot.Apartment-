/**
 * @file SuspectFilterButton.tsx
 * @description A reusable button for filtering the timeline by suspect.
 * This was extracted from TimelineView to improve modularity.
 */
import React from 'react';
import { Character } from '../../types';
import ImageWithLoader from './ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';

interface SuspectFilterButtonProps {
  suspect: Character;
  isActive: boolean;
  onClick: (id: string) => void;
}

const SuspectFilterButton: React.FC<SuspectFilterButtonProps> = React.memo(({ suspect, isActive, onClick }) => {
    const { imageUrl, isLoading } = useCardImage(suspect, 'selectiveColor');
    
    return (
        <button
            onClick={() => onClick(suspect.id)}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition flex items-center space-x-2 flex-shrink-0 ${isActive ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text'}`}
        >
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-brand-border bg-brand-bg">
                <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={suspect.name} objectFit="cover" />
            </div>
            <span className="font-oswald uppercase tracking-wider">{suspect.name}</span>
        </button>
    );
});

export default SuspectFilterButton;
