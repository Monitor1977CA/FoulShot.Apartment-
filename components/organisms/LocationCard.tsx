/**
 * @file LocationCard.tsx
 * @description Renders the detailed view for a single location, including dynamic, interactive hotspots.
 * This component showcases a robust system for hotspot placement and a new expandable footer for richer narrative context.
 */

import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Location, PlayerAction, CardType, Character } from '../../types';
import { setActiveCard, goBack, setLocationPanelExpanded } from '../../store/uiSlice';
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
import { selectCharacterById } from '../../store/storySlice';

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
  const dispatch = useDispatch<AppDispatch>();
  const triggerADA = useADA();
  
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
    location.associatedCharacterIds?.map(id => selectCharacterById(state, id)).filter(Boolean) as Character[]
  );
  
  const COLLAPSED_PANEL_HEIGHT = '88px';
  const EXPANDED_PANEL_HEIGHT = '60vh';

  const handleGoBack = () => {
    dispatch(goBack());
    triggerADA(PlayerAction.VIEW_LIST, `Player has returned to the previous view.`);
  };

  const handleHotspotClick = (targetId: string, targetType: CardType | 'evidenceGroup', label: string) => {
    dispatch(setActiveCard({ id: targetId, type: targetType as CardType }));
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
    <div className="relative w-full h-full bg-black animate-slide-in-bottom">
      
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
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-start justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-start gap-3">
           <button
            onClick={handleGoBack}
            className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10 mt-1 flex-shrink-0"
            aria-label="Go back"
           >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-6xl font-oswald text-white drop-shadow-lg uppercase tracking-tighter leading-tight">{location.name}</h1>
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
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        {/* The TAB */}
        <div
          onClick={handleToggleExpand}
          role="button"
          aria-expanded={isExpanded}
          aria-controls="location-details-content"
          className="relative ml-auto right-4 w-fit bg-yellow-400 text-black rounded-t-lg flex items-center gap-2 px-6 py-2 cursor-pointer font-oswald uppercase tracking-wider transition-transform hover:-translate-y-1 shadow-lg"
        >
          <span>Details</span>
          <ChevronUp className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* --- SCROLLING FIX: DEFINITIVE REFACTOR ---
            The panel itself is now the scroll container (`overflow-y-auto`). The inner `div` has been removed,
            and its padding and spacing classes have been moved here. This is a robust, simple, and canonical
            solution that guarantees the content will scroll correctly, resolving the user's persistent issue.
        */}
        <div
          id="location-info-panel"
          className="bg-brand-surface/90 backdrop-blur-sm rounded-t-lg border-t-2 border-yellow-400 transition-all duration-500 ease-in-out overflow-y-auto p-4 space-y-6"
          style={{ height: isExpanded ? EXPANDED_PANEL_HEIGHT : COLLAPSED_PANEL_HEIGHT }}
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
  );
};

export default LocationCard;
