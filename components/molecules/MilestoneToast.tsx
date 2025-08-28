import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { UI_CONFIG } from '../../config';

interface MilestoneToastProps {
  message: string;
  onDismiss: () => void;
}

const MilestoneToast: React.FC<MilestoneToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, UI_CONFIG.TOAST_DURATION); 

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-in-bottom">
      <div className="bg-brand-surface border-2 border-brand-primary rounded-lg shadow-2xl shadow-brand-primary/20 p-4 flex items-center space-x-3">
        <Sparkles className="text-brand-primary h-6 w-6 animate-pulse" />
        <p className="text-white font-semibold font-oswald uppercase tracking-wider">{message}</p>
      </div>
    </div>
  );
};

export default MilestoneToast;