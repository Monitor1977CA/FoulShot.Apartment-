/**
 * @file AccusationModal.tsx
 * @description A multi-stage modal for the end-game accusation flow.
 * It guides the player through reviewing their evidence, submitting their case,
 * and viewing the AI-powered evaluation results.
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { hideModal } from '../../../store/uiSlice';
import { selectCanonicalTimeline } from '../../../store/storySlice';
import { summarizePlayerTimeline, evaluateTimeline } from '../../../services/geminiService';
import { Character, TimelineEvaluation } from '../../../types';
import { selectAllEvidenceWithDetails } from '../../../store/storySlice';
import { X, CheckCircle, XCircle, AlertTriangle, Shield, Send } from 'lucide-react';
import Button from '../../atoms/Button';
import Spinner from '../../atoms/Spinner';

type EvidenceWithDetails = ReturnType<typeof selectAllEvidenceWithDetails>[0];

interface AccusationModalProps {
  suspect: Character;
  evidence: EvidenceWithDetails[];
}

type Stage = 'review' | 'evaluating' | 'results';

const AccusationModal: React.FC<AccusationModalProps> = ({ suspect, evidence }) => {
    const dispatch = useDispatch<AppDispatch>();
    const canonicalTimeline = useSelector(selectCanonicalTimeline);

    const [stage, setStage] = useState<Stage>('review');
    const [summary, setSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [evaluation, setEvaluation] = useState<TimelineEvaluation | null>(null);

    // --- Stage 1: Generate Case Summary ---
    useEffect(() => {
        if (stage === 'review') {
            summarizePlayerTimeline(evidence, suspect.name).then(res => {
                setSummary(res);
                setIsLoadingSummary(false);
            });
        }
    }, [stage, evidence, suspect.name]);
    
    // --- Stage 2: Evaluate Case ---
    const handleConfirmAccusation = async () => {
        if (!canonicalTimeline) {
            console.error("Cannot evaluate: Canonical timeline is missing.");
            return;
        }
        setStage('evaluating');
        const submission = {
            suspectId: suspect.id,
            evidenceIds: evidence.map(e => e.cardId),
        };
        const result = await evaluateTimeline(submission, canonicalTimeline, suspect.name);
        setEvaluation(result);
        setStage('results');
    };

    const handleClose = () => {
        dispatch(hideModal());
    };
    
    const renderVerdictIcon = (verdict: TimelineEvaluation['verdict']) => {
        switch (verdict) {
            case 'Case Accepted': return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'Case Weak': return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
            case 'Case Rejected': return <XCircle className="w-16 h-16 text-red-500" />;
            default: return null;
        }
    };
    
    const renderContent = () => {
        switch (stage) {
            case 'review':
                return (
                    <>
                        <p className="text-brand-text-muted mb-4">Review your case file against <span className="text-brand-primary font-bold">{suspect.name}</span>. ADA has prepared a summary based on the evidence you have provided.</p>
                        
                        <div className="bg-black/30 p-4 rounded-lg border border-brand-border mb-6 max-h-48 overflow-y-auto">
                            <h3 className="font-oswald text-brand-primary uppercase mb-2">ADA's Summary</h3>
                            {isLoadingSummary ? <Spinner /> : <p className="text-white whitespace-pre-wrap">{summary}</p>}
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleConfirmAccusation} disabled={isLoadingSummary}>
                                <div className="flex items-center gap-2">
                                    <Send size={16} /> Confirm Accusation
                                </div>
                            </Button>
                        </div>
                    </>
                );

            case 'evaluating':
                return (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Spinner />
                        <h3 className="text-2xl font-oswald mt-6 text-white uppercase">Submitting to DA...</h3>
                        <p className="text-brand-text-muted">Your case file is being evaluated.</p>
                    </div>
                );

            case 'results':
                if (!evaluation) {
                    return <p className="text-red-500">Error: Evaluation data is missing.</p>;
                }
                return (
                    <div className="animate-fade-in text-center">
                        <div className="flex justify-center mb-4">{renderVerdictIcon(evaluation.verdict)}</div>
                        <h3 className={`text-4xl font-oswald uppercase mb-2`}>{evaluation.verdict}</h3>
                        <p className="text-brand-primary font-bold text-2xl mb-4">Score: {evaluation.score}/100</p>
                        
                        <div className="text-left bg-black/30 p-4 rounded-lg border border-brand-border mb-6">
                             <p className="text-white">{evaluation.reasoning}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                           <div>
                                <h4 className="font-oswald text-green-400 uppercase border-b border-green-400/30 pb-1 mb-2">Strengths</h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-white">
                                    {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                           </div>
                           <div>
                                <h4 className="font-oswald text-red-400 uppercase border-b border-red-400/30 pb-1 mb-2">Weaknesses</h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-white">
                                    {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                           </div>
                        </div>

                        <div className="mt-8">
                            <Button onClick={handleClose}>Close File</Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
            <div 
                className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-lg border-2 border-brand-primary overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b-2 border-brand-primary flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="text-brand-primary" size={24} />
                        <h2 className="text-2xl font-oswald text-white uppercase tracking-wider">Submit Case File</h2>
                    </div>
                    <button 
                        className="p-2 rounded-full text-white/50 hover:bg-brand-primary hover:text-white transition-colors"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </header>
                <main className="p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AccusationModal;