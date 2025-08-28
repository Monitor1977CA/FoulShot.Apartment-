/**
 * @file App.tsx
 * @description This file serves as the root of the React application. It embodies several key architectural patterns
 * for a scalable and maintainable frontend.
 *
 * @architectural_overview
 * 1.  **Centralized Layout Composition:** `App.tsx` is responsible for composing the main visual structure of the app,
 *     including the primary content area (`GameScreen`), the navigation (`NavBar`). The global header has been removed
 *     in favor of component-specific titles for better UI context and encapsulation.
 *
 * 2.  **State-Driven Modal System:** The component implements a powerful and flexible modal system. Instead of having
 *     components directly toggle modal visibility, they dispatch a `showModal` action to the Redux store with a `type`
 *     and `props`. This `App` component listens to the `activeModal` state and uses a `MODAL_COMPONENTS` registry
 *     (a simple object map) to render the correct modal component with the correct props.
 *
 * @pattern_benefits
 * -   **Decoupling:** Components that trigger modals (e.g., a CharacterCard) don't need to know about the modal's
 *     implementation details. They only need to know the modal's `type` and what `props` it expects.
 * -   **Scalability:** Adding a new modal to the application is trivial. A developer simply creates the new modal
 *     component, imports it here, and adds a single line to the `MODAL_COMPONENTS` registry. No other part of the
 *     application needs to change.
 * -   **Centralized Control:** All modal presentations are handled in one place, making it easy to manage and debug
 *     modal behavior globally.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import GameScreen from './components/templates/GameScreen';
import NavBar from './components/organisms/NavBar';

// Import all modal components from their correct locations
import PurchaseInfoModal from './components/organisms/modals/PurchaseInfoModal';
import InteractionModal from './components/organisms/modals/InteractionModal';
import AssignSuspectModal from './components/organisms/AssignSuspectModal';
import ADAModal from './components/organisms/modals/ADAModal';
import AccusationModal from './components/organisms/modals/AccusationModal';
import IntroSlideshowModal from './components/organisms/modals/IntroSlideshowModal';
import RarityRevealModal from './components/organisms/modals/RarityRevealModal';
import PhaseCompleteModal from './components/organisms/modals/PhaseCompleteModal';
import InsightUnlockedModal from './components/organisms/modals/InsightUnlockedModal';
import CaseSolvedModal from './components/organisms/modals/CaseSolvedModal';
import DocumentViewerModal from './components/organisms/modals/DocumentViewerModal';
import ForensicFindingModal from './components/organisms/modals/ForensicFindingModal';
import LatentConnectionModal from './components/organisms/modals/LatentConnectionModal';
import ErrorLogModal from './components/templates/ErrorLogView';
import ADADebugFab from './components/organisms/ADAFab';
import { ModalType, markIntroAsPlayed } from './store/uiSlice';
import { 
  hydrateImageCache,
  preloadKeyStoryAssets,
} from './store/storySlice';
import { logError } from './store/errorLogSlice';

/**
 * --- Modal Registry Pattern ---
 * @description A mapping of modal types to their corresponding React components.
 * This pattern allows for easy addition of new modals without modifying the core
 * App component logic. To add a new modal, simply import it and add it to this object.
 */
const MODAL_COMPONENTS: { [key in ModalType]?: React.FC<any> } = {
  ada: ADAModal,
  assignSuspect: AssignSuspectModal,
  purchaseInfo: PurchaseInfoModal,
  interaction: InteractionModal,
  accusation: AccusationModal,
  introSlideshow: IntroSlideshowModal,
  rarityReveal: RarityRevealModal,
  phaseComplete: PhaseCompleteModal,
  insightUnlocked: InsightUnlockedModal,
  caseSolved: CaseSolvedModal,
  documentViewer: DocumentViewerModal,
  forensicFinding: ForensicFindingModal,
  latentConnection: LatentConnectionModal,
  errorLog: ErrorLogModal,
};

/**
 * The main application component, acting as the central orchestrator for the UI.
 * @returns {React.FC} The rendered App component.
 */
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Select necessary state from the Redux store
  const { activeModal, activeModalProps, introPlayed, activeView, activeCardType } = useSelector((state: RootState) => state.ui);
  
  // On initial app load, hydrate the cache and start preloading assets.
  // The intro slideshow has been disabled to reduce initial image generation.
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(hydrateImageCache());

      // To save on image generations, we skip the intro slideshow.
      // We'll mark it as played and load the main game assets directly.
      if (!introPlayed) {
        dispatch(markIntroAsPlayed());
      }
      dispatch(preloadKeyStoryAssets());
    };
    initializeApp();
  }, [dispatch, introPlayed]);


  // --- Global Error Handling ---
  // This effect sets up global error listeners that catch any unhandled exceptions
  // in the application and dispatch them to the error log state. This is a robust
  // way to implement the requested error logging feature.
  useEffect(() => {
    const handleError = (message: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        const errorMsg = typeof message === 'string' ? message : (message as ErrorEvent).message;
        dispatch(logError({
            message: `Error: ${errorMsg} at ${source}:${lineno}:${colno}`,
            stack: error?.stack,
        }));
        return true; // Prevents the default browser error console log
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
         dispatch(logError({
            message: `Unhandled promise rejection: ${event.reason?.message || event.reason}`,
            stack: event.reason?.stack,
        }));
    };

    window.onerror = handleError;
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
        window.onerror = null;
        window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [dispatch]);


  /**
   * Renders the currently active modal based on the Redux state.
   * @returns {React.ReactNode | null} The modal component to render, or null if no modal is active.
   */
  const renderModal = () => {
    if (!activeModal) return null;
    
    const ModalComponent = MODAL_COMPONENTS[activeModal];
    if (!ModalComponent) {
      // If a modal is dispatched that isn't in the registry, we warn about it.
      console.warn(`No modal component registered for type: ${activeModal}`);
      return null;
    }

    // --- Data-Driven Props ---
    // The component directly passes the props object stored in the Redux state to the modal.
    // This is a clean, scalable approach that keeps the modal system robust and decoupled.
    return <ModalComponent {...(activeModalProps || {})} />;
  };
  
  // --- ARCHITECTURAL FIX: Context-Aware Layout ---
  // This is the definitive fix for the visibility of the location panel tab.
  // By checking if the active card is a 'location', we can conditionally adjust the layout.
  const isLocationCardActive = activeView === 'card' && activeCardType === 'location';
  // When a location is active, we add padding to the bottom of the main content area.
  // This padding creates space for the absolutely positioned details panel tab to be fully visible
  // above the navigation bar, fixing a key UI layout issue.
  const mainContentLayoutClass = isLocationCardActive ? 'pb-16' : '';

  return (
    <div className="relative h-screen w-screen max-w-md mx-auto flex flex-col bg-brand-bg overflow-hidden font-mono shadow-2xl shadow-black">
      {/* --- SCROLLING FIX: ---
          The `overflow-y-auto` has been removed and replaced with `overflow-y-hidden`. This is the core fix for the user's
          reported issue. It prevents the main content area from scrolling, delegating all scroll behavior to the
          child components (like the LocationCard details panel) that are designed to handle their own scrolling internally.
      */}
      <main className={`flex-1 overflow-x-hidden overflow-y-hidden relative ${mainContentLayoutClass}`}>
        <GameScreen />
      </main>
      <NavBar />
      
      {/* Render the active modal if there is one */}
      {renderModal()}
      <ADADebugFab />
    </div>
  );
};

export default App;