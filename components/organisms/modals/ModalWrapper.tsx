
import React from 'react';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../../store/uiSlice';
import { X } from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, children }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideModal());
  };

  return (
    <div 
      className="fixed inset-0 bg-brand-bg/95 backdrop-blur-sm z-50 flex flex-col animate-slide-in-bottom border-t-4 border-brand-primary"
      onClick={handleClose}
    >
      <div className="w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 bg-brand-surface flex justify-between items-start flex-shrink-0 border-b border-brand-border">
          <h2 className="text-2xl font-oswald text-white uppercase tracking-wider pr-4 leading-tight">{title}</h2>
          <button
            className="p-2 rounded-full text-white/50 hover:bg-brand-primary hover:text-white transition-colors flex-shrink-0"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModalWrapper;