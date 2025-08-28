/**
 * @file hooks/useHotspotAnalysis.ts
 * @description This custom hook encapsulates the logic for analyzing a location image to find hotspots.
 * It now features a robust caching mechanism to prevent re-analyzing the same image,
 * improving performance and reducing API costs.
 */
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeImageForHotspots } from '../services/geminiService';
import { Hotspot } from '../types';
import { RootState, AppDispatch } from '../store';
import { setDynamicHotspotCoords, selectDynamicHotspotsForLocation } from '../store/storySlice';
import { blobToBase64 } from '../services/dbService';

interface HotspotAnalysisResult {
  dynamicHotspots: { [key: string]: { x: number; y: number } } | null;
  isAnalyzing: boolean;
}

/**
 * A hook to manage the analysis of an image for dynamic hotspot coordinates, now with caching.
 * @param {string | null} imageUrl - The URL of the image to analyze. Used as a trigger to start analysis.
 * @param {Hotspot[]} hotspotsToFind - An array of hotspot definitions to search for.
 * @param {string} locationId - The unique ID of the location, used as the cache key and for DB lookup.
 * @returns {HotspotAnalysisResult} An object containing the coordinates of found hotspots and the loading state.
 */
export const useHotspotAnalysis = (
  imageUrl: string | null,
  hotspotsToFind: Hotspot[],
  locationId: string
): HotspotAnalysisResult => {
  const dispatch = useDispatch<AppDispatch>();
  const cachedCoords = useSelector((state: RootState) => selectDynamicHotspotsForLocation(state, locationId));

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dynamicHotspots, setDynamicHotspots] = useState<{ [key: string]: { x: number; y: number } } | null>(cachedCoords || null);
  
  const analysisStartedRef = useRef(false);

  useEffect(() => {
    // If we have cached coordinates, use them immediately and don't proceed with analysis.
    if (cachedCoords) {
      setDynamicHotspots(cachedCoords);
      return;
    }
    
    // Guard against running analysis multiple times or without an image URL trigger.
    if (!imageUrl || analysisStartedRef.current) {
      return;
    }

    const itemsToAnalyze = hotspotsToFind
      .filter(h => !h.coords && h.aiHint)
      .map(h => ({ id: h.id, label: h.label, hint: h.aiHint }));

    if (itemsToAnalyze.length === 0) {
      return;
    }

    const analyze = async () => {
      analysisStartedRef.current = true;
      setIsAnalyzing(true);

      try {
        // --- ARCHITECTURAL FIX: Fetch blob from the image URL ---
        // Instead of getting the blob from IndexedDB (which can be unreliable),
        // we fetch the object URL directly. This is more robust as it uses the same
        // resource the <img> tag is using, preventing "Not Found" errors with FileReader.
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (!blob || blob.size === 0) {
          console.warn(`Skipping hotspot analysis for location ${locationId}: fetched blob is invalid or empty.`);
          setDynamicHotspots(null);
          setIsAnalyzing(false);
          return;
        }
        
        // Convert the valid blob to base64 for the API.
        const base64Data = await blobToBase64(blob);

        const coords = await analyzeImageForHotspots(base64Data, itemsToAnalyze);
        if (coords) {
            // Save the successful analysis results to the Redux cache.
            dispatch(setDynamicHotspotCoords({ locationId, coords }));
            setDynamicHotspots(coords);
        } else {
             setDynamicHotspots(null);
        }
      } catch (error) {
        console.error("Failed to process image for hotspot analysis:", error);
        setDynamicHotspots(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyze();

  }, [imageUrl, hotspotsToFind, locationId, dispatch, cachedCoords]);

  return { dynamicHotspots, isAnalyzing: isAnalyzing && !cachedCoords };
};
