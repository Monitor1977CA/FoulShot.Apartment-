/**
 * @file MugshotCard.tsx
 * @description A dedicated card view for displaying a character's booking photo and physical details.
 * This component ensures a consistent UI for all types of evidence and information.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Character } from '../../types';
import { goBack } from '../../store/uiSlice';
import { AppDispatch, RootState } from '../../store';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';
import DataPair from '../molecules/DataPair';
import { selectObjectById } from '../../store/storySlice';
import { ArrowLeft } from 'lucide-react';

const MugshotCard: React.FC<{ character: Character }> = ({ character }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const handleGoBack = () => {
    dispatch(goBack());
  };
  
  // The mugshot is now a StoryObject, so we select it by its derived ID.
  const mugshotObject = useSelector((state: RootState) => selectObjectById(state, `obj_mugshot_${character.id}`));
  
  // Use the mugshot's prompt to generate the image.
  const { imageUrl, isLoading } = useCardImage(mugshotObject || null, 'selectiveColor');
  
  const physicalChars = character.components.find(c => c.type === 'physicalCharacteristics')?.props;

  return (
    <div className="w-full h-full flex flex-col bg-brand-surface animate-slide-in-bottom">
      <div className="relative w-full h-auto aspect-[3/4] flex-shrink-0 bg-brand-bg">
        <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={`Mugshot of ${character.name}`} objectFit="contain" />
        
        <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10"
            aria-label="Go back"
        >
            <ArrowLeft size={24} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/70 to-transparent"></div>
      </div>

      <div className="flex-1 w-full p-4 pb-24 -mt-16 overflow-y-auto z-10">
        <header className="flex items-start gap-2 mb-4">
            <div className="flex-1">
                 <h1 className="text-6xl font-oswald text-white uppercase tracking-tighter leading-tight">{`${character.name}`}</h1>
                 <p className="text-brand-text-muted text-lg">Police Department Booking Photo</p>
            </div>
        </header>
        
        {physicalChars && (
          <div className="border-t border-brand-border/50 pt-4">
             <h2 className="text-xl font-oswald text-brand-primary mb-2 uppercase">Physical Characteristics</h2>
             <div className="bg-black/30 p-3 rounded-lg border border-brand-border">
                <DataPair label="Height" value={physicalChars.height} />
                <DataPair label="Weight" value={physicalChars.weight} />
                <DataPair label="Eyes" value={physicalChars.eyes} />
                <DataPair label="Hair" value={physicalChars.hair} />
                <DataPair label="Distinctive Features" value={physicalChars.features} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MugshotCard;