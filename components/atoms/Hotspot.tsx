
import React from 'react';
// Replaced DoorOpen with ArrowLeftRight for a clearer 'move' action icon.
import { Fingerprint, ArrowLeftRight } from 'lucide-react';

interface HotspotProps {
  coords: { top: string; left: string };
  onClick: () => void;
  label: string;
  type?: 'investigate' | 'move';
}

const Hotspot: React.FC<HotspotProps> = React.memo(({ coords, onClick, label, type = 'investigate' }) => {
  const isMoveType = type === 'move';

  // Conditionally select the icon and its styling based on the 'type' prop.
  // 'move' hotspots now use the ArrowLeftRight icon and are colored white for visual distinction.
  const IconComponent = isMoveType ? ArrowLeftRight : Fingerprint;
  const iconColorClass = isMoveType ? 'text-brand-accent' : 'text-brand-primary';

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
      style={{ ...coords }}
      aria-label={`Hotspot: ${label}`}
    >
      {/* Visual Target with dynamic Icon */}
      <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border-2 border-brand-border/70 group-hover:border-brand-primary transition-all duration-300 animate-pulse-subtle shadow-lg">
        {/* The icon now has dynamic color and a consistent hover effect. */}
        <IconComponent className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${iconColorClass}`} />
      </div>
      
      {/* Label */}
      <span className="text-white text-xs font-bold bg-black/80 px-2 py-0.5 rounded-sm mt-2 whitespace-nowrap group-hover:text-brand-primary transition-colors drop-shadow-lg uppercase font-oswald tracking-wider">
        {label}
      </span>
    </button>
  );
});

export default Hotspot;
