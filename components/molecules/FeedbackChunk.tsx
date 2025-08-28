/**
 * @file FeedbackChunk.tsx
 * @description A component to render ADA's analysis feedback directly in the chat log.
 */
import React from 'react';
import { ShieldQuestion, BookCheck, ArrowUp } from 'lucide-react';
import { ActiveFeedback } from '../../types';

type FeedbackChunkProps = ActiveFeedback;

const StatChange: React.FC<{ value: number; }> = ({ value }) => {
    if (value === 0) return null;
    
    // Progress is now always positive, so we use a consistent color and the ArrowUp icon.
    return (
        <div className={`flex items-center gap-1 font-bold text-brand-accent`}>
            <ArrowUp size={12} />
            <span>{`+${value} Progress`}</span>
        </div>
    );
};

const FeedbackChunk: React.FC<FeedbackChunkProps> = ({ progressChange, text, source }) => {
    const isQuestion = source === 'question';
    const TitleIcon = isQuestion ? ShieldQuestion : BookCheck;
    const titleText = isQuestion ? "Question Analysis" : "Evidence Created";
    const titleColor = isQuestion ? 'text-brand-text-muted' : 'text-yellow-400';

    return (
        <div className="w-full flex justify-center animate-fade-in my-2">
            <div className="bg-brand-surface/50 border border-brand-border rounded-lg p-3 max-w-md w-full">
                <div className="flex items-center gap-2 mb-1.5">
                    <TitleIcon size={16} className={titleColor} />
                    <h4 className={`font-oswald text-sm uppercase tracking-wider ${titleColor}`}>{titleText}</h4>
                </div>
                <div className="flex justify-between items-center gap-4 pl-1">
                    <p className="text-sm italic text-brand-text-muted flex-1">"{text}"</p>
                    <div className="flex items-center gap-3 text-sm flex-shrink-0">
                        <StatChange value={progressChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackChunk;