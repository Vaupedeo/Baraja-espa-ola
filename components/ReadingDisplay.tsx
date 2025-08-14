import React from 'react';
import { ReadingResult, CardInterpretation, ThreeCardReading, Clarification, SingleCardReading } from '../types';
import { CardView } from './CardView';

interface ReadingDisplayProps {
  result: ReadingResult;
  clarifications: Clarification[];
  onClarification: () => void;
  showClarificationButton: boolean;
}

const InterpretationSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="font-cinzel text-lg text-yellow-400 border-b border-yellow-500/30 pb-1 mb-2">{title}</h4>
    <p className="text-gray-300">{children}</p>
  </div>
);

const SingleCardDisplay: React.FC<{ interpretation: CardInterpretation }> = ({ interpretation }) => (
  <>
    <InterpretationSection title="Interpretación General">
      {interpretation.interpretacion_general}
    </InterpretationSection>
    <InterpretationSection title="Simbolismo">
      {interpretation.simbolismo}
    </InterpretationSection>
    <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
            <h4 className="font-cinzel text-lg text-green-400 pb-1 mb-2">Aspectos Positivos</h4>
            <p className="text-gray-300">{interpretation.aspectos_clave.positivo}</p>
        </div>
        <div>
            <h4 className="font-cinzel text-lg text-red-400 pb-1 mb-2">Aspectos Negativos</h4>
            <p className="text-gray-300">{interpretation.aspectos_clave.negativo}</p>
        </div>
    </div>
    <InterpretationSection title="Consejo del Oráculo">
      {interpretation.consejo}
    </InterpretationSection>
  </>
);

export const ReadingDisplay: React.FC<ReadingDisplayProps> = ({ result, clarifications, onClarification, showClarificationButton }) => {
  if (!result) return null;

  return (
    <>
      {/* Main reading display (either 3-card or 1-card) */}
      {'summary' in result ? (
        <div className="space-y-8 animate-fade-in">
          <div className="grid md:grid-cols-3 gap-8 text-center">
              {Object.entries(result).filter(([key]) => ['past', 'present', 'future'].includes(key)).map(([key, value]) => (
                  <div key={key} className="bg-gray-800/50 p-4 rounded-xl shadow-lg border border-yellow-400/20">
                      <h3 className="font-cinzel text-2xl text-yellow-400 capitalize mb-4">{key === 'past' ? 'Pasado' : key === 'present' ? 'Presente' : 'Futuro'}</h3>
                      <CardView card={value.card} />
                      <h4 className="font-bold text-lg mt-4">{value.interpretation.nombre_carta}</h4>
                      <p className="text-sm text-gray-400 mt-2">{value.interpretation.interpretacion_general}</p>
                  </div>
              ))}
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-yellow-400/30">
              <InterpretationSection title="Interpretación Conjunta">{(result as ThreeCardReading).summary}</InterpretationSection>
              <InterpretationSection title="Consejo Final">{(result as ThreeCardReading).advice}</InterpretationSection>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
          <div className="w-full md:w-1/3 text-center flex-shrink-0">
              <CardView card={(result as SingleCardReading).card} />
              <h3 className="font-cinzel text-2xl mt-4">{(result as SingleCardReading).interpretation.nombre_carta}</h3>
          </div>
          <div className="w-full md:w-2/3 bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-yellow-400/30">
              <SingleCardDisplay interpretation={(result as SingleCardReading).interpretation} />
          </div>
        </div>
      )}

      {/* Clarification result display - available for all reading types */}
      {clarifications.length > 0 && (
          <div className="space-y-6 mt-8">
              {clarifications.map((clarif, index) => (
                   <div key={index} className="bg-blue-900/40 p-6 rounded-xl shadow-2xl border border-blue-400/30 mt-8 animate-fade-in">
                       <h3 className="font-cinzel text-2xl text-blue-300 mb-4 text-center">
                           {clarifications.length > 1 ? `Carta Aclaratoria ${index + 1}` : 'Carta Aclaratoria'}
                       </h3>
                       <div className="flex flex-col md:flex-row items-center gap-6">
                           <div className="flex-shrink-0">
                               <CardView card={clarif.card} />
                               <p className="text-center font-bold mt-2">{clarif.card.rank} de {clarif.card.suit}</p>
                           </div>
                           <p className="text-blue-200">{clarif.interpretation}</p>
                       </div>
                   </div>
              ))}
          </div>
      )}

      {/* Clarification button - available for all reading types */}
      {showClarificationButton && (
           <div className="text-center mt-8">
              <button onClick={onClarification} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                  Pedir Carta Aclaratoria
              </button>
          </div>
      )}
    </>
  );
};