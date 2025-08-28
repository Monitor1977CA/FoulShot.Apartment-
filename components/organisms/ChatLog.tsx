/**
 * @file ChatLog.tsx
 * @description Renders the scrollable log of a conversation. It's redesigned as an official transcript,
 * pinning the current question at the top and showing responses below, with a visual cue for scrolling.
 */
import React, { useRef, useState, useEffect } from 'react';
import { WitnessResponse, DialogueChunkData } from '../../types';
import DialogueChunk from '../molecules/DialogueChunk'; // Needed for interview mode
import InterrogationDialogueChunk from '../molecules/InterrogationDialogueChunk';

interface ChatLogProps {
  lastQuestionAsked: string | null;
  messages: WitnessResponse[]; // Now specifically takes an array of witness responses
  mode: 'interview' | 'interrogation';
  onCreateEvidence: (chunk: DialogueChunkData) => void;
  evidenceCreatedChunkIds: Set<string>;
  revealedCriticalIds: Set<string>;
  isAiResponding: boolean;
}

const ChatLog: React.FC<ChatLogProps> = ({
  lastQuestionAsked,
  messages,
  mode,
  onCreateEvidence,
  evidenceCreatedChunkIds,
  revealedCriticalIds,
  isAiResponding,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // This effect checks if the content is scrollable.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollable = () => {
      // A small buffer is added to prevent the gradient from showing if it's only *just* scrollable.
      const isContentOverflowing = container.scrollHeight > container.clientHeight + 10;
      setIsScrollable(isContentOverflowing);
    };

    // Initial check and check on resize
    checkScrollable();
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [messages]); // Re-run when messages change to update scroll state.

  return (
    <div className="flex-1 bg-black/50 flex flex-col overflow-hidden relative border-t border-b border-brand-border">
      {/* "Question on Record" Header */}
      {lastQuestionAsked && (
        <div className="flex-shrink-0 p-4 bg-brand-surface border-b-2 border-brand-border shadow-lg z-10">
          <p className="text-sm text-brand-text-muted font-oswald uppercase tracking-wider">Current Line of Questioning:</p>
          <p className="text-lg text-white font-semibold">"{lastQuestionAsked}"</p>
        </div>
      )}

      {/* Scrollable Transcript Area */}
      <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 relative">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="space-y-2 max-w-[95%] animate-fade-in">
              {msg.chunks.map((chunk) =>
                mode === 'interrogation' ? (
                  <InterrogationDialogueChunk
                    key={chunk.id}
                    chunk={chunk}
                    onCreateEvidence={onCreateEvidence}
                    isEvidence={evidenceCreatedChunkIds.has(chunk.id)}
                    isRevealed={revealedCriticalIds.has(chunk.id)}
                  />
                ) : (
                  // Restore interview chunk logic
                  <DialogueChunk
                    key={chunk.id}
                    chunkId={chunk.id}
                    text={chunk.text}
                    onUnlock={() => {}}
                  />
                )
              )}
            </div>
          ))
        ) : (
          !isAiResponding && (
            <div className="h-full flex items-center justify-center text-brand-text-muted text-center">
              <p>Awaiting response...</p>
            </div>
          )
        )}
        
        {isAiResponding && (
          <div className="flex items-center space-x-2 pt-2 max-w-[95%] animate-fade-in">
            <div className="px-4 py-2 rounded-2xl bg-brand-bg rounded-bl-none border border-brand-border">
              <span className="w-2 h-2 bg-brand-text-muted rounded-full inline-block animate-pulse [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-brand-text-muted rounded-full inline-block animate-pulse [animation-delay:-0.15s] mx-1"></span>
              <span className="w-2 h-2 bg-brand-text-muted rounded-full inline-block animate-pulse"></span>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll Indicator Gradient */}
      {isScrollable && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ChatLog;