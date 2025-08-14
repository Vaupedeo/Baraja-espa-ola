import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { CardSelector } from './components/CardSelector';
import { ReadingDisplay } from './components/ReadingDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Chatbot } from './components/Chatbot';
import { DeckPicker, createPickingDeck } from './components/DeckPicker';
import { getCardInterpretation, getThreeCardReading, getClarificationReading, startChatSession } from './services/geminiService';
import { View, Card, ReadingResult, ReadingCard, ThreeCardReading, Clarification, ChatMessage } from './types';

export default function App(): React.ReactNode {
  const [view, setView] = useState<View>(View.Home);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [readingResult, setReadingResult] = useState<ReadingResult>(null);
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  
  const [cardsToPick, setCardsToPick] = useState<number>(0);
  const [pendingReadingType, setPendingReadingType] = useState<'one' | 'three' | 'clarification' | null>(null);

  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  
  const [fullDeck, setFullDeck] = useState<ReadingCard[]>([]);
  const [drawnCardIds, setDrawnCardIds] = useState<Set<string>>(new Set());

  const handleReset = () => {
    setView(View.Home);
    setReadingResult(null);
    setClarifications([]);
    setError(null);
    setChatSession(null);
    setChatHistory([]);
    setIsChatLoading(false);
    setCardsToPick(0);
    setPendingReadingType(null);
    setDrawnCardIds(new Set());
    setFullDeck([]);
  };

  const executeReading = useCallback(async (action: () => Promise<ReadingResult>) => {
    setLoading(true);
    setError(null);
    setClarifications([]);

    try {
      const result = await action();
      setReadingResult(result);
      if (result) {
        setChatSession(null);
        setChatHistory([]);
        const chat = startChatSession(result);
        setChatSession(chat);
        setChatHistory([{ role: 'model', content: '¿Tienes alguna duda sobre tu lectura? El Oráculo te escucha.' }]);
      }
    } catch (err) {
      console.error(err);
      setError('Ha ocurrido un error al contactar al Oráculo. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInterpretCard = useCallback(async (card: Card) => {
    setView(View.SingleCard);
    setDrawnCardIds(new Set());
    setFullDeck([]);
    setReadingResult(null);
    await executeReading(() => getCardInterpretation(card));
  }, [executeReading]);

  const startDeckPicking = useCallback((count: number, type: 'one' | 'three') => {
    const newDeck = createPickingDeck();
    setFullDeck(newDeck);
    setDrawnCardIds(new Set());
    setReadingResult(null);
    setClarifications([]);
    setView(View.DeckPicking);
    setCardsToPick(count);
    setPendingReadingType(type);
  }, []);

  const handleRequestClarification = useCallback(() => {
    if (!readingResult || fullDeck.length - drawnCardIds.size === 0) return;
    setView(View.DeckPicking);
    setCardsToPick(1);
    setPendingReadingType('clarification');
  }, [readingResult, fullDeck, drawnCardIds]);

  const handleDeckPickingComplete = useCallback(async (cards: ReadingCard[], type: typeof pendingReadingType) => {
    if (!type) return;

    setPendingReadingType(null);
    setCardsToPick(0);
    setDrawnCardIds(prev => new Set([...prev, ...cards.map(c => c.id)]));

    if (type === 'one') {
      setView(View.OneCardDraw);
      await executeReading(() => getCardInterpretation(cards[0]));
    } else if (type === 'three') {
      setView(View.ThreeCardSpread);
      const [past, present, future] = cards;
      await executeReading(() => getThreeCardReading(past, present, future));
    } else if (type === 'clarification') {
      if (!readingResult || cards.length < 1) return;

      const [clarificationCard] = cards;
      setLoading(true);
      setError(null);
      
      if ('summary' in readingResult) {
        setView(View.ThreeCardSpread);
      } else {
        setView(View.OneCardDraw);
      }

      try {
        const interpretation = await getClarificationReading(readingResult, clarifications, clarificationCard);
        setClarifications(prev => [...prev, { card: clarificationCard, interpretation }]);
      } catch (err) {
        console.error(err);
        setError('No se pudo obtener una aclaración. El Oráculo está en silencio por ahora.');
      } finally {
        setLoading(false);
      }
    }
  }, [readingResult, executeReading, clarifications]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession || !message.trim() || isChatLoading) return;

    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setIsChatLoading(true);

    try {
        const response = await chatSession.sendMessage({ message });
        setChatHistory(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (err) {
        console.error("Chat error:", err);
        setChatHistory(prev => [...prev, { role: 'model', content: 'El Oráculo parece tener dificultades para comunicarse en este momento. Inténtalo de nuevo más tarde.' }]);
    } finally {
        setIsChatLoading(false);
    }
  }, [chatSession, isChatLoading]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (view === View.DeckPicking) {
      const availableDeck = fullDeck.filter(card => !drawnCardIds.has(card.id));
      return <DeckPicker count={cardsToPick} deck={availableDeck} onCardsSelected={(cards) => handleDeckPickingComplete(cards, pendingReadingType)} />;
    }
    if (error) {
      return <p className="text-red-400 text-center animate-fade-in">{error}</p>;
    }
    if (readingResult) {
      const isReadingView = [View.OneCardDraw, View.ThreeCardSpread].includes(view);
      const canClarify = isReadingView && (fullDeck.length > 0 && fullDeck.length - drawnCardIds.size > 0);
      return (
        <div className="animate-fade-in">
          <ReadingDisplay 
            result={readingResult} 
            clarifications={clarifications}
            onClarification={handleRequestClarification}
            showClarificationButton={canClarify}
          />
          {chatSession && (
             <Chatbot
                history={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
             />
          )}
        </div>
      );
    }
    return <CardSelector onInterpret={handleInterpretCard} />;
  };

  return (
    <div className="min-h-screen bg-[#3c1642] text-gray-200">
      <header className="p-4 text-center border-b border-yellow-500/30">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 font-cinzel tracking-wider cursor-pointer" onClick={handleReset}>
          Lector de Baraja Española
        </h1>
        <p className="text-gray-400 mt-2">El Oráculo Digital a tu servicio</p>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {view === View.Home ? (
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-cinzel text-center">¿Cómo puedo ayudarte hoy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <button onClick={() => setView(View.SingleCard)} className="bg-yellow-600/80 hover:bg-yellow-500/80 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-yellow-400/50">
                Interpretar una Carta
              </button>
              <button onClick={() => startDeckPicking(1, 'one')} className="bg-purple-600/80 hover:bg-purple-500/80 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-purple-400/50">
                Tirada Rápida (1 Carta)
              </button>
              <button onClick={() => startDeckPicking(3, 'three')} className="bg-blue-600/80 hover:bg-blue-500/80 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-blue-400/50">
                Pasado, Presente, Futuro
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button onClick={handleReset} className="mb-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              &larr; Volver al Inicio
            </button>
            <div className="w-full max-w-6xl">
              {renderContent()}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm border-t border-yellow-500/30">
          Interpretaciones generadas por IA de 315-Mónada.
      </footer>
    </div>
  );
}