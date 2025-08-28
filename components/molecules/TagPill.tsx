import React from 'react';

interface TagPillProps {
  label: string;
  Icon: React.ElementType;
}

const TagPill: React.FC<TagPillProps> = React.memo(({ label, Icon }) => {
  const colorClass = React.useMemo(() => {
    switch (label) {
      case 'Motive': return 'bg-red-900/50 text-red-300 border-red-500/50';
      case 'Means': return 'bg-blue-900/50 text-blue-300 border-blue-500/50';
      case 'Opportunity': return 'bg-green-900/50 text-green-300 border-green-500/50';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
    }
  }, [label]);

  return (
    <div className={`flex items-center rounded-full text-xs font-semibold border ${colorClass} pl-2 pr-3 py-1 gap-1.5`}>
      <Icon size={14} />
      <span className="uppercase tracking-wider">{label}</span>
    </div>
  );
});

export default TagPill;