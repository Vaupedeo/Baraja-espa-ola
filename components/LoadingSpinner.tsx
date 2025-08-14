
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-cinzel text-yellow-300">El Oráculo está consultando las estrellas...</p>
  </div>
);
