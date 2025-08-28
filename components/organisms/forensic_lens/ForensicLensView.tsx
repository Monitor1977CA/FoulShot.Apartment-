/**
 * @file ForensicLensView.tsx
 * @description The main component for the new Forensic Lens feature. It provides a fully interactive
 *              view for scanning an object, identifying forensic traces, and linking them to other
 *              pieces of evidence to generate new findings.
 *
 * @architectural_note This component is designed to be a self-contained "mini-game." It manages its
 *                   own complex internal state (lens position, hovered traces, linking panel) and
 *                   dispatches the final results to the global Redux store. This encapsulation
 *                   keeps the `ObjectCard` component clean and simple.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { StoryObject, ForensicTrace, ForensicFindingData, ForensicScanConfig, ScanGroup } from '../../../types';
import { AppDispatch } from '../../../store';
import { addDynamicObject, markObjectAsAnalyzed, addLatentConnection, addFindingIdToObject } from '../../../store/storySlice';
import { showModal } from '../../../store/uiSlice';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ScanProgressHUD from './ScanProgressHUD';

interface ForensicLensViewProps {
  object: StoryObject;
  imageUrl: string;
  onClose: () => void;
}

const ForensicLensView: React.FC<ForensicLensViewProps> = ({ object, imageUrl, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [lensPosition, setLensPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTrace, setHoveredTrace] = useState<ForensicTrace | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // State for the multi-scan mechanic.
  const [capturedTraces, setCapturedTraces] = useState<Set<string>>(new Set());
  const [activeScanGroup, setActiveScanGroup] = useState<ScanGroup | null>(null);

  // Memoize parsed forensic scan data for performance and stability.
  const { traces, groups } = useMemo((): ForensicScanConfig => {
    if (!object.forensicScan) return { traces: [] };
    return object.forensicScan;
  }, [object.forensicScan]);

  const checkHover = useCallback((lensX: number, lensY: number, trace: ForensicTrace): boolean => {
    if (!imageRef.current) return false;
    const rect = imageRef.current.getBoundingClientRect();
    const tracePixelX = trace.coords.x * rect.width;
    const tracePixelY = trace.coords.y * rect.height;
    const distance = Math.sqrt(Math.pow(lensX - tracePixelX, 2) + Math.pow(lensY - tracePixelY, 2));
    // The hover radius is a combination of the lens size and the trace's defined radius for a forgiving feel.
    return distance < 50 + trace.coords.radius;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setLensPosition({ x, y });

    // Find the first hovered trace that hasn't been captured yet.
    const currentlyHovered = traces.find(trace => !capturedTraces.has(trace.id) && checkHover(x, y, trace)) || null;
    setHoveredTrace(currentlyHovered);
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
    setHoveredTrace(null);
  };

  /**
   * Called when a scan is successfully completed (either a single trace or a full group).
   * This function orchestrates the creation of new findings and latent connections.
   */
  const handleScanComplete = useCallback((completedScan: { finding: ForensicFindingData, linkToObjectIds: string[] }) => {
    // 1. Create a new StoryObject from the finding data.
    const newFinding: StoryObject = {
        ...completedScan.finding,
        id: `obj-finding-${uuidv4()}`,
        isEvidence: false,
        hasBeenUnlocked: false, // Ensures the rarity reveal modal will trigger.
        assignedToSuspectIds: [],
        components: [],
    };

    // 2. Add the new object to the global state.
    dispatch(addDynamicObject(newFinding));
    
    // 3. Link the new finding back to the original object.
    dispatch(addFindingIdToObject({ originalObjectId: object.id, findingId: newFinding.id }));

    // 4. If the finding is meant to link to other objects, create a latent connection in the state.
    if (completedScan.linkToObjectIds && completedScan.linkToObjectIds.length > 0) {
        dispatch(addLatentConnection({
            sourceObjectId: object.id,
            finding: newFinding,
            unresolvedTargetIds: completedScan.linkToObjectIds,
            isResolved: false,
        }));
    }

    // 5. Mark the original scanned object as fully analyzed to unlock its details panel.
    dispatch(markObjectAsAnalyzed(object.id));

    // 6. Show the modal to reveal the new finding to the player, providing immediate feedback.
    dispatch(showModal({ type: 'forensicFinding', props: { object: newFinding } }));
    
    // 7. Close the lens view, completing this part of the gameplay loop.
    onClose();
  }, [dispatch, object.id, onClose]);

  /**
   * Handles the player clicking to capture a trace.
   */
  const handleClickCapture = () => {
    if (!hoveredTrace || isCapturing) return;

    const isKeyDetail = !!hoveredTrace.finding || !!hoveredTrace.scanGroupId;
    if (!isKeyDetail) return; // Ignore clicks on non-key details.

    setIsCapturing(true);
    const newCaptured = new Set(capturedTraces).add(hoveredTrace.id);
    setCapturedTraces(newCaptured);
    
    setTimeout(() => setIsCapturing(false), 300); // Match the camera flash animation duration.

    // Scenario 1: The captured trace is part of a multi-part scan group.
    if (hoveredTrace.scanGroupId) {
      const group = groups?.find(g => g.id === hoveredTrace.scanGroupId);
      if (group) {
        if (!activeScanGroup) setActiveScanGroup(group);
        
        const capturedIdsInGroup = [...newCaptured].filter(id => traces.find(t => t.id === id)?.scanGroupId === group.id);
        if (capturedIdsInGroup.length >= group.requiredScans) {
          setTimeout(() => handleScanComplete(group), 500); // Complete after a short delay for feedback.
        }
      }
    } 
    // Scenario 2: The captured trace is a standalone finding.
    else if (hoveredTrace.finding) {
        const singleItemGroup = {
            finding: hoveredTrace.finding,
            linkToObjectIds: hoveredTrace.linkToObjectIds || [],
        };
        setTimeout(() => handleScanComplete(singleItemGroup), 500);
    }
  };
  
  const capturedCountForActiveGroup = useMemo(() => {
    if (!activeScanGroup) return 0;
    return [...capturedTraces].filter(id => traces.find(t => t.id === id)?.scanGroupId === activeScanGroup.id).length;
  }, [capturedTraces, activeScanGroup, traces]);

  return (
    // --- UI FIX: The root element now uses flexbox and overflow-hidden to prevent its children from clipping. ---
    <div className="w-full h-full flex flex-col bg-brand-bg animate-fade-in relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={onClose} className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors" aria-label="Exit Forensic Lens">
          <ArrowLeft size={24} />
        </button>
        <p className="font-oswald text-lg text-white uppercase tracking-wider bg-black/50 px-3 py-1 rounded">
          Scan for Forensic Traces
        </p>
      </header>
      
      {/* The main content area now uses flex-1 to fill available space, and overflow-hidden to contain its absolute children. */}
      <div
        className="flex-1 w-full relative cursor-none select-none overflow-hidden"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickCapture}
      >
        <img ref={imageRef} src={imageUrl} alt={object.name} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.brand.primary/0.1)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.brand.primary/0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
        
        {isCapturing && <div className="absolute inset-0 bg-white animate-camera-flash pointer-events-none" />}

        {lensPosition && (
          <div
            className={`absolute w-[100px] h-[100px] rounded-full border-2 border-brand-primary/80 bg-brand-primary/10 backdrop-blur-sm transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 ${hoveredTrace ? 'scale-110 bg-brand-primary/20' : ''}`}
            style={{ left: lensPosition.x, top: lensPosition.y }}
          />
        )}

        {/* Floating label for hovered trace */}
        {hoveredTrace && lensPosition && (
          <div
            className="absolute transform -translate-x-1/2 text-center pointer-events-none"
            style={{ left: lensPosition.x, top: lensPosition.y + 60 }}
          >
            {(hoveredTrace.finding || hoveredTrace.scanGroupId) ? (
                <div className="bg-brand-primary text-white font-oswald uppercase tracking-wider px-3 py-1 rounded-md text-sm animate-pulse-glow">
                    Capture Detail
                </div>
            ) : (
                <span className="bg-black/80 text-white font-mono px-2 py-1 text-xs rounded animate-fade-in">
                    {hoveredTrace.label}
                </span>
            )}
          </div>
        )}
        
        {/* Render markers for already captured traces */}
        {capturedTraces.size > 0 && imageRef.current && [...capturedTraces].map(traceId => {
            const trace = traces.find(t => t.id === traceId);
            const rect = imageRef.current?.getBoundingClientRect();
            if (!trace || !rect) return null;
            return (
                <div key={traceId} className="absolute w-4 h-4 bg-brand-accent/80 rounded-full border-2 border-black transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-fade-in"
                    style={{ left: trace.coords.x * rect.width, top: trace.coords.y * rect.height }}
                />
            );
        })}
         
        {/* The progress HUD is now positioned correctly within the layout. */}
        {activeScanGroup && (
            <ScanProgressHUD
                group={activeScanGroup}
                capturedCount={capturedCountForActiveGroup}
            />
        )}
      </div>
    </div>
  );
};

export default ForensicLensView;