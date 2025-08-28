/**
 * @file CaseStrengthDashboard.tsx
 * @description A dedicated component for rendering the "Case Strength" dashboard for a
 * selected suspect on the Timeline view. This was extracted from `TimelineView.tsx`
 * to improve modularity and separation of concerns.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { showModal } from '../../store/uiSlice';
import { Character, TimelineTag } from '../../types';
import MMOProgressView from './MMOProgressView';
import Button from '../atoms/Button';
import { Shield } from 'lucide-react';
import { selectAllEvidenceWithDetails } from '../../store/storySlice';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface CaseStrengthDashboardProps {
  suspect: Character;
  evidenceForMMO: EvidenceWithDetails[];
  activeMMOFilter: TimelineTag | null;
  onMMOTagClick: (tag: TimelineTag | null) => void;
}

const CaseStrengthDashboard: React.FC<CaseStrengthDashboardProps> = React.memo(({ suspect, evidenceForMMO, activeMMOFilter, onMMOTagClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accusationThreshold } = useSelector((state: RootState) => state.story);

  const handleSubmitToDA = () => {
    dispatch(showModal({
      type: 'accusation',
      props: { 
        suspect: suspect, 
        evidence: evidenceForMMO
      }
    }));
  };

  return (
    <div className="mb-4 animate-fade-in flex-shrink-0">
      <MMOProgressView 
        suspect={suspect} 
        evidence={evidenceForMMO}
        onMMOTagClick={onMMOTagClick}
        activeMMOFilter={activeMMOFilter}
      />
      {evidenceForMMO.length >= accusationThreshold && (
        <div className="mt-4">
          <Button onClick={handleSubmitToDA} className="w-full flex items-center justify-center gap-2 text-sm">
            <Shield size={16} />
            <span>SUBMIT CASE AGAINST {suspect.name} TO DA</span>
          </Button>
        </div>
      )}
    </div>
  );
});

export default CaseStrengthDashboard;
