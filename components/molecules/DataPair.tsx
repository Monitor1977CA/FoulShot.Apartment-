/**
 * @file components/molecules/DataPair.tsx
 * @description A reusable component for displaying a key-value pair with consistent styling.
 * This component was extracted from multiple modals to follow the DRY (Don't Repeat Yourself)
 * principle and has been memoized with `React.memo` for performance optimization.
 */
import React from 'react';

interface DataPairProps {
    label: string;
    value: string | number | undefined | null;
}

/**
 * Renders a styled key-value pair, commonly used for displaying record details.
 * It gracefully handles undefined or null values by not rendering anything, which cleans up the UI.
 * @param {DataPairProps} props - The props for the component.
 * @returns {React.FC | null} The rendered component or null.
 */
const DataPair: React.FC<DataPairProps> = React.memo(({ label, value }) => {
    // Graceful handling of missing data is important for robust UIs.
    if (value === undefined || value === null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
            <dt className="text-brand-text-muted capitalize">{label}</dt>
            <dd className="font-mono text-brand-text text-right">{value}</dd>
        </div>
    );
});

export default DataPair;
