
import React, { useState } from 'react';
import { Interaction } from '../../../types';
import Button from '../../atoms/Button';

interface PhoneUnlockScreenProps {
  interaction: Interaction;
}

const PhoneUnlockScreen: React.FC<PhoneUnlockScreenProps> = ({ interaction }) => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === interaction.solution) {
      setMessage('Access Granted. Phone unlocked.');
      // Here you would dispatch an action to update the game state
    } else {
      setMessage('Access Denied. Incorrect passcode.');
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h3 className="text-2xl font-oswald mb-6">{interaction.prompt}</h3>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="tel"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4}
          className="w-full p-4 mb-4 text-3xl text-center bg-brand-bg border-2 border-brand-border rounded-lg text-white font-mono tracking-[0.5em]"
          placeholder="----"
        />
        <Button type="submit" className="w-full uppercase">
          Unlock
        </Button>
      </form>
      {message && <p className="mt-6 text-lg text-brand-primary animate-fade-in">{message}</p>}
    </div>
  );
};

export default PhoneUnlockScreen;
