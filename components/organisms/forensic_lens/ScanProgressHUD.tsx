/**
 * @file ScanProgressHUD.tsx
 * @description A new UI component for the Forensic Lens that provides visual feedback on
 *              the progress of a multi-part scan. It uses a diegetic, "data fragment"
 *              visual style instead of a generic progress bar to enhance immersion.
 */
import React from 'react';
import { ScanGroup } from '../../../types';
import { Scan } from 'lucide-react';

interface ScanProgressHUDProps {
  group: ScanGroup;
  capturedCount: number;
}

const ScanProgressHUD: React.FC<ScanProgressHUDProps> = ({ group, capturedCount }) => {
  const slots = Array.from({ length: group.requiredScans });
  const isComplete = capturedCount >= group.requiredScans;

  return (
    <div className="absolute inset-x-0 bottom-16 z-20 p-4 animate-slide-in-bottom">
      <div className="bg-brand-surface/90 backdrop-blur-sm rounded-lg border-t-2 border-brand-primary p-4 shadow-2xl shadow-black">
        <div className="flex items-center gap-3 mb-3">
          <Scan className={`w-6 h-6 ${isComplete ? 'text-brand-accent' : 'text-brand-primary animate-pulse'}`} />
          <div className="flex-1">
            <h3 className="font-oswald text-lg text-white uppercase tracking-wider">
              {isComplete ? 'Analysis Complete' : 'Analyzing Traces...'}
            </h3>
            <p className="text-sm text-brand-text-muted">
              {isComplete ? 'A new finding is ready to be linked.' : 'More data fragments required.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {slots.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-3 rounded-sm bg-black/50 border border-brand-border/50 overflow-hidden"
            >
              {index < capturedCount && (
                <div className={`h-full w-full ${isComplete ? 'text-brand-accent' : 'bg-brand-primary'} animate-fade-in`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanProgressHUD;