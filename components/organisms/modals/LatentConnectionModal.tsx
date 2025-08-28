/**
 * @file LatentConnectionModal.tsx
 * @description The modal for the "Ten" (twist) moment in the new forensic gameplay loop.
 * It appears when the player discovers an object that links to a previously-made forensic
 * finding, revealing the connection in a narratively satisfying way.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { hideModal } from '../../../store/uiSlice';
import { LatentConnection, StoryObject } from '../../../types';
import Button from '../../atoms/Button';
import { useCardImage } from '../../../hooks/useCardImage';
import ImageWithLoader from '../../molecules/ImageWithLoader';
import { Lightbulb, Link2 } from 'lucide-react';

interface LatentConnectionModalProps {
  connection: LatentConnection;
  targetObject: StoryObject;
}

const EvidenceCard: React.FC<{ object: StoryObject, label: string }> = ({ object, label }) => {
    const { imageUrl, isLoading } = useCardImage(object, 'selectiveColor');
    return (
        <div className="flex flex-col items-center text-center gap-2">
            <p className="font-oswald text-xs uppercase tracking-wider text-brand-text-muted">{label}</p>
            <div className="w-28 h-36 rounded-lg overflow-hidden border-2 border-brand-border bg-brand-bg shadow-lg">
                <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={object.name} />
            </div>
            <p className="font-oswald text-sm text-white uppercase leading-tight h-10">{object.name}</p>
        </div>
    );
};

const LatentConnectionModal: React.FC<LatentConnectionModalProps> = ({ connection, targetObject }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { finding } = connection;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => dispatch(hideModal())}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-sm border-2 border-brand-primary overflow-hidden animate-slide-in-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-3 bg-brand-primary/20 text-center border-b-2 border-brand-primary/50">
            <div className="flex justify-center items-center gap-3">
                 <Lightbulb className="w-7 h-7 text-brand-primary" />
                 <h2 className="text-2xl font-oswald text-white uppercase tracking-wider">Potential Evidence Link</h2>
            </div>
        </header>
        
        <main className="p-4">
            <p className="text-center text-sm text-brand-text-muted mb-4">
                Detective, my previous analysis of the <span className="font-bold text-white">{finding.name}</span> may be relevant to the <span className="font-bold text-white">{targetObject.name}</span> you've just discovered.
            </p>
            
            <div className="flex justify-center items-center gap-2 my-4">
                <EvidenceCard object={finding} label="Previous Finding" />
                <Link2 size={32} className="text-brand-primary flex-shrink-0 animate-pulse-glow" />
                <EvidenceCard object={targetObject} label="New Evidence" />
            </div>

            <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                <h3 className="font-oswald text-brand-primary uppercase tracking-wider text-sm mb-1">ADA's Analysis</h3>
                <p className="text-sm text-white leading-relaxed">
                    The forensic signature of the '{finding.name}' is consistent with the characteristics of the '{targetObject.name}'. While not definitive proof, this establishes a strong potential link between these two pieces of evidence. This new connection has been added to the case file.
                </p>
            </div>

            <div className="mt-4">
                 <Button onClick={() => dispatch(hideModal())} className="w-full uppercase">
                    Acknowledge
                 </Button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default LatentConnectionModal;
