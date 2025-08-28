
import React from 'react';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = React.memo(({ label, isActive, onClick, className }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-bold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface font-oswald uppercase tracking-wider text-sm';
  
  const stateClasses = isActive 
    ? 'bg-brand-primary text-white shadow-md' 
    : 'bg-brand-surface text-brand-text-muted hover:bg-white/10';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
});

export default FilterButton;
