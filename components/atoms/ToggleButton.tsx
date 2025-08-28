import React from 'react';

interface ToggleButtonProps {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
  className?: string;
  accessibleLabel: string;
  disabled?: boolean;
}

/**
 * A best-in-class, accessible toggle switch.
 * The component has been refactored to be a purely visual switch, with the label
 * handled by the parent component for maximum clarity and flexibility. This follows
 * modern UX patterns and ensures the label is never obscured by the control itself.
 */
const ToggleButton: React.FC<ToggleButtonProps> = ({ toggled, onToggle, className, accessibleLabel, disabled = false }) => {
  const trackBg = toggled ? 'bg-brand-primary' : 'bg-brand-surface';
  // If toggled, move the thumb 24px to the right.
  const thumbTranslate = toggled ? 'translate-x-6' : 'translate-x-0';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={() => !disabled && onToggle(!toggled)}
      className={`relative w-14 h-8 flex items-center flex-shrink-0 p-1 rounded-full border-2 border-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-primary/50 transition-colors duration-200 ease-in-out ${trackBg} ${className} ${disabledClasses}`}
      role="switch"
      aria-checked={toggled}
      aria-label={accessibleLabel}
      disabled={disabled}
    >
      {/* The sliding thumb */}
      <div className={`w-6 h-6 transition-transform duration-200 ease-in-out bg-white rounded-full shadow-lg transform ${thumbTranslate}`}>
      </div>
    </button>
  );
};

export default ToggleButton;