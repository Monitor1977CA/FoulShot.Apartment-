/**
 * @file OfficialReportButton.tsx
 * @description A reusable button for displaying and linking to official reports on the LocationCard.
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setActiveCard } from '../../store/uiSlice';
import { selectObjectById, selectEvidenceGroupById } from '../../store/storySlice';
import { CardType } from '../../types';
import { FileText, Images, ChevronRight } from 'lucide-react';

interface OfficialReportButtonProps {
  report: { id: string; type: CardType };
}

const OfficialReportButton: React.FC<OfficialReportButtonProps> = ({ report }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch the name of the report/group from the store based on its type.
  const reportData = useSelector((state: RootState) => {
    if (report.type === 'object') {
      return selectObjectById(state, report.id);
    } else if (report.type === 'evidenceGroup') {
      return selectEvidenceGroupById(state, report.id);
    }
    return null;
  });

  if (!reportData) {
    return null; // Don't render if the data isn't found
  }

  const handleClick = () => {
    dispatch(setActiveCard({ id: report.id, type: report.type }));
  };
  
  const Icon = report.type === 'evidenceGroup' ? Images : FileText;
  
  return (
    <button
      onClick={handleClick}
      className="w-full p-3 bg-brand-bg/50 rounded-lg text-left text-brand-text
                 flex justify-between items-center
                 transition-all duration-200 ease-in-out 
                 border-l-4 border-brand-border
                 hover:border-brand-primary hover:bg-brand-primary/10"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-brand-text-muted flex-shrink-0" />
        <span className="font-semibold">{reportData.name}</span>
      </div>
      <ChevronRight size={20} className="flex-shrink-0 text-brand-text-muted" />
    </button>
  );
};

export default OfficialReportButton;