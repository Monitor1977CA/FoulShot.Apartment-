import React from 'react';
import { Interaction } from '../../../types';
import ModalWrapper from './ModalWrapper';
import PhoneUnlockScreen from '../minigames/PhoneUnlockScreen';
import SafeCrackScreen from '../minigames/SafeCrackScreen';
import ComputerLoginScreen from '../minigames/ComputerLoginScreen';

// --- ARCHITECTURAL FIX ---
// The component's props are now the `Interaction` object directly.
// This matches the data passed from the `showModal` action in ObjectCard,
// which passes `component.props`. This resolves a `TypeError` where
// the component was trying to access `props.interaction.type` but `interaction` was undefined.
const InteractionModal: React.FC<Interaction> = (props) => {
  const renderInteraction = () => {
    switch (props.type) {
      case 'phone_unlock':
        return <PhoneUnlockScreen interaction={props} />;
      case 'safe_crack':
        return <SafeCrackScreen interaction={props} />;
      case 'computer_login':
        return <ComputerLoginScreen interaction={props} />;
      default:
        return <p>Unknown interaction type.</p>;
    }
  };

  return (
    <ModalWrapper title={props.prompt}>
      {renderInteraction()}
    </ModalWrapper>
  );
};

export default InteractionModal;
