/**
 * @file ForensicFindingModal.tsx
 * @description A modal that provides a dramatic, full-screen "reveal" for a newly synthesized
 *              "Forensic Finding." This is a key reward moment for the player after a successful
 *              deduction using the Forensic Lens.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { hideModal, showModal } from '../../../store/uiSlice';
import { StoryObject } from '../../../types';
import Button from '../../atoms/Button';
import { useCardImage } from '../../../hooks/useCardImage';
import ImageWithLoader from '../../molecules/ImageWithLoader';
import { CheckCircle } from 'lucide-react';

interface ForensicFindingModalProps {
  object: StoryObject;
}

const ForensicFindingModal: React.FC<ForensicFindingModalProps> = ({ object }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { imageUrl, isLoading } = useCardImage(object, 'selectiveColor');

  /**
   * Closes the current modal and opens the AssignSuspectModal for the newly created object.
   * This integrates the forensic finding directly into the core evidence management loop.
   */
  const handleAddToCaseFile = () => {
    dispatch(hideModal());
    dispatch(showModal({
        type: 'assignSuspect',
        props: { objectId: object.id }
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => dispatch(hideModal())}
    >
      <div
        className="relative bg-brand-surface w-full max-w-sm rounded-xl overflow-hidden border-2 border-brand-accent shadow-2xl shadow-brand-accent/30 animate-slide-in-bottom"
        onClick={(e) => e.stopPropagation()}
        style={{ '--glow-color': '#00F0FF' } as React.CSSProperties}
      >
         <header className="p-3 bg-brand-accent/10 text-center border-b-2 border-brand-accent/50">
            <div className="flex justify-center items-center gap-3">
                 <CheckCircle className="w-7 h-7 text-brand-accent" />
                 <h2 className="text-2xl font-oswald text-white uppercase tracking-wider">Forensic Finding Unlocked</h2>
            </div>
        </header>
        
        <div className="w-full h-auto aspect-[4/3] bg-brand-bg">
          <ImageWithLoader 
            imageUrl={imageUrl} 
            isLoading={isLoading} 
            alt={`Forensic Finding: ${object.name}`} 
            objectFit="cover"
          />
        </div>
        
        <div className="p-4">
            <h3 className="font-oswald text-2xl text-white uppercase tracking-wide mb-2">{object.name}</h3>
            <p className="text-brand-text-muted leading-relaxed mb-4">{object.description}</p>
            <Button onClick={handleAddToCaseFile} className="w-full uppercase">
                Add to Case File
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ForensicFindingModal;
