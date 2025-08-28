/**
 * @file PeopleList.tsx
 * @description Renders the main list of characters, categorized by their role.
 * This file has been refactored to follow React best practices by extracting
 * sub-components to the top level, improving performance and stability.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { selectVictims, selectSuspects, selectWitnesses } from '../../store/storySlice';
import { setActiveCard } from '../../store/uiSlice';
import { Character } from '../../types';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';

/**
 * --- Extracted Sub-Component: CharacterRow ---
 * Moved to the top level to prevent re-creation on every render, improving performance.
 */
const CharacterRow: React.FC<{ character: Character; onClick: (character: Character) => void }> = React.memo(({ character, onClick }) => {
  const isImportant = character.role === 'victim' || character.isSuspect;
  const colorTreatment = isImportant ? 'selectiveColor' : 'monochrome';
  const { imageUrl, isLoading } = useCardImage(character, colorTreatment);

  return (
      <div 
        className="flex items-center bg-brand-surface p-3 rounded-lg mb-3 cursor-pointer hover:bg-brand-border transition-colors duration-200 animate-fade-in border-l-4 border-transparent hover:border-brand-primary"
        onClick={() => onClick(character)}
      >
        <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4 border border-brand-border bg-brand-bg">
          <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={character.name} objectFit="cover" />
        </div>
        <div>
          <h3 className="text-lg font-oswald text-brand-text">{character.name}</h3>
          <p className="text-sm text-brand-text-muted">{character.occupation}</p>
        </div>
      </div>
  );
});

/**
 * --- Extracted Sub-Component: Section ---
 * A presentational component for displaying a titled list of characters.
 * Moved to the top level for stability and performance.
 */
const Section: React.FC<{ title: string; characters: Character[]; onCardClick: (character: Character) => void }> = ({ title, characters, onCardClick }) => (
  characters.length > 0 ? (
    <section className="mb-6">
      <h2 className="text-2xl font-oswald text-brand-primary mb-3 border-b border-brand-primary/30 pb-1 uppercase tracking-wider">{title}</h2>
      {characters.map(char => <CharacterRow key={char.id} character={char} onClick={onCardClick} />)}
    </section>
  ) : null
);

/**
 * The main component for the "People" view.
 */
const PeopleList: React.FC = () => {
  const dispatch = useDispatch();
  const victims = useSelector((state: RootState) => selectVictims(state));
  const suspects = useSelector((state: RootState) => selectSuspects(state));
  const witnesses = useSelector((state: RootState) => selectWitnesses(state));

  const handleCardClick = React.useCallback((character: Character) => {
    dispatch(setActiveCard({ id: character.id, type: 'character' }));
  }, [dispatch]);

  return (
    <div className="p-4 pb-24 overflow-y-auto h-full">
      <h1 className="text-4xl font-oswald text-brand-accent mb-6 uppercase">People</h1>
      <Section title="Victim" characters={victims} onCardClick={handleCardClick} />
      <Section title="Suspects" characters={suspects} onCardClick={handleCardClick} />
      <Section title="Witnesses" characters={witnesses} onCardClick={handleCardClick} />
    </div>
  );
};

export default PeopleList;