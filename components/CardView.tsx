
import React from 'react';
import { ReadingCard } from '../types';
import { OrosIcon, CopasIcon, EspadasIcon, BastosIcon } from './icons/SuitIcons';
import { SotaIcon, CaballoIcon, ReyIcon } from './icons/FigureIcons';

interface CardViewProps {
  card: ReadingCard | { rank: string; suit: string; inverted: boolean; };
}

export const CardView: React.FC<CardViewProps> = ({ card }) => {
  const suitColorClass = () => {
    switch (card.suit) {
      case 'Oros': return 'text-yellow-400';
      case 'Copas': return 'text-red-500';
      case 'Espadas': return 'text-blue-400';
      case 'Bastos': return 'text-green-500';
      default: return 'text-gray-800';
    }
  };
  
  const suitIcon = () => {
    switch (card.suit) {
      case 'Oros': return <OrosIcon className="w-8 h-8 md:w-12 md:h-12" />;
      case 'Copas': return <CopasIcon className="w-8 h-8 md:w-12 md:h-12" />;
      case 'Espadas': return <EspadasIcon className="w-8 h-8 md:w-12 md:h-12" />;
      case 'Bastos': return <BastosIcon className="w-8 h-8 md:w-12 md:h-12" />;
      default: return null;
    }
  };

  const rankDisplay = card.rank.length > 2 ? card.rank.charAt(0) : card.rank;
  const isFaceCard = ['Sota', 'Caballo', 'Rey'].includes(card.rank);

  const renderCenterContent = () => {
      if (isFaceCard) {
          const className = `w-16 h-16 md:w-24 md:h-24 ${suitColorClass()}`;
          switch (card.rank) {
              case 'Sota': return <SotaIcon className={className} />;
              case 'Caballo': return <CaballoIcon className={className} />;
              case 'Rey': return <ReyIcon className={className} />;
              default: return null;
          }
      }
      return <div className={suitColorClass()}>{suitIcon()}</div>;
  };

  return (
    <div className={`
      relative w-32 h-48 md:w-40 md:h-60 mx-auto
      bg-gray-100 dark:bg-gray-200 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-400
      flex flex-col justify-between p-2
      transition-transform duration-500
      ${card.inverted ? 'transform rotate-180' : ''}
    `}>
      <div className={`text-left text-lg md:text-xl font-bold text-gray-800 ${card.inverted ? 'transform rotate-180' : ''}`}>{rankDisplay}</div>
      <div className={`flex justify-center items-center h-full ${card.inverted ? 'transform rotate-180' : ''}`}>
        {renderCenterContent()}
      </div>
      <div className={`text-right text-lg md:text-xl font-bold text-gray-800 transform rotate-180 ${card.inverted ? 'transform rotate-180' : ''}`}>{rankDisplay}</div>
    </div>
  );
};