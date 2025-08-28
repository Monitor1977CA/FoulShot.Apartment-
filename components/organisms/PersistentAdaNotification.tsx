/**
 * @file PersistentAdaNotification.tsx
 * @description A persistent, dismissible notification from ADA that overlays the UI to deliver critical information.
 */
import React from 'react';
import Button from '../atoms/Button';
import { Lightbulb } from 'lucide-react';

interface PersistentAdaNotificationProps {
  message: string;
  onClose: () => void;
}

const PersistentAdaNotification: React.FC<PersistentAdaNotificationProps> = ({ message, onClose }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 p-4 animate-slide-in-bottom">
      <div
        className="bg-brand-surface rounded-xl shadow-2xl w-full border-2 border-brand-primary overflow-hidden"
      >
        <header className="p-3 bg-brand-primary/20 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-brand-primary" />
            <h2 className="text-xl font-oswald text-white uppercase tracking-wider">New Lead</h2>
        </header>
        <main className="p-4 space-y-4">
          <p className="text-white">{message}</p>
           <div className="pt-2">
             <Button onClick={onClose} className="w-full">
                Understood
             </Button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default PersistentAdaNotification;