/**
 * @file components/molecules/AssociatedCharacterInfo.tsx
 * @description A new, reusable component to display a summary of a character.
 * It's used within the expandable footer of the LocationCard to provide context about
 * who is associated with a given location. This component follows atomic design principles
 * by encapsulating a specific piece of UI logic, making it reusable and easy to maintain.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { Character } from '../../types';
import { AppDispatch } from '../../store';
import { setActiveCard, setLocationPanelExpanded } from '../../store/uiSlice';
import { useCardImage } from '../../hooks/useCardImage';
import ImageWithLoader from './ImageWithLoader';

interface AssociatedCharacterInfoProps {
  character: Character;
  locationId: string;
}

const AssociatedCharacterInfo: React.FC<AssociatedCharacterInfoProps> = React.memo(({ character, locationId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { imageUrl, isLoading } = useCardImage(character, 'monochrome');

  const handleCardClick = () => {
    // Ensure the panel will be expanded when the user navigates back.
    dispatch(setLocationPanelExpanded({ locationId, isExpanded: true }));
    // Navigate to the character card.
    dispatch(setActiveCard({ id: character.id, type: 'character' }));
  };

  return (
    <div 
      className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/50 flex items-start gap-4 cursor-pointer hover:bg-brand-primary/10 transition-colors"
      onClick={handleCardClick}
      role="button"
      aria-label={`View details for ${character.name}`}
    >
      <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 border-brand-border bg-brand-bg">
        <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={character.name} objectFit="cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-oswald text-lg text-brand-text uppercase truncate">{character.name}</h4>
        <p className="text-sm text-brand-text-muted">{character.age}, {character.occupation}</p>
        <p className="text-xs text-brand-text-muted mt-2 line-clamp-2">{character.description}</p>
      </div>
    </div>
  );
});

export default AssociatedCharacterInfo;