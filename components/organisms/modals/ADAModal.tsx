
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ADAModal: React.FC = () => {
  const { messages, isLoading } = useSelector((state: RootState) => state.ada);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // --- UX Improvement: Scroll to Top ---
  // When new messages are added or the modal opens, scroll to the top
  // so the player can immediately read the latest analysis.
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  return (
    <div className="fixed inset-x-0 bottom-0 h-[60%] z-30 max-w-md mx-auto flex flex-col animate-slide-in-bottom">
        <div className="w-full h-full bg-brand-surface/95 backdrop-blur-sm shadow-lg flex flex-col border-t-4 border-brand-primary rounded-t-2xl overflow-hidden">
            <header className="p-4 flex items-center gap-3 border-b border-brand-border flex-shrink-0">
                 <h3 className="font-oswald text-xl text-brand-primary uppercase tracking-wider">ADA Analysis</h3>
            </header>
            <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto text-lg leading-relaxed">
                  {messages.map((msg, index) => <p key={index} className="pb-4 animate-fade-in">{msg}</p>)}
                  
                  {isLoading && (
                      <div className="flex items-center space-x-2 pt-2">
                          <span className="w-2.5 h-2.5 bg-brand-text-muted rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                          <span className="w-2.5 h-2.5 bg-brand-text-muted rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                          <span className="w-2.5 h-2.5 bg-brand-text-muted rounded-full animate-pulse"></span>
                      </div>
                  )}
            </div>
        </div>
    </div>
  );
};

export default ADAModal;
