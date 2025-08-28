/**
 * @file SuspectAvatar.tsx
 * @description A reusable atomic component for displaying a suspect's circular avatar.
 * This component was extracted from TimelineEventCard to improve reusability and
 * adhere to the principles of atomic design.
 */
import React from 'react';
import { Character } from '../../types';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';

interface SuspectAvatarProps {
  suspect: Character;
}

const SuspectAvatar: React.FC<SuspectAvatarProps> = React.memo(({ suspect }) => {
  const { imageUrl, isLoading } = useCardImage(suspect, 'monochrome');
  return (
    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-brand-surface bg-brand-bg" title={suspect.name}>
      <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={suspect.name} objectFit="cover" />
    </div>
  );
});

export default SuspectAvatar;
