/**
 * @file TimelineView.tsx
 * @description The main component for the new "Interactive Case File" feature.
 * This view replaces the old timeline and serves as the core puzzle-solving mechanic of the game.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setViewMode,
  setActiveTab,
  placeClueInSlot,
  clearLastIncorrectSlot,
  selectActiveAnchor,
  selectUnplacedClues,
  selectClueById,
  selectSlotById,
  selectIsInvestigationComplete,
  selectIsPrimarySlotFilledForActiveAnchor
} from '../../store/caseFileSlice';
import { showModal } from '../../store/uiSlice';
import { CaseFileViewMode, TimelineAnchorCategory, Clue } from '../../types';
import { BrainCircuit, Hammer, Clock, FolderKanban, ClipboardCheck, X } from 'lucide-react';
import Button from '../atoms/Button';

const CATEGORY_CONFIG: { [key in TimelineAnchorCategory]: { Icon: React.ElementType, title: string } } = {
  motive: { Icon: BrainCircuit, title: 'The Motive' },
  means: { Icon: Hammer, title: 'The Means' },
  opportunity: { Icon: Clock, title: 'The Opportunity' },
};

// --- Sub-component: A single draggable clue in the Evidence Pool ---
const ClueCard: React.FC<{ clue: Clue }> = React.memo(({ clue }) => {
  const { Icon } = CATEGORY_CONFIG[clue.category];

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', clue.id)}
      className="bg-brand-bg p-3 rounded-lg border-2 border-brand-border cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <Icon size={18} className="text-brand-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-white">{clue.text}</p>
      </div>
    </div>
  );
});

// --- Sub-component: A single slot where a clue can be placed ---
const EvidenceSlotComponent: React.FC<{ slotId: string; isPrimary: boolean; isEnabled: boolean }> = ({ slotId, isPrimary, isEnabled }) => {
  const dispatch = useDispatch<AppDispatch>();
  const slot = useSelector((state: RootState) => selectSlotById(state, slotId));
  const placedClue = useSelector((state: RootState) => slot?.placedClueId ? selectClueById(state, slot.placedClueId) : null);
  const lastIncorrectSlotId = useSelector((state: RootState) => state.caseFile.lastIncorrectSlotId);

  const isIncorrect = lastIncorrectSlotId === slotId;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isEnabled) return;
    const clueId = e.dataTransfer.getData('text/plain');
    dispatch(placeClueInSlot({ clueId, slotId }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Trigger the 'shake' animation if this was the last incorrect drop target.
  const animationClass = isIncorrect ? 'animate-shake' : '';

  useEffect(() => {
    if (isIncorrect) {
      const timer = setTimeout(() => {
        dispatch(clearLastIncorrectSlot());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isIncorrect, dispatch]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative rounded-lg border-2 border-dashed transition-colors duration-200 ${animationClass} ${isEnabled ? 'border-brand-border hover:border-brand-primary hover:bg-brand-primary/10' : 'border-brand-border/50 bg-black/20'}`}
      style={{ minHeight: isPrimary ? '80px' : '60px' }}
    >
      {!isEnabled && !placedClue && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-text-muted/50 p-2 text-center">
          {isPrimary ? 'Start by placing the Primary Event' : 'Fill Primary Event first'}
        </div>
      )}
      {placedClue && (
        <div className="w-full h-full bg-brand-surface p-3 rounded-md flex items-center animate-fragment-lock">
          <p className="text-sm text-white">{placedClue.text}</p>
        </div>
      )}
    </div>
  );
};

// --- Main View Component for the Timeline ---
const TimelineView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewMode, activeTab } = useSelector((state: RootState) => state.caseFile);
  const activeAnchor = useSelector(selectActiveAnchor);
  const unplacedClues = useSelector(selectUnplacedClues);
  const isComplete = useSelector(selectIsInvestigationComplete);
  const isPrimarySlotFilled = useSelector(selectIsPrimarySlotFilledForActiveAnchor);

  // When the puzzle is solved, show the victory modal.
  useEffect(() => {
    if (isComplete) {
      dispatch(showModal({ type: 'caseSolved' }));
    }
  }, [isComplete, dispatch]);
  
  const handleTabClick = (tab: TimelineAnchorCategory) => dispatch(setActiveTab(tab));

  return (
    <div className="p-4 pb-24 h-full flex flex-col bg-brand-bg">
      <header className="flex-shrink-0 mb-4">
        <h1 className="text-4xl font-oswald text-brand-accent mb-4 uppercase">Interactive Case File</h1>
        <div className="bg-brand-surface p-1 rounded-lg flex space-x-1 border border-brand-border">
          <Button onClick={() => dispatch(setViewMode('workspace'))} className={`flex-1 ${viewMode === 'workspace' ? '' : 'bg-transparent text-brand-text-muted'}`}><ClipboardCheck size={16} /> Workspace</Button>
          <Button onClick={() => dispatch(setViewMode('evidence_pool'))} className={`flex-1 ${viewMode === 'evidence_pool' ? '' : 'bg-transparent text-brand-text-muted'}`}><FolderKanban size={16} /> Evidence Pool</Button>
        </div>
      </header>

      {viewMode === 'workspace' && activeAnchor && (
        <main className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4 sticky top-0 bg-brand-bg py-2 z-10">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <button key={key} onClick={() => handleTabClick(key as TimelineAnchorCategory)} className={`px-4 py-2 rounded-full text-sm font-oswald uppercase tracking-wider transition-colors ${activeTab === key ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text-muted'}`}>
                    {config.title}
                </button>
            ))}
          </div>
          <div className="animate-fade-in">
            <h2 className="text-2xl font-oswald text-brand-primary uppercase tracking-wider">{activeAnchor.title}</h2>
            <p className="text-sm text-brand-text-muted mb-4">{activeAnchor.timeLabel}</p>
            
            <h3 className="font-oswald text-lg text-brand-accent mb-2">Primary Event</h3>
            <EvidenceSlotComponent slotId={activeAnchor.primarySlot.slotId} isPrimary={true} isEnabled={true} />
            
            <h3 className="font-oswald text-lg text-brand-accent mt-4 mb-2">Supporting Evidence</h3>
            <div className="space-y-2">
              {activeAnchor.supportingSlots.map(slot => (
                <EvidenceSlotComponent key={slot.slotId} slotId={slot.slotId} isPrimary={false} isEnabled={isPrimarySlotFilled} />
              ))}
            </div>
          </div>
        </main>
      )}

      {viewMode === 'evidence_pool' && (
        <main className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="space-y-3 animate-fade-in">
                {unplacedClues.length > 0 ? (
                    unplacedClues.map(clue => <ClueCard key={clue.id} clue={clue} />)
                ) : (
                    <div className="text-center text-brand-text-muted p-8">
                        <p>No new clues available in the evidence pool.</p>
                        <p className="text-sm mt-1">Discover key evidence during your investigation to unlock more clues.</p>
                    </div>
                )}
            </div>
        </main>
      )}
    </div>
  );
};

export default TimelineView;