import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatbotProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ history, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <h3 className="font-cinzel text-xl text-yellow-300 text-center mb-4">Conversa con el Oráculo</h3>
            <div className="bg-gray-800/60 rounded-xl shadow-2xl border border-yellow-400/30 overflow-hidden">
                <div className="p-4 h-80 overflow-y-auto space-y-4">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-blue-800/80 text-white rounded-br-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md bg-gray-700/80 text-gray-200 rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50 flex items-center gap-4 bg-gray-900/50">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        disabled={isLoading}
                        className="flex-grow p-2 bg-gray-700/50 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-white disabled:opacity-50 transition-colors"
                        aria-label="Chat input"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()} 
                        className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.534h6.105a.75.75 0 000-1.5H4.99l-1.05-3.674a.25.25 0 01.275-.317l14.42 3.204a.25.25 0 010 .472l-14.42 3.204a.25.25 0 01-.275-.317l1.05-3.674h1.109a.75.75 0 000-1.5H4.032a.75.75 0 00-.95.534L1.668 16.76a.75.75 0 00.826.95l16-3.556a.75.75 0 000-1.308l-16-3.556z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}