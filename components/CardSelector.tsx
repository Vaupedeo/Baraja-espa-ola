import React, { useState } from 'react';
import { Card, Suit, Rank } from '../types';
import { SUITS, RANKS } from '../constants';

interface CardSelectorProps {
  onInterpret: (card: Card) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({ onInterpret }) => {
  const [suit, setSuit] = useState<Suit>(Suit.Oros);
  const [rank, setRank] = useState<Rank>('As');
  const [inverted, setInverted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInterpret({ suit, rank, inverted });
  };

  return (
    <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-2xl border border-yellow-400/30 max-w-lg mx-auto animate-fade-in">
      <h3 className="text-xl font-cinzel text-center text-yellow-400 mb-6">Elige una Carta para Interpretar</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rank" className="block mb-2 text-sm font-bold text-gray-300">Número o Figura</label>
            <select
              id="rank"
              value={rank}
              onChange={(e) => setRank(e.target.value as Rank)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white"
            >
              {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="suit" className="block mb-2 text-sm font-bold text-gray-300">Palo</label>
            <select
              id="suit"
              value={suit}
              onChange={(e) => setSuit(e.target.value as Suit)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white"
            >
              {SUITS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <input
            id="inverted"
            type="checkbox"
            checked={inverted}
            onChange={(e) => setInverted(e.target.checked)}
            className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
          />
          <label htmlFor="inverted" className="ml-3 text-lg text-gray-300 cursor-pointer">
            Carta Invertida
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
        >
          Consultar al Oráculo
        </button>
      </form>
    </div>
  );
};