
import React, { useState } from 'react';
import { Interaction } from '../../../types';
import Button from '../../atoms/Button';

interface ComputerLoginScreenProps {
  interaction: Interaction;
}

const ComputerLoginScreen: React.FC<ComputerLoginScreenProps> = ({ interaction }) => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === interaction.solution) {
      setMessage('Login Successful. Accessing files...');
    } else {
      setMessage('Incorrect Password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h3 className="text-2xl font-oswald mb-6">{interaction.prompt}</h3>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 mb-4 text-xl text-left bg-brand-bg border-2 border-brand-border rounded-lg text-white font-mono"
          placeholder="Password"
        />
        <Button type="submit" className="w-full uppercase">
          Login
        </Button>
      </form>
      {message && <p className="mt-6 text-lg text-brand-primary animate-fade-in">{message}</p>}
    </div>
  );
};

export default ComputerLoginScreen;
