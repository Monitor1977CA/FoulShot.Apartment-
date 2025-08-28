/**
 * @file TimelineNodeWrapper.tsx
 * @description A reusable wrapper component for timeline nodes.
 *
 * @architectural_decision
 * This component was created to eliminate significant code duplication between
 * `TimelineEventNode` and `TimelineEventStackNode`. Both components shared the exact same
 * JSX and logic for positioning (left/right), rendering the connecting line and dot,
 * and managing the expanded state. By extracting this into a generic wrapper, we adhere
 * to the DRY (Don't Repeat Yourself) principle, making the timeline system far more
 * maintainable and easier to extend in the future.
 */
import React, { useMemo } from 'react';
import { TimelineTag } from '../../types';

interface TimelineNodeWrapperProps {
  children: React.ReactNode;
  isLeft: boolean;
  isExpanded: boolean;
  onClick: () => void;
  isInteractive: boolean;
  hasHighlight: boolean;
  isNew?: boolean;
}

const TimelineNodeWrapper = React.forwardRef<HTMLDivElement, TimelineNodeWrapperProps>(
  ({ children, isLeft, isExpanded, onClick, isInteractive, hasHighlight, isNew }, ref) => {
    
    // --- Layout Calculation ---
    const nodeAlignment = isLeft ? 'justify-start' : 'justify-end';
    const cardAlignment = isLeft ? 'mr-8' : 'ml-8';
    const lineDirection = isLeft ? 'flex-row' : 'flex-row-reverse';
    
    // --- Animation Refactor ---
    // The scaling transform is applied to this container div, not the card itself.
    // This cleanly separates the layout animation from the card's internal styling.
    const highlightTransformClass = hasHighlight ? 'scale-105' : 'scale-100';
    const arrivalAnimationClass = isNew ? 'animate-arrive-glow' : '';

    return (
      <div
        ref={ref}
        className={`relative flex w-full ${nodeAlignment} ${arrivalAnimationClass}`}
        onClick={onClick}
        style={{ cursor: isInteractive ? 'pointer' : 'default' }}
        aria-expanded={isExpanded}
      >
        <div className={`flex items-center w-1/2 ${lineDirection}`}>
          <div className={`${cardAlignment} my-4 transition-transform duration-300 ${highlightTransformClass}`}>
            {children}
          </div>
          
          {/* The horizontal connecting line */}
          <div className="w-8 flex-shrink-0 border-t-2 border-dashed border-brand-border"></div>
        </div>
        
        {/* The dot on the central timeline spine */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-primary border-2 rounded-full z-10 transition-all duration-300 ${isExpanded ? 'border-white scale-125 shadow-lg shadow-brand-primary/50' : 'border-brand-surface'}`}></div>
      </div>
    );
  }
);

export default TimelineNodeWrapper;
