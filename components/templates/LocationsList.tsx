/**
 * @file LocationsList.tsx
 * @description This component manages the "Locations" view, which includes a segmented
 * control to switch between an interactive map and a list of visited locations.
 * The file has been refactored to extract all sub-components to the top level,
 * following React best practices for performance and stability.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { selectAllLocations, selectVisitedLocations, selectStoryInfo } from '../../store/storySlice';
import { setActiveCard, setLocationsView } from '../../store/uiSlice';
import { Location, PlayerAction } from '../../types';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useADA } from '../../hooks/useADA';
import { useCardImage } from '../../hooks/useCardImage';
import { Map, List } from 'lucide-react';

// --- Extracted Sub-component: CityMap ---
const CityMap: React.FC = React.memo(() => {
    const dispatch = useDispatch<AppDispatch>();
    const allLocations = useSelector((state: RootState) => selectAllLocations(state));
    const storyInfo = useSelector(selectStoryInfo);

    // --- FIX: Stabilize the card object passed to the hook ---
    // The `useMemo` hook ensures that the `mapCard` object reference remains stable
    // across re-renders, as long as its underlying data (`storyInfo.mapImagePrompt`)
    // doesn't change. This prevents the `useCardImage` hook from re-running with a
    // new object reference on every render, which was the root cause of the
    // "appearing and disappearing" race condition. This is a critical stability fix.
    const mapCard = React.useMemo(() => ({
      id: 'map',
      imagePrompt: storyInfo.mapImagePrompt
    }), [storyInfo.mapImagePrompt]);

    const { imageUrl, isLoading } = useCardImage(mapCard, 'map');

    const handleMapHotspotClick = (location: Location) => {
        dispatch(setActiveCard({ id: location.id, type: 'location' }));
    };

    // --- FIX: Stabilize the locations array ---
    // This `useMemo` is another critical stability fix. By memoizing the filtered array,
    // we ensure that the list of hotspots passed to the render function has a stable
    // reference, preventing unnecessary re-renders and potential race conditions.
    const mappableLocations = React.useMemo(() => allLocations.filter(loc => !loc.isInternal), [allLocations]);

    return (
        <div className="relative h-full w-full rounded-lg overflow-hidden border border-brand-border bg-brand-bg">
            <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={storyInfo.mapTitle} objectFit="cover" />
            {!isLoading && mappableLocations.map(loc => (
              <button 
                key={loc.id}
                onClick={() => handleMapHotspotClick(loc)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{ top: loc.mapCoords.top, left: loc.mapCoords.left }}
                aria-label={`Go to ${loc.name}`}
              >
                <span className="bg-brand-primary w-4 h-4 rounded-full border-2 border-white animate-pulse"></span>
                <span className="text-white text-sm font-bold bg-black/80 px-2 py-0.5 rounded-sm mt-2 whitespace-nowrap group-hover:text-brand-primary transition-colors drop-shadow-lg uppercase font-oswald tracking-wide">{loc.name}</span>
              </button>
            ))}
        </div>
    );
});

// --- Extracted Sub-component: VisitedLocationCard ---
const VisitedLocationCard: React.FC<{loc: Location}> = React.memo(({loc}) => {
  const dispatch = useDispatch();
  const { imageUrl, isLoading } = useCardImage(loc, 'selectiveColor');
  return (
    <div 
      className="bg-brand-surface rounded-lg overflow-hidden shadow-lg cursor-pointer group animate-fade-in border-b-4 border-transparent hover:border-brand-primary transition-all duration-300"
      onClick={() => dispatch(setActiveCard({ id: loc.id, type: 'location' }))}
    >
      <div className="h-48 relative bg-brand-bg">
        <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={loc.name} objectFit="cover" />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-300"></div>
        <h2 className="absolute bottom-2 left-3 text-3xl font-oswald text-white drop-shadow-lg uppercase">{loc.name}</h2>
      </div>
    </div>
  );
});

// --- Extracted Sub-component: VisitedLocationsList ---
const VisitedLocationsList: React.FC = React.memo(() => {
  const visitedLocations = useSelector((state: RootState) => selectVisitedLocations(state));
  const storyInfo = useSelector(selectStoryInfo);

  const crimeSceneLocation = visitedLocations.find(loc => loc.id === storyInfo.crimeSceneId);
  const otherLocations = visitedLocations.filter(loc => loc.id !== storyInfo.crimeSceneId);

  if (visitedLocations.length === 0) {
    return (
        <div className="p-4 h-full flex items-center justify-center text-center">
            <p className="text-brand-text-muted">You have not visited any locations yet. Explore the map to discover new places.</p>
        </div>
    );
  }

  return (
    <div className="p-4 pt-0 pb-40 overflow-y-auto h-full">
      {crimeSceneLocation && (
        <section className="mb-8">
            <h2 className="text-2xl font-oswald text-brand-primary mb-3 border-b border-brand-primary/30 pb-1 uppercase tracking-wider">Crime Scene</h2>
            <VisitedLocationCard loc={crimeSceneLocation} />
        </section>
      )}

      {otherLocations.length > 0 && (
         <section>
          <h2 className="text-2xl font-oswald text-brand-primary mb-3 border-b border-brand-border/30 pb-1 uppercase tracking-wider">Secondary Locations</h2>
          <div className="grid grid-cols-1 gap-4">
            {otherLocations.map((loc) => <VisitedLocationCard key={loc.id} loc={loc} />)}
          </div>
        </section>
      )}
    </div>
  );
});

// --- Extracted Sub-component: SegmentedControlButton ---
const SegmentedControlButton: React.FC<{
    view: 'map' | 'list';
    label: string;
    Icon: React.ElementType;
    isActive: boolean;
    onClick: (view: 'map' | 'list') => void;
}> = ({ view, label, Icon, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(view)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-300
                ${isActive ? 'bg-brand-primary text-white shadow-md' : 'bg-transparent text-brand-text-muted hover:bg-white/5'}`}
        >
            <Icon size={18} />
            <span className="uppercase tracking-wider">{label}</span>
        </button>
    );
};

// --- Main Component: LocationsPage (exported as default) ---
const LocationsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const locationsView = useSelector((state: RootState) => state.ui.locationsView);
    const storyInfo = useSelector(selectStoryInfo);
    const triggerADA = useADA();

    const handleViewChange = React. useCallback((view: 'map' | 'list') => {
        dispatch(setLocationsView(view));
        if (view === 'map') {
            triggerADA(PlayerAction.VIEW_LIST, "Player is viewing the city map. We have warrants to search all of these locations and for access to all of the suspects' files and digital information.");
        } else {
            triggerADA(PlayerAction.VIEW_LIST, "Player is now viewing their list of visited locations.");
        }
    }, [dispatch, triggerADA]);

    return (
        <div className="p-4 h-full flex flex-col">
            <header className="mb-4 flex-shrink-0">
                <h1 className="text-4xl font-oswald text-brand-accent mb-4 uppercase">City Map</h1>
                <div className="bg-brand-surface p-1 rounded-lg flex space-x-1 border border-brand-border">
                    {/* --- UI FIX ---
                        The label for the map button was previously bound to `storyInfo.mapTitle`, which resolves to "Foul Shot".
                        Per user feedback, this has been changed to the static string "Map" for clarity and correctness.
                    */}
                    <SegmentedControlButton view="map" label="Map" Icon={Map} isActive={locationsView === 'map'} onClick={handleViewChange} />
                    <SegmentedControlButton view="list" label="Visited" Icon={List} isActive={locationsView === 'list'} onClick={handleViewChange} />
                </div>
            </header>
            <main className="flex-1 overflow-hidden min-h-0">
                {locationsView === 'map' ? <CityMap /> : <VisitedLocationsList />}
            </main>
        </div>
    );
};

export default LocationsList;