
import React from 'react';

interface SidebarActionButtonProps {
  label: string;
  Icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
}

const SidebarActionButton: React.FC<SidebarActionButtonProps> = ({ label, Icon, onClick, disabled }) => {
  return (
    <div className="relative group flex items-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
        ${disabled
            ? 'bg-black/50 text-brand-text-muted/40 cursor-not-allowed border-2 border-brand-border/30'
            : 'bg-black/60 text-white border-2 border-brand-border hover:bg-brand-primary hover:border-brand-primary'
        }`}
        aria-label={label}
      >
        <Icon size={24} />
      </button>
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-brand-primary text-white text-sm font-oswald uppercase tracking-wider rounded-md shadow-lg
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};

export default SidebarActionButton;