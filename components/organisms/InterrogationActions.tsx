/**
 * @file InterrogationActions.tsx
 * @description A dedicated panel for all player actions during an interrogation. It intelligently renders either
 * initial questions at the start of a phase or suggested follow-up questions, providing a cleaner, more focused UI.
 * This component replaces the former `ChatInput` component.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectPlayerTokens } from '../../store/storySlice';
import { ChevronRight, Coins } from 'lucide-react';
import { GAME_MECHANICS } from '../../config';

interface InterrogationActionsProps {
  suggestedQuestions: string[];
  initialQuestions?: string[] | null;
  isAiResponding: boolean;
  onSendMessage: (text: string) => void;
}

const InterrogationActions: React.FC<InterrogationActionsProps> = ({
  suggestedQuestions,
  initialQuestions,
  isAiResponding,
  onSendMessage,
}) => {
  const playerTokens = useSelector((state: RootState) => selectPlayerTokens(state));
  const questionCost = GAME_MECHANICS.QUESTION_COST;
  const canAfford = playerTokens >= questionCost;

  // A helper to determine if an action should be disabled.
  const isDisabled = isAiResponding || !canAfford;

  // Render initial questions if they exist for the start of a phase.
  if (initialQuestions) {
    return (
      <div className="p-4 bg-brand-bg border-t-2 border-brand-border space-y-3">
        <h3 className="font-oswald text-brand-primary uppercase tracking-wider text-center">Select Your Opening Question</h3>
        {initialQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(q)}
            disabled={isAiResponding} // Cost was already paid by selecting the line of inquiry.
            className="w-full p-4 bg-brand-surface rounded-lg text-left font-oswald uppercase tracking-wider text-lg
                       flex justify-between items-center
                       transition-all duration-200 ease-in-out 
                       border-l-4 border-brand-border
                       hover:border-brand-primary hover:bg-brand-primary/10
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{q}</span>
            <ChevronRight size={24} className="flex-shrink-0" />
          </button>
        ))}
      </div>
    );
  }
  
  // Render suggested follow-up questions in the new dedicated panel.
  return (
    <div className="p-4 bg-brand-surface border-t-2 border-brand-primary/30">
        <h3 className="font-oswald text-brand-primary uppercase tracking-wider text-center text-sm mb-3">Suggested Follow-up Questions</h3>
        <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(q)}
                disabled={isDisabled}
                className="w-full p-3 bg-brand-bg rounded-md text-left text-brand-text
                           flex justify-between items-center text-sm
                           transition-colors duration-200 ease-in-out 
                           hover:bg-brand-primary hover:text-white
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-mono">{q}</span>
                {/* 
                  --- TOKEN ECONOMY HIDDEN FOR PLAYTESTING ---
                  The token cost per question is commented out. The ability to afford it
                  is handled by a high initial token count in config.ts.
                  To re-enable, uncomment this block.
                */}
                {/*
                 <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs flex-shrink-0">
                    <Coins size={14} />
                    <span>{questionCost}</span>
                </div>
                */}
              </button>
            ))}
        </div>
        {!canAfford && (
            <div className="mt-3 text-center text-yellow-500 text-xs p-2 bg-yellow-900/50 rounded-md">
                Insufficient tokens to ask another question.
            </div>
        )}
    </div>
  );
};

export default InterrogationActions;