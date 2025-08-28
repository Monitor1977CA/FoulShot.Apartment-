/**
 * @file NavBar.tsx
 * @description Renders the main navigation bar at the bottom of the screen.
 * This file has been refactored for performance by extracting the `NavButton` sub-component
 * and updated to provide a clearer active state, notification counts, and integrate the player's token wallet.
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setActiveView } from '../../store/uiSlice';
import { ViewType, PlayerAction } from '../../types';
import { Users, Map, BookOpen } from 'lucide-react';
import { useADA } from '../../hooks/useADA';

/**
 * --- Extracted Sub-Component: NavButton ---
 * A memoized, reusable button for the navigation bar, now with notification support.
 */
const NavButton: React.FC<{ 
  view: ViewType; 
  label: string; 
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (view: ViewType) => void;
  hasNotification?: boolean;
}> = React.memo(({ view, label, icon, isActive, onClick, hasNotification }) => {
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 h-full relative
      ${isActive ? 'bg-brand-primary text-brand-bg' : 'text-brand-text-muted hover:text-white hover:bg-white/5'}`}
      aria-label={`Go to ${label}`}
    >
      <div className="relative">
        {icon}
        {hasNotification && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-primary ring-2 ring-brand-surface"></span>}
      </div>
      <span className="text-xs font-oswald uppercase tracking-wider mt-1">{label}</span>
    </button>
  );
});

/**
 * The main navigation bar component.
 */
const NavBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeView } = useSelector((state: RootState) => state.ui);
  const triggerADA = useADA();

  const handleNavClick = React.useCallback((view: ViewType) => {
    if (activeView === view) return;
    dispatch(setActiveView(view));
    const viewName = `list of ${view}`;
    triggerADA(PlayerAction.VIEW_LIST, `Player is now viewing the ${viewName}.`);
  }, [dispatch, triggerADA, activeView]);

  return (
    <nav className="w-full bg-brand-surface h-16 flex items-center border-t-2 border-brand-border shadow-lg">
      <NavButton view="locations" label="Locations" icon={<Map size={24} />} isActive={activeView === 'locations'} onClick={handleNavClick} />
      <NavButton view="people" label="People" icon={<Users size={24} />} isActive={activeView === 'people'} onClick={handleNavClick} />
      <NavButton 
        view="timeline" 
        label="Timeline" 
        icon={<BookOpen size={24} />} 
        isActive={activeView === 'timeline'} 
        onClick={handleNavClick}
      />
    </nav>
  );
};

export default NavBar;