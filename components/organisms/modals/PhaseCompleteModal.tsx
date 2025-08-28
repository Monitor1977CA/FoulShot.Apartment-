/**
 * @file PhaseCompleteModal.tsx
 * @description A modal that appears when the player successfully completes an interrogation phase.
 */
import React from 'react';
import { Insight } from '../../../types';
import Button from '../../atoms/Button';
import { CheckCircle, Lightbulb, Target } from 'lucide-react';

interface PhaseCompleteModalProps {
  lineOfInquiryLabel: string;
  insight?: Insight;
  onConfirm: () => void;
}

const PhaseCompleteModal: React.FC<PhaseCompleteModalProps> = ({ lineOfInquiryLabel, insight, onConfirm }) => {
  
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onConfirm}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-sm border-2 border-brand-accent overflow-hidden animate-slide-in-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 bg-brand-accent/10 text-center">
            <div className="flex justify-center items-center gap-3">
                 <CheckCircle className="w-8 h-8 text-brand-accent" />
                 <h2 className="text-3xl font-oswald text-white uppercase tracking-wider">Phase Complete</h2>
            </div>
        </header>
        <main className="p-6 space-y-4">
          <p className="text-center text-brand-text-muted">You've successfully pursued the line of inquiry:</p>
          <p className="text-center font-oswald text-xl text-white uppercase">"{lineOfInquiryLabel}"</p>
          
          {insight && (
            <div className="mt-4 pt-4 border-t border-brand-accent/30 space-y-3">
              <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                <h3 className="font-oswald text-brand-accent uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Lightbulb size={16} />
                    ADA's Justification
                </h3>
                <p className="text-brand-text-muted">{insight.justification}</p>
              </div>
              <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                <h3 className="font-oswald text-brand-accent uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Target size={16} />
                    New Lead
                </h3>
                <p className="text-white font-semibold">{insight.newLead}</p>
              </div>
            </div>
          )}

           <div className="pt-2">
             <Button onClick={onConfirm} className="w-full">
                Continue
             </Button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default PhaseCompleteModal;
