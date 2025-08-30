/**
 * @file SocialMediaFeedCard.tsx
 * @description A new card component that displays a character's social media feed.
 * This replaces the previous modal, providing a more consistent and interactive UI
 * that aligns with the other card views in the application.
 */
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Character, PlayerAction, StoryObject } from '../../types';
import { AppDispatch, RootState } from '../../store';
import { goBack, setActiveCard } from '../../store/uiSlice';
import { selectObjectById, selectObjectIds, selectObjectEntities } from '../../store/storySlice';
import ImageWithLoader from '../molecules/ImageWithLoader';
import { useCardImage } from '../../hooks/useCardImage';
import { useADA } from '../../hooks/useADA';
import { ArrowLeft, ZoomIn } from 'lucide-react';

/**
 * --- Extracted Sub-Component: PostCard ---
 * A memoized component to display a single social media post, which is now a StoryObject.
 * This improves performance and makes each post interactive.
 */
const PostCard: React.FC<{ postId: string }> = React.memo(({ postId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const post = useSelector((state: RootState) => selectObjectById(state, postId));

    // Guard against post being undefined during state updates
    if (!post) {
        return null;
    }

    const { imageUrl, isLoading } = useCardImage(post, 'selectiveColor');

    const handleClick = () => {
        // Clicking a post now navigates to its own ObjectCard.
        dispatch(setActiveCard({ id: post.id, type: 'object' }));
    };

    return (
        <div 
            className="bg-brand-surface rounded-lg overflow-hidden shadow-lg animate-fade-in border border-brand-border cursor-pointer hover:border-brand-primary transition-all duration-300 group relative"
            onClick={handleClick}
        >
            <div className="h-96 relative bg-brand-bg">
                <ImageWithLoader imageUrl={imageUrl} isLoading={isLoading} alt={post.name || 'Social media post'} objectFit="cover" />
                {/* --- MOBILE UX FIX: Persistent Visual Cue --- */}
                <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white/80 border border-white/20 pointer-events-none">
                    <ZoomIn size={18} />
                </div>
            </div>
            <div className="p-4">
                <p className="text-brand-text leading-relaxed">{post.description}</p>
                <p className="text-xs text-brand-text-muted mt-2">{new Date(post.timestamp).toLocaleString()}</p>
            </div>
        </div>
    );
});


const SocialMediaFeedCard: React.FC<{ character: Character }> = ({ character }) => {
    const dispatch = useDispatch<AppDispatch>();
    const triggerADA = useADA();
    
    // --- ARCHITECTURAL FIX: Performant Data Selection ---
    // Instead of selecting a constantly changing array of objects, we select the more stable
    // list of all object IDs and the map of entities. `useMemo` then derives a stable list
    // of post IDs, preventing re-renders unless the underlying data truly changes.
    // Use memoized selectors from the store to get stable references and avoid
    // creating new arrays/objects on every render which can trigger unnecessary
    // re-renders in connected components.
    const allObjectIds = useSelector((state: RootState) => selectObjectIds(state));
    const objectEntities = useSelector((state: RootState) => selectObjectEntities(state));

    const postIds = useMemo(() => {
        const ids = allObjectIds.filter(id => {
            const obj = objectEntities[id];
            return obj && obj.ownerCharacterId === character.id && obj.category === 'socialMedia';
        });
        // Sort by timestamp descending to show newest first, like a real feed.
        ids.sort((idA, idB) => {
            const objA = objectEntities[idA];
            const objB = objectEntities[idB];
            if (!objA || !objB) return 0;
            return new Date(objB.timestamp).getTime() - new Date(objA.timestamp).getTime();
        });
        return ids;
    }, [allObjectIds, objectEntities, character.id]);

    // Trigger ADA analysis when the card is first viewed.
    React.useEffect(() => {
        triggerADA(
            PlayerAction.VIEW_SOCIAL_MEDIA_FEED,
            `Player is viewing the social media feed for ${character.name}.`
        );
    // We only want this to run once when the character changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [character.id]);

    return (
        <div className="w-full h-full flex flex-col bg-brand-bg animate-slide-in-bottom">
            {/* Header, consistent with other cards like EvidenceGroupCard */}
            <header className="p-4 flex items-start gap-4 flex-shrink-0 bg-black">
                 <button
                    onClick={() => dispatch(goBack())}
                    className="p-2 rounded-full text-white bg-black/50 hover:bg-brand-primary transition-colors z-10 mt-1 flex-shrink-0"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-6xl font-oswald text-white uppercase tracking-tighter leading-tight">
                    {`${character.name.split(' ')[0]}'s Feed`}
                </h1>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 w-full p-4 pb-24 overflow-y-auto">
                {postIds.length > 0 ? (
                    <div className="space-y-4">
                        {postIds.map(postId => <PostCard key={postId} postId={postId} />)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center">
                        <p className="text-brand-text-muted">No social media activity found for this individual.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialMediaFeedCard;