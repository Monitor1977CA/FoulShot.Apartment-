
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = React.memo(({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full text-white hover:bg-white/10 hover:text-brand-primary transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
});

export default BackButton;