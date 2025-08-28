/**
 * @file ErrorLogView.tsx
 * @description A modal component to display a list of caught system errors.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { selectAllErrors, clearErrorLog } from '../../store/errorLogSlice';
import Button from '../atoms/Button';
import { hideModal } from '../../store/uiSlice';
import { X } from 'lucide-react';
import { ErrorLogEntry } from '../../types';

const ErrorLogModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector(selectAllErrors) as ErrorLogEntry[];

  const handleClose = () => {
    dispatch(hideModal());
  };
  
  const handleClear = () => {
    dispatch(clearErrorLog());
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" 
      onClick={handleClose}
    >
      <div 
        className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-lg border-2 border-brand-border overflow-hidden flex flex-col h-[80%]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b-2 border-brand-border flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-oswald text-yellow-400 uppercase tracking-wider">System Log</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleClear} className="text-xs">
              Clear Log
            </Button>
            <button 
              className="p-2 rounded-full text-white/50 hover:bg-brand-primary hover:text-white transition-colors"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </header>
        <main className="p-4 flex-1 overflow-y-auto">
          {errors.length > 0 ? (
            <div className="space-y-4">
              {errors.slice().reverse().map(error => (
                <div key={error.id} className="bg-brand-bg p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-xs text-brand-text-muted font-mono">{new Date(error.timestamp).toLocaleString()}</p>
                  <p className="text-yellow-400 font-semibold mt-1">{error.message}</p>
                  {error.stack && (
                    <pre className="text-xs text-brand-text-muted mt-2 whitespace-pre-wrap font-mono bg-black/30 p-2 rounded-md">
                      {error.stack}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-brand-text-muted">No system errors have been logged.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ErrorLogModal;