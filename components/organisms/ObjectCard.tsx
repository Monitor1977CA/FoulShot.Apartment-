/**
 * @file ObjectCard.tsx
 * @description Renders the detailed view for a single object. This component is now fully data-driven,
 * rendering its sidebar actions dynamically based on the object's `components` array and the central
 * `componentRegistry`. The core gameplay loop of adding an item to the timeline is initiated here.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoryObject, PlayerAction, DataComponent, PurchaseInfo, Interaction } from '../../types';
import { selectSuspects, checkAndResolveConnections, markObjectAsAnalyzed, selectObjectById } from '../../store/storySlice';
import { AppDispatch, RootState } from '../../store';
import { goBack, showModal } from '../../store/uiSlice';
import ImageWithLoader from '../molecules/ImageWithLoader';
import SidebarActionButton from '../atoms/SidebarActionButton';
import { useADA } from '../../hooks/useADA';
import { useCardImage } from '../../hooks/useCardImage';
import { COMPONENT_REGISTRY } from './componentRegistry';
import Button from '../atoms/Button';
import { FileText, Beaker, CheckSquare, ArrowLeft, Microscope, Info, Link } from 'lucide-react';
import ForensicLensView from './forensic_lens/ForensicLensView';
import ObjectRow from '../molecules/ObjectRow';

const ObjectCard: React.FC<{ object: StoryObject }> = ({ object }) => {
  const dispatch = useDispatch<AppDispatch>();
  const triggerADA = useADA();
  const suspects = useSelector((state: RootState) => selectSuspects(state));
  const [isLensActive, setIsLensActive] = useState(false);

  // --- Latent Connection System ---
  // When this card is viewed, we check if this object resolves any pending latent connections.
  useEffect(() => {
    if (object?.id) {
        dispatch(checkAndResolveConnections(object.id));
    }
  }, [object, dispatch]);
  
  const findings = useSelector((state: RootState) => 
    object.findingIds?.map(id => selectObjectById(state, id)).filter(Boolean) as StoryObject[] || []
  );

  const handleGoBack = () => {
    dispatch(goBack());
  };

  /**
   * --- Core Gameplay Loop & Encapsulated User Flow ---
   * This function handles adding or updating an item by opening the assignment modal.
   * It passes the object's current assignment state to the modal for pre-population.
   */
  const handleCollectOrUpdate = () => {
    dispatch(showModal({
      type: 'assignSuspect',
      props: {
        objectId: object.id,
        initialAssignments: object.isEvidence
          ? { suspectIds: object.assignedToSuspectIds }
          : undefined,
      }
    }));
  };

  /**
   * --- Robust Data Check ---
   * This helper function determines if a component's data is meaningful enough to warrant
   * an active button. It prevents users from opening empty modals. This is a key
   * maintainability improvement, making the UI more resilient to future changes in the data structure.
   * @param comp The data component to check.
   * @returns {boolean} True if the component's data is considered empty or invalid.
   */
  const isDataEmpty = (comp: DataComponent): boolean => {
    if (!comp.props) return true;
    switch (comp.type) {
      case 'purchaseInfo':
        const info = comp.props as PurchaseInfo;
        return !info.brand && !info.model && !info.sku && !info.manufacturer && (!info.receipts || info.receipts.length === 0);
      case 'interaction':
        const interaction = comp.props as Interaction;
        return !interaction.prompt || !interaction.solution;
      default:
        return false;
    }
  };
  
  const colorTreatment = object.isEvidence ? 'selectiveColor' : 'monochrome';
  const { imageUrl, isLoading } = useCardImage(object, colorTreatment);

  const descriptionToShow = object.hasBeenUnlocked 
    ? object.description 
    : object.unidentifiedDescription || object.description;
    
  // A helper component to render the current assignment status.
  const renderAssignmentStatus = () => {
    if (!object.isEvidence) return null;
    
    const assignedSuspects = suspects.filter(s => object.assignedToSuspectIds.includes(s.id));

    let statusText;
    if (assignedSuspects.length > 0) {
        statusText = `ASSIGNED TO: ${assignedSuspects.map(s => s.name.toUpperCase()).join(', ')}`;
    } else {
        statusText = "FILED IN: EVIDENCE LOCKER";
    }

    return (
        <div className="text-center bg-black/30 p-3 rounded-lg border border-brand-border mb-4">
            <p className="font-oswald text-sm text-green-400 uppercase tracking-wider">{statusText}</p>
        </div>
    );
  };
  
  // If the Forensic Lens is active, render the dedicated view.
  if (isLensActive && imageUrl) {
    return <ForensicLensView object={object} imageUrl={imageUrl} onClose={() => setIsLensActive(false)} />;
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-brand-surface animate-slide-in-bottom">
      <main className="flex-1 w-full bg-brand-surface overflow-y-auto pb-24">
        <div className="relative w-full h-auto aspect-[3/4] flex-shrink-0 bg-brand-bg">
          <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={object.name} objectFit="cover" />
          
          <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10 flex flex-col gap-2">
            {object.components.map(component => {
                const registryEntry = COMPONENT_REGISTRY[component.type];
                if (!registryEntry) return null;
                
                const isDisabled = isDataEmpty(component);
                
                return (
                    <SidebarActionButton
                        key={component.type}
                        label={registryEntry.label}
                        Icon={registryEntry.Icon}
                        onClick={() => {
                          if (registryEntry.modal && !isDisabled) {
                            dispatch(showModal({ type: registryEntry.modal, props: component.props }));
                          }
                        }}
                        disabled={isDisabled}
                    />
                );
            })}
          </div>

          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/70 to-transparent"></div>
        </div>
        <div className="p-4 -mt-16 z-10 relative">
          <header className="flex items-start gap-2 mb-4">
            <h1 className="text-6xl font-oswald text-white uppercase tracking-tighter leading-tight flex-1">{object.name}</h1>
          </header>
          {renderAssignmentStatus()}
          <div className="space-y-2 mb-6">
              <Button
                  onClick={handleCollectOrUpdate}
                  className="w-full uppercase font-oswald tracking-wider"
              >
                  {object.isEvidence ? 'Update Evidence Assignment' : 'Collect Evidence'}
              </Button>
              {object.forensicScan && !object.isFullyAnalyzed && (
                 <Button
                    onClick={() => setIsLensActive(true)}
                    variant="secondary"
                    className="w-full uppercase font-oswald tracking-wider flex items-center justify-center gap-2"
                >
                    <Microscope size={16} />
                    Activate Forensic Lens
                </Button>
              )}
          </div>
          <p className="text-white leading-relaxed">{descriptionToShow}</p>

          {/* --- ENHANCED LUDEMIC LOOP: CONDITIONAL FORENSIC DETAILS --- */}
          {object.forensicDetails && (
            <div className="mt-6 border-t border-brand-border/50 pt-6">
              {object.isFullyAnalyzed ? (
                // --- THE REWARD: Render full details with a reveal animation ---
                <div className="space-y-6 animate-reveal-section">
                  <div>
                    <h2 className="text-lg font-oswald uppercase tracking-wider text-brand-accent pr-4 flex items-center gap-2 mb-2">
                      <FileText size={20} />
                      Forensic Analysis
                    </h2>
                    <p className="text-white leading-relaxed">{object.forensicDetails.analysis}</p>
                  </div>

                  {object.forensicDetails.findings && (
                    <div>
                      <h3 className="font-oswald text-brand-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <CheckSquare size={20} />
                        Key Findings
                      </h3>
                      <ul className="list-disc list-inside text-white space-y-1 pl-2">
                        {object.forensicDetails.findings.map((finding, i) => <li key={i}>{finding}</li>)}
                      </ul>
                    </div>
                  )}
                  {object.forensicDetails.labNotes && (
                    <div>
                      <h3 className="font-oswald text-brand-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Beaker size={20} />
                        Lab Notes
                      </h3>
                      <div className="bg-black/20 p-3 rounded-lg border border-brand-border">
                        <p className="text-sm text-brand-text-muted italic">{object.forensicDetails.labNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // --- THE PROMPT: Encourage the player to use the lens ---
                <div className="bg-brand-bg/50 p-4 rounded-lg border-2 border-dashed border-brand-border text-center">
                   <div className="flex justify-center mb-2">
                        <Info size={24} className="text-brand-primary" />
                   </div>
                   <h2 className="font-oswald text-brand-primary uppercase tracking-wider">Detailed Analysis Pending</h2>
                   <p className="text-sm text-brand-text-muted mt-1">
                     Use the <span className="font-bold text-white">Forensic Lens</span> to uncover hidden links and unlock the full analysis of this item.
                   </p>
                </div>
              )}
            </div>
          )}

          {/* --- NEW: Linked Forensic Findings Display --- */}
          {findings.length > 0 && (
            <div className="mt-6 border-t border-brand-border/50 pt-6 animate-reveal-section">
              <h2 className="text-lg font-oswald uppercase tracking-wider text-brand-accent pr-4 flex items-center gap-2 mb-2">
                <Link size={20} />
                Linked Forensic Findings
              </h2>
              <div className="space-y-3">
                {findings.map(finding => (
                  <ObjectRow key={finding.id} object={finding} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ObjectCard;