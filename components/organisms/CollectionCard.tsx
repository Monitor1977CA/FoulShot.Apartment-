/**
 * @file CollectionCard.tsx
 * @description A new, generic card component to display a collection of objects
 * associated with a character component (e.g., phone logs, police files).
 * This is a key part of the new, unified architecture.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Character, StoryObject } from '../../types';
import { AppDispatch, RootState } from '../../store';
import { goBack, setActiveCard } from '../../store/uiSlice';
import { selectObjectsForCharacterCollection } from '../../store/storySlice';
import ObjectRow from '../molecules/ObjectRow';
import { ArrowLeft } from 'lucide-react';


const CollectionCard: React.FC<{ character: Character; collectionType: string; title: string; }> = ({ character, collectionType, title }) => {
    const dispatch = useDispatch<AppDispatch>();
    const objects = useSelector((state: RootState) => selectObjectsForCharacterCollection(state, character.id, collectionType));

    return (
        <div className="w-full h-full flex flex-col bg-brand-surface animate-slide-in-bottom">
            <header className="p-4 flex items-start gap-4 flex-shrink-0 bg-black">
                <button
                    onClick={() => dispatch(goBack())}
                    className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10 mt-1 flex-shrink-0"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-6xl font-oswald text-white uppercase tracking-tighter leading-tight">{title}</h1>
                    <p className="text-brand-text-muted text-lg">{character.name}</p>
                </div>
            </header>

            <div className="flex-1 w-full p-4 pb-24 overflow-y-auto">
                {objects.length > 0 ? (
                    <div className="space-y-3">
                        {objects.map(obj => <ObjectRow key={obj.id} object={obj} />)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center">
                        <p className="text-brand-text-muted">No records found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionCard;