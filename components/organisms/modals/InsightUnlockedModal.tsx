/**
 * @file InsightUnlockedModal.tsx
 * @description A modal that provides a dramatic "reveal" when the player identifies a critical clue
 * during an interrogation. This is a key reward and narrative progression moment.
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../../store/uiSlice';
import { Insight } from '../../../types';
import Button from '../../atoms/Button';
import { Lightbulb, BookCheck, Target } from 'lucide-react';

interface InsightUnlockedModalProps {
  insight: Insight;
  statement: string;
}

const InsightUnlockedModal: React.FC<InsightUnlockedModalProps> = ({ insight, statement }) => {
  const dispatch = useDispatch();
  
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => dispatch(hideModal())}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-sm border-2 border-yellow-500 overflow-hidden animate-slide-in-bottom relative"
        style={{'--glow-color': '#F6E05E', boxShadow: '0 0 30px rgba(246, 224, 94, 0.4)'} as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse-subtle pointer-events-none"></div>
        <header className="p-4 bg-yellow-900/50 text-center">
            <div className="flex justify-center items-center gap-3">
                 <Lightbulb className="w-8 h-8 text-yellow-400 animate-sparkle-glow" />
                 <h2 className="text-3xl font-oswald text-white uppercase tracking-wider">Insight Unlocked</h2>
            </div>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <h3 className="font-oswald text-yellow-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <BookCheck size={16} />
                Critical Statement Identified
            </h3>
            <blockquote className="border-l-4 border-brand-border pl-3 italic text-white">
                "{statement}"
            </blockquote>
          </div>
          <div>
            <h3 className="font-oswald text-yellow-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Lightbulb size={16} />
                ADA's Justification
            </h3>
            <p className="text-brand-text-muted">{insight.justification}</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/50">
            <h3 className="font-oswald text-green-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Target size={16} />
                New Lead Uncovered
            </h3>
            <p className="text-white font-semibold">{insight.newLead}</p>
          </div>
           <div className="pt-2">
             <Button onClick={() => dispatch(hideModal())} className="w-full">
                Continue
             </Button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default InsightUnlockedModal;
