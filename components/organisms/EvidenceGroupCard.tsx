/**
 * @file EvidenceGroupCard.tsx
 * @description A component to display a collection of evidence items found together.
 * This "container" card allows the player to discover multiple clues from a single hotspot.
 * This file has been refactored for performance by extracting the `ObjectRow` component.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EvidenceGroup, StoryObject } from '../../types';
import { AppDispatch, RootState } from '../../store';
import { goBack, setActiveCard } from '../../store/uiSlice';
import { selectObjectsInGroup } from '../../store/storySlice';
import ObjectRow from '../molecules/ObjectRow';
import { ArrowLeft } from 'lucide-react';

const EvidenceGroupCard: React.FC<{ evidenceGroup: EvidenceGroup }> = ({ evidenceGroup }) => {
    const dispatch = useDispatch<AppDispatch>();
    const objectsInGroup = useSelector((state: RootState) => selectObjectsInGroup(state, evidenceGroup.id));

    return (
        <div className="w-full h-full flex flex-col bg-brand-surface animate-slide-in-bottom">
            {/* Self-contained Header */}
            <header className="p-4 flex items-start gap-4 flex-shrink-0 bg-black">
                <button
                    onClick={() => dispatch(goBack())}
                    className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10 mt-1 flex-shrink-0"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-6xl font-oswald text-white uppercase tracking-tighter leading-tight">
                    {evidenceGroup.name}
                </h1>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 w-full p-4 pb-24 overflow-y-auto">
                {/* Description at the top */}
                <p className="text-white mb-6 leading-relaxed">{evidenceGroup.description}</p>
                
                {/* "Items Found" is now the main content */}
                <h2 className="text-2xl font-oswald text-brand-primary mb-3 border-b border-brand-primary/30 pb-1 uppercase tracking-wider">
                    Items Found
                </h2>
                <div className="space-y-3">
                    {objectsInGroup.map(obj => <ObjectRow key={obj.id} object={obj} />)}
                </div>
            </div>
        </div>
    );
};

export default EvidenceGroupCard;