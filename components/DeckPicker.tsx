import React, { useState, useEffect } from 'react';
import { ReadingCard } from '../types';
import { DECK } from '../constants';

// Helper to shuffle the deck
const shuffleDeck = () => {
  return [...DECK].sort(() => Math.random() - 0.5);
};

// Helper to prepare the full deck for picking
export const createPickingDeck = (): ReadingCard[] => {
  const shuffled = shuffleDeck();
  return shuffled.map((card, index) => ({
    ...card,
    inverted: Math.random() > 0.5,
    id: `${card.rank}-${card.suit}-${index}`
  }));
};

interface FaceDownCardProps {
    onClick: () => void;
    isSelected: boolean;
}

const FaceDownCard: React.FC<FaceDownCardProps> = ({ onClick, isSelected }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                w-24 h-36 md:w-28 md:h-40 rounded-lg shadow-lg cursor-pointer transition-all duration-300
                bg-gradient-to-br from-indigo-800 to-purple-900 border-2 
                hover:border-yellow-400 hover:shadow-yellow-400/30 hover:-translate-y-2
                ${isSelected 
                    ? 'transform -translate-y-3 scale-105 shadow-xl shadow-yellow-300/40 border-yellow-300' 
                    : 'border-yellow-500/50'
                }
            `}
            aria-selected={isSelected}
        >
            <div className="w-full h-full flex items-center justify-center opacity-30">
                <svg className="w-20 h-20 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" />
                </svg>
            </div>
        </div>
    );
};


interface DeckPickerProps {
    count: number;
    deck: ReadingCard[];
    onCardsSelected: (cards: ReadingCard[]) => void;
}

export const DeckPicker: React.FC<DeckPickerProps> = ({ count, deck, onCardsSelected }) => {
    const [selectedCards, setSelectedCards] = useState<ReadingCard[]>([]);
    
    useEffect(() => {
        setSelectedCards([]);
    }, [count, deck]);

    const handleCardClick = (card: ReadingCard) => {
        const isAlreadySelected = selectedCards.find(c => c.id === card.id);
        if (isAlreadySelected) {
            setSelectedCards(selectedCards.filter(c => c.id !== card.id));
        } else {
            if (selectedCards.length < count) {
                setSelectedCards([...selectedCards, card]);
            }
        }
    };
    
    const handleSubmit = () => {
        if (selectedCards.length === count) {
            onCardsSelected(selectedCards);
        }
    };

    return (
        <div className="flex flex-col items-center animate-fade-in space-y-6">
            <div className="text-center p-4 bg-gray-900/40 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-cinzel text-yellow-300">Extiende tu mano y elige</h2>
                <p className="text-gray-400 mt-2 text-lg">
                    Selecciona {count} {count > 1 ? 'cartas' : 'carta'} de la baraja.
                </p>
                <p className="text-xl font-bold mt-2 text-white">
                    {selectedCards.length} / {count} seleccionadas
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-4 max-w-7xl">
                {deck.map(card => (
                    <FaceDownCard
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        isSelected={!!selectedCards.find(c => c.id === card.id)}
                    />
                ))}
            </div>
            {selectedCards.length === count && (
                <div className="sticky bottom-4 z-10">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600/90 hover:bg-green-500/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-green-400/50 text-xl animate-pulse-slow"
                    >
                        Consultar al Oráculo
                    </button>
                </div>
            )}
        </div>
    );
};