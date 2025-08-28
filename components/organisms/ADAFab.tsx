import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { showModal } from '../../store/uiSlice';
import { selectHasNewErrors, markErrorsAsRead } from '../../store/errorLogSlice';
import { Bug } from 'lucide-react';

const DebugFab: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const hasNewErrors = useSelector(selectHasNewErrors);

    const handleClick = () => {
        dispatch(showModal({ type: 'errorLog' }));
        if (hasNewErrors) {
            dispatch(markErrorsAsRead());
        }
    };

    return (
        <div 
            className="fixed bottom-4 right-4 z-40"
        >
            <button
                onClick={handleClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center
                    bg-yellow-500 text-black border-2 border-yellow-300 transition-all duration-300 ease-in-out transform
                    hover:scale-110 shadow-lg
                `}
                aria-label={"Open System Log"}
            >
                <div className="relative">
                    <Bug className="w-6 h-6" />
                    {hasNewErrors && <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-yellow-500"></span>}
                </div>
            </button>
        </div>
    );
};

export default DebugFab;