/**
 * @file LocationCard.tsx
 * @description Renders the detailed view for a single location, including dynamic, interactive hotspots.
 * This component showcases a robust system for hotspot placement and a new expandable footer for richer narrative context.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Location, PlayerAction, CardType, Character } from '../../types';
import { setActiveCard, goBack, setLocationPanelExpanded, addTimelineMessage } from '../../store/uiSlice';
import { AppDispatch, RootState } from '../../store';
import { useCardImage } from '../../hooks/useCardImage';
import { useHotspotAnalysis } from '../../hooks/useHotspotAnalysis';
import Hotspot from '../atoms/Hotspot';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useADA } from '../../hooks/useADA';
import Spinner from '../atoms/Spinner';
import { ChevronUp, ArrowLeft } from 'lucide-react';
import AssociatedCharacterInfo from '../molecules/AssociatedCharacterInfo';
import OfficialReportButton from '../molecules/OfficialReportButton';
import DataPair from '../molecules/DataPair';
import { selectCharacterById, selectCharactersByIds, selectObjectIds, selectLocationIds, selectEvidenceGroupIds, selectCharacterIds } from '../../store/storySlice';
import useCardResolver from '../../hooks/useCardResolver';

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
  const dispatch = useDispatch<AppDispatch>();
  const triggerADA = useADA();
  const resolveCard = useCardResolver();
  
  const [isImageRendered, setIsImageRendered] = useState(false);
  const isExpanded = useSelector((state: RootState) => state.ui.locationPanelExpandedState[location.id] ?? false);
  const { imageUrl, isLoading: isImageLoading } = useCardImage(location, 'selectiveColor');
  
  // --- HOTSPOT FIX: The hook is now only passed a valid image URL *after* the `onLoad` event has fired. ---
  const { dynamicHotspots, isAnalyzing } = useHotspotAnalysis(
    isImageRendered ? imageUrl : null, 
    location.hotspots, 
    location.id
  );

  const associatedCharacters = useSelector((state: RootState) =>
    // Use memoized selector to get stable array reference for associated characters
    selectCharactersByIds(state, location.associatedCharacterIds || [])
  );
  
  // --- RUNTIME VALIDATION SETS ---
  const objectIds = useSelector((s: RootState) => selectObjectIds(s));
  const locationIds = useSelector((s: RootState) => selectLocationIds(s));
  const evidenceGroupIds = useSelector((s: RootState) => selectEvidenceGroupIds(s));
  const characterIds = useSelector((s: RootState) => selectCharacterIds(s));
   
   const handleGoBack = () => {
     dispatch(goBack());
     triggerADA(PlayerAction.VIEW_LIST, `Player has returned to the previous view.`);
   };

   const handleHotspotClick = (targetId: string, targetType: CardType | 'evidenceGroup', label: string) => {
     const resolved = resolveCard(targetId, targetType);
     if (!resolved) {
       console.warn(`Hotspot navigation blocked — target not found. hotspotLabel=${label}, targetId=${targetId}, targetType=${targetType}, location=${location.id}`);
       // Developer-facing, non-intrusive message so QA can quickly spot data issues in the running app.
       dispatch(addTimelineMessage(`Developer: Hotspot blocked at ${location.name} — "${label}" (${targetId})`));
       return;
     }

     if (resolved.source === 'corrected') {
       console.warn(`Hotspot target type auto-corrected for ${targetId}: declared=${targetType} corrected=${resolved.type}`);
       // Surface the auto-correction to the timeline so maintainers notice the data mismatch.
       dispatch(addTimelineMessage(`Developer: Hotspot auto-corrected — ${targetId} is ${resolved.type} (declared ${targetType})`));
     }

     const payloadType: CardType = resolved.type === 'evidenceGroup' ? ('evidenceGroup' as CardType) : (resolved.type as CardType);

     dispatch(setActiveCard({ id: resolved.id, type: payloadType }));
     triggerADA(
       PlayerAction.TAP_HOTSPOT,
       `Player has tapped on hotspot "${label}" inside ${location.name}.`,
       location.imagePrompt
     );
   };
  
  const handleToggleExpand = () => {
    dispatch(setLocationPanelExpanded({ locationId: location.id, isExpanded: !isExpanded }));
  };

  const visibleHotspots = useMemo(() => {
    return location.hotspots.map((hotspot, index) => {
        let coords: { top: string; left: string; } | null = null;
        if (hotspot.coords) {
            coords = { top: String(hotspot.coords.top), left: String(hotspot.coords.left) };
        } else if (dynamicHotspots && dynamicHotspots[hotspot.id]) {
            const dynamicCoord = dynamicHotspots[hotspot.id];
            coords = { top: `${dynamicCoord.y * 100}%`, left: `${dynamicCoord.x * 100}%` };
        }
        if (!isAnalyzing && !coords) {
            const totalHotspots = location.hotspots.length;
            const fallbackLeft = `${(index + 1) * (100 / (totalHotspots + 1))}%`;
            coords = { top: '85%', left: fallbackLeft };
        }
        if (!coords) return null;
        return { ...hotspot, finalCoords: coords };
    }).filter(Boolean);
  }, [location.hotspots, dynamicHotspots, isAnalyzing]);

  const isContentLoading = isImageLoading || isAnalyzing;

  return (
    // The root is a relative container to establish a stacking context for its absolute children.
    <div className="relative w-full h-full bg-black">
      
      {/* The main content area is an absolute layer that fills the container. */}
      <main className="absolute inset-0 w-full h-full overflow-hidden bg-brand-bg">
        <ImageWithLoader 
            imageUrl={imageUrl} 
            isLoading={isImageLoading} 
            alt={location.name} 
            onLoad={() => setIsImageRendered(true)}
        />
        {!isContentLoading && visibleHotspots.map(hotspot => (
            hotspot && (
                <Hotspot
                    key={hotspot.id}
                    coords={hotspot.finalCoords}
                    label={hotspot.label}
                    type={hotspot.type}
                    onClick={() => handleHotspotClick(hotspot.targetCardId, hotspot.targetCardType, hotspot.label)}
                />
            )
        ))}
      </main>
      
      {/* The header is an absolute layer on top of the main content. */}
      {/* Keep header above panel, add stronger masking and a subtle blur to prevent titles from other scenes bleeding through. */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 flex items-start justify-between bg-gradient-to-b from-black/95 to-transparent backdrop-blur-sm transition-opacity duration-300">
        <div className="flex items-start gap-3">
           <button
            onClick={handleGoBack}
            className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10 mt-1 flex-shrink-0"
            aria-label="Go back"
           >
            <ArrowLeft size={24} />
          </button>
          {/* Responsive title: smaller on small viewports to avoid overlap */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-oswald text-white drop-shadow-lg uppercase tracking-tighter leading-tight">{location.name}</h1>
        </div>
        <div className="w-32 flex-shrink-0" />
      </header>
      
      {/* The loading spinner is layered on top of everything. */}
      {isContentLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-brand-bg">
              <Spinner />
          </div>
      )}
      
      {/* The info panel is an absolute layer at the bottom of the container. */}
      <div
        id="location-panel-container"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-70 pointer-events-none"
      >
        {/* NOTE: Tab moved inside the panel so it always travels with the panel and remains visually attached. */}

        <div
          id="location-info-panel"
          className={`relative bg-brand-surface/90 backdrop-blur-sm rounded-t-xl overflow-visible transition-transform pointer-events-auto ${isExpanded ? 'open' : ''}`}
          style={{
            borderTop: '6px solid #f6c800',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
          }}
         >
           {/* The TAB (now inside the panel): positioned absolutely so it visually overlaps the rounded panel top. */}
           <div
             onClick={handleToggleExpand}
             role="button"
             aria-expanded={isExpanded}
             aria-controls="location-details-content"
             className="absolute -top-10 right-6 w-fit bg-yellow-400 text-black rounded-t-2xl flex items-center gap-3 px-8 py-3 cursor-pointer font-oswald uppercase tracking-wider transition-transform hover:-translate-y-1 shadow-2xl"
             style={{ zIndex: 9999 }}
           >
             <span>Details</span>
             <ChevronUp className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
           </div>
          
          {/* Details content (always rendered). Panel height determines whether it appears collapsed or expanded. */}
          <div
            id="location-details-content"
            className="overflow-y-auto p-4 space-y-6"
            style={{ height: '100%' }}
          >
            <h2 className="text-lg font-oswald uppercase tracking-wider text-brand-accent pr-4">
                {location.sceneSummary || location.lastEventDescription}
            </h2>

            {location.detailedDescription && (
                <p className="text-white leading-relaxed">{location.detailedDescription}</p>
            )}

            {location.propertyRecords && (
              <div>
                <h3 className="font-oswald text-brand-primary uppercase tracking-wider mb-2">Property & Records</h3>
                <div className="bg-black/20 p-3 rounded-lg border border-brand-border">
                  <DataPair label="Owner" value={location.propertyRecords.owner} />
                  <DataPair label="Last Sale Date" value={location.propertyRecords.lastSoldDate} />
                  <DataPair label="Last Sale Price" value={location.propertyRecords.lastSoldPrice} />
                  <DataPair label="Zoning" value={location.propertyRecords.zoning} />
                  {location.propertyRecords.notes && (
                    <div className="pt-3 mt-2 border-t border-brand-border/50">
                      <p className="text-sm text-brand-text-muted italic">
                        <span className="font-bold not-italic">Case Notes:</span> {location.propertyRecords.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {associatedCharacters && associatedCharacters.length > 0 && (
                <div>
                    <h3 className="font-oswald text-brand-primary uppercase tracking-wider mb-2">Relevant Personnel</h3>
                    <div className="space-y-2">
                        {associatedCharacters.map(char => (
                            <AssociatedCharacterInfo key={char.id} character={char} locationId={location.id} />
                        ))}
                    </div>
                </div>
            )}

            {location.officialReportIds && location.officialReportIds.length > 0 && (
                <div>
                    <h3 className="font-oswald text-brand-primary uppercase tracking-wider mb-2">Police & Forensic Reports</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {location.officialReportIds.map(report => (
                            <OfficialReportButton key={report.id} report={report} />
                        ))}
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
