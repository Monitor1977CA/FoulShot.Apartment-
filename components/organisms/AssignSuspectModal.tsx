/**
 * @file AssignSuspectModal.tsx
 * @description A modal for assigning a piece of evidence to one or more suspects or filing it in the evidence locker.
 * This component has been completely redesigned for a more visual, unified, and intuitive user experience.
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { hideModal, showModal, checkMilestoneProgress, addNewlyAddedEvidenceId } from '../../store/uiSlice';
import { selectSuspects, selectObjectById, setAssignedSuspects, addToTimeline, selectLocationById } from '../../store/storySlice';
import { addUnlockedClue } from '../../store/caseFileSlice';
import { useADA } from '../../hooks/useADA';
import { PlayerAction, Character, StoryObject } from '../../types';
import { X, FolderKanban, Check, MapPin } from 'lucide-react';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';
import Button from '../atoms/Button';
import { caseFileCluesById } from '../../data/caseFileData';

interface AssignSuspectModalProps {
  objectId: string;
  initialAssignments?: { suspectIds: string[] };
}

// Internal Component: A single choice in the assignment grid (either a suspect or the locker)
const AssignmentTarget: React.FC<{
  label: string;
  imageUrl?: string | null;
  Icon?: React.ElementType;
  isLoading?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}> = React.memo(({ label, imageUrl, Icon, isLoading, isSelected, onSelect }) => {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 w-24 text-center">
      <button 
        onClick={onSelect} 
        className={`relative w-20 h-20 rounded-full border-4 p-1 transition-all duration-200 group ${isSelected ? 'border-brand-primary' : 'border-brand-border hover:border-brand-primary/50'}`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-brand-bg relative">
          {Icon && <div className="w-full h-full flex items-center justify-center text-brand-text-muted group-hover:text-brand-primary/80 transition-colors"><Icon size={32} /></div>}
          {imageUrl !== undefined && <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading || false} alt={label} objectFit="cover" />}
           {isSelected && (
            <div className="absolute inset-0 bg-brand-primary/70 flex items-center justify-center backdrop-blur-sm">
              <Check size={32} className="text-white" />
            </div>
          )}
        </div>
      </button>
      <span className={`text-xs font-oswald uppercase tracking-wider transition-colors ${isSelected ? 'text-brand-primary font-bold' : 'text-brand-text-muted group-hover:text-white'}`}>
        {label}
      </span>
    </div>
  );
});

const AssignSuspectModal: React.FC<AssignSuspectModalProps> = ({ objectId, initialAssignments }) => {
    const dispatch = useDispatch<AppDispatch>();
    const triggerADA = useADA();
    const suspects = useSelector((state: RootState) => selectSuspects(state));
    const object = useSelector((state: RootState) => selectObjectById(state, objectId));
    const location = useSelector((state: RootState) => object ? selectLocationById(state, object.locationFoundId) : null);

    const [isClosing, setIsClosing] = useState(false);
    
    // State to manage selections. `undefined` means no selection has been made yet.
    const [selectedSuspectIds, setSelectedSuspectIds] = useState<Set<string> | undefined>(
        initialAssignments ? new Set(initialAssignments.suspectIds) : undefined
    );

    const { imageUrl: objectImageUrl, isLoading: isObjectImageLoading } = useCardImage(object, 'selectiveColor');

    const handleToggleSuspect = (suspectId: string) => {
        setSelectedSuspectIds(prev => {
            const newSet = prev ? new Set(prev) : new Set<string>();
            if (newSet.has(suspectId)) {
                newSet.delete(suspectId);
            } else {
                newSet.add(suspectId);
            }
            return newSet;
        });
    };
    
    const isLockerSelected = selectedSuspectIds instanceof Set && selectedSuspectIds.size === 0;

    const handleSelectLocker = () => {
      setSelectedSuspectIds(new Set());
    }

    const handleConfirm = () => {
        if (!object || selectedSuspectIds === undefined) return;

        const finalSuspectIds = Array.from(selectedSuspectIds);

        dispatch(addToTimeline(object.id));
        dispatch(setAssignedSuspects({ objectId: object.id, suspectIds: finalSuspectIds }));
        
        // --- Core Gameplay Integration ---
        // Check if this object unlocks a clue for the case file puzzle.
        const clueIdToUnlock = object.metadata?.unlocksCaseFileClueId;
        if (clueIdToUnlock) {
            const clueData = caseFileCluesById.get(clueIdToUnlock);
            if (clueData) {
                // If a valid clue is found, dispatch the action to add it to the evidence pool.
                dispatch(addUnlockedClue(clueData));
            }
        }
        
        handleClose();
        
        if (!object.hasBeenUnlocked) {
          dispatch(showModal({ type: 'rarityReveal', props: { objectId: object.id } }));
        }
        
        dispatch(checkMilestoneProgress());
        dispatch(addNewlyAddedEvidenceId(`ev-${object.id}`));

        const assignedNames = suspects.filter(s => finalSuspectIds.includes(s.id)).map(s => s.name).join(', ');
        const actionText = finalSuspectIds.length > 0
            ? `has assigned the ${object.name} to ${assignedNames}.`
            : `has added the ${object.name} to the evidence locker.`;
        triggerADA(PlayerAction.ASSIGN_EVIDENCE, actionText, object.imagePrompt);
    };

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
          dispatch(hideModal());
      }, 300);
    };

    if (!object) {
      return null;
    }

    // A sub-component for the suspect avatar to use the card image hook
    const SuspectTarget: React.FC<{ suspect: Character }> = ({ suspect }) => {
      const { imageUrl, isLoading } = useCardImage(suspect, 'monochrome');
      return (
        <AssignmentTarget
          label={suspect.name}
          imageUrl={imageUrl}
          isLoading={isLoading}
          isSelected={!!selectedSuspectIds && selectedSuspectIds.has(suspect.id)}
          onSelect={() => handleToggleSuspect(suspect.id)}
        />
      );
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-slide-out-bottom' : 'animate-slide-in-bottom'}`} 
            onClick={handleClose}
        >
            <div 
                className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-sm border-2 border-brand-border overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b-2 border-brand-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-oswald text-brand-primary uppercase tracking-wider">LINK EVIDENCE</h2>
                    <button 
                        className="p-2 rounded-full text-white/50 hover:bg-brand-primary hover:text-white transition-colors"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </header>

                <main className="p-4 text-center max-h-[60vh] overflow-y-auto flex-1">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-brand-border bg-brand-bg shadow-lg mb-2">
                        <ImageWithLoader imageUrl={objectImageUrl} isLoading={isObjectImageLoading} alt={object.name} />
                      </div>
                      <p className="font-oswald text-lg text-white uppercase">{object.name}</p>
                      {location && (
                        <div className="flex items-center gap-1.5 text-xs text-brand-text-muted mt-1">
                          <MapPin size={12} />
                          <span>FOUND AT: {location.name.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-brand-text mb-4">Assign this evidence to a suspect's timeline, or file it in the general evidence locker.</p>
                    <div className="flex justify-center flex-wrap gap-x-3 gap-y-4">
                        <AssignmentTarget
                          label="Locker"
                          Icon={FolderKanban}
                          isSelected={isLockerSelected}
                          onSelect={handleSelectLocker}
                        />
                        {suspects.map(suspect => (
                          <SuspectTarget key={suspect.id} suspect={suspect} />
                        ))}
                    </div>
                </main>

                <footer className="p-4 border-t-2 border-brand-border flex-shrink-0">
                    <Button 
                        onClick={handleConfirm}
                        disabled={selectedSuspectIds === undefined}
                        className="w-full uppercase font-oswald tracking-wider"
                    >
                        FILE EVIDENCE
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default AssignSuspectModal;