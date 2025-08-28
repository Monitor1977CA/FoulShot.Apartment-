/**
 * @file PurchaseInfoModal.tsx
 * @description A modal for displaying an object's purchase details and receipts.
 * This component has been refactored to use the reusable `DataPair` component,
 * improving maintainability and code consistency.
 */
import React from 'react';
import { PurchaseInfo } from '../../../types';
import ModalWrapper from './ModalWrapper';
import DataPair from '../../molecules/DataPair';

// --- ARCHITECTURAL FIX ---
// The component's props are now the `PurchaseInfo` object directly.
// This matches the data being passed from the `showModal` action in ObjectCard,
// which passes `component.props`. This resolves a critical `TypeError` where
// the component was trying to access `props.info.brand` but `info` was undefined.
const PurchaseInfoModal: React.FC<PurchaseInfo> = (props) => {
  return (
    <ModalWrapper title="Purchase Information">
      <div className="space-y-6">
        <div>
            <h3 className="font-oswald text-xl text-brand-primary mb-2 uppercase">Item Details</h3>
            <div className="bg-brand-surface p-4 rounded-lg border border-brand-border">
                {/* Using the reusable DataPair component for consistency and maintainability */}
                <DataPair label="Brand" value={props.brand} />
                <DataPair label="Model" value={props.model} />
                <DataPair label="SKU" value={props.sku} />
                <DataPair label="Manufacturer" value={props.manufacturer} />
            </div>
        </div>

        {props.receipts && props.receipts.length > 0 && (
            <div>
                <h3 className="font-oswald text-xl text-brand-primary mb-2 uppercase">Receipts</h3>
                <div className="space-y-4">
                {props.receipts.map((receipt, index) => (
                    <div key={index} className="bg-brand-surface p-4 rounded-lg border-l-4 border-brand-primary">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-lg">{receipt.vendor}</p>
                            <p className="text-brand-text-muted text-sm">{new Date(receipt.date).toLocaleDateString()}</p>
                        </div>
                        <p className="font-mono text-xl text-brand-accent mb-4">${receipt.price.toFixed(2)}</p>
                        <img src={receipt.imageUrl} alt={`Receipt from ${receipt.vendor}`} className="rounded-md w-full" />
                    </div>
                ))}
                </div>
            </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default PurchaseInfoModal;
