/**
 * @file PhaseHeader.tsx
 * @description A component that renders the header for an active interrogation phase, including the dual progress bars.
 */
import React, { useState, useEffect } from 'react';
import PhaseProgressBar from '../molecules/PhaseProgressBar';
import { GAME_MECHANICS } from '../../config';
import { ShieldQuestion, ArrowUp, BookCheck } from 'lucide-react';
import { ActiveFeedback } from '../../types';
import BodyCamView from '../molecules/BodyCamView';

interface PhaseHeaderProps {
  characterId: string;
  witnessName: string;
  slideshowPrompts: string[];
  currentImageIndex: number;
  lineOfInquiryLabel: string;
  phaseProgress: number;
  activeFeedback: ActiveFeedback | null;
  onClearFeedback: () => void;
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ 
    characterId, 
    witnessName, 
    slideshowPrompts,
    currentImageIndex,
    lineOfInquiryLabel, 
    phaseProgress, 
    activeFeedback, 
    onClearFeedback 
}) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState<ActiveFeedback | null>(null);

  useEffect(() => {
    if (activeFeedback) {
      setFeedbackData(activeFeedback);
      setIsFeedbackVisible(true);
      const timer = setTimeout(() => {
        setIsFeedbackVisible(false);
        // Add another delay for the fade-out animation before clearing data
        setTimeout(() => {
          onClearFeedback();
        }, 500);
      }, 4000); // Feedback visible for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [activeFeedback, onClearFeedback]);
  
  const StatChange: React.FC<{ value: number; }> = ({ value }) => {
    if (value === 0) return null;
    return (
        <div className={`flex items-center gap-1 font-bold text-brand-accent`}>
            <ArrowUp size={12} />
            <span>{`+${value} Progress`}</span>
        </div>
    );
  };

  const isQuestion = feedbackData?.source === 'question';
  const TitleIcon = isQuestion ? ShieldQuestion : BookCheck;
  const titleColor = isQuestion ? 'text-brand-text-muted' : 'text-yellow-400';

  return (
    <div className="p-4 bg-brand-surface border-b-2 border-brand-border flex-shrink-0 space-y-4">
        <BodyCamView
            characterId={characterId}
            witnessName={witnessName}
            prompts={slideshowPrompts}
            currentImageIndex={currentImageIndex}
        />
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <ShieldQuestion className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <h2 className="font-oswald uppercase tracking-wider text-white truncate">
                    {lineOfInquiryLabel}
                </h2>
            </div>
            <PhaseProgressBar 
                value={phaseProgress}
                goal={GAME_MECHANICS.PHASE_COMPLETION_GOAL}
            />
        </div>
        {/* Animated Feedback Area */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFeedbackVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            {feedbackData && (
                 <div className="bg-brand-bg/50 border border-brand-border rounded-lg p-2">
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-sm italic text-brand-text-muted flex-1">"{feedbackData.text}"</p>
                        <div className="flex items-center gap-3 text-sm flex-shrink-0">
                            <StatChange value={feedbackData.progressChange} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PhaseHeader;
