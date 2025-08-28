/**
 * @file BodyCamView.tsx
 * @description A component that renders the "body cam" view for an interview, including the image slideshow and overlays.
 */
import React, { useState, useEffect } from 'react';
import ImageWithLoader from './ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';

interface BodyCamViewProps {
  characterId: string;
  witnessName: string;
  prompts: string[];
  currentImageIndex: number;
}

const BodyCamView: React.FC<BodyCamViewProps> = ({ characterId, witnessName, prompts, currentImageIndex }) => {
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { imageUrl, isLoading } = useCardImage({
    id: `interview-${characterId}-${currentImageIndex}`,
    imagePrompt: prompts[currentImageIndex],
  }, 'monochrome');

  return (
    <div className="w-full h-48 rounded-lg overflow-hidden relative bg-black flex-shrink-0 border border-brand-border/50">
      <ImageWithLoader
        imageUrl={imageUrl}
        isLoading={isLoading}
        alt={`Body cam view of ${witnessName}`}
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start text-white font-mono text-[10px]">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold">REC</span>
          </div>
          <div>{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 text-white pointer-events-none">
        <p className="text-[10px] uppercase opacity-70">Subject</p>
        <p className="text-base font-oswald uppercase tracking-wider">{witnessName}</p>
      </div>
    </div>
  );
};

export default BodyCamView;