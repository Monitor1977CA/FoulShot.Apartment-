/**
 * @file DialogueChunk.tsx
 * @description A component that renders a single, actionable chunk of witness testimony.
 */
import React from 'react';

interface DialogueChunkProps {
  chunkId: string;
  text: string;
  onUnlock: (text: string) => void;
}

const DialogueChunk: React.FC<DialogueChunkProps> = ({ chunkId, text, onUnlock }) => {
  return (
    <div
      className={`flex items-start gap-3 max-w-full animate-fade-in flex-row`}
    >
      <div
        className={`px-4 py-2 rounded-2xl flex-1 bg-brand-bg text-white rounded-bl-none border border-brand-border`}
      >
        <p className="text-base leading-snug">{text}</p>
      </div>
    </div>
  );
};

export default DialogueChunk;