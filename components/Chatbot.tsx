import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import Spinner from './Spinner';
import SendIcon from './icons/SendIcon';

const API_BASE_URL = "http://localhost:9087";

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: 'Hello! I am the Plant Doctor Assistant. Ask me about a plant disease by typing its name below.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: inputValue.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/chatbot_disease_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ disease_name: userMessage.text }),
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.chatbot_message) {
                throw new Error("Received an invalid response from the server.");
            }

            const botMessage: ChatMessage = { sender: 'bot', text: data.chatbot_message };
            setMessages(prev => [...prev, botMessage]);

        } catch (err: any) {
            const errorMessage = err.message || 'Failed to get information. Please ensure the server is running.';
            setError(errorMessage);
            setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, I ran into an error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const FormattedMessage: React.FC<{ text: string, isBot: boolean }> = ({ text, isBot }) => {
        const textColor = isBot ? 'text-gray-700' : 'text-white';
        const boldColor = isBot ? 'text-gray-900' : 'text-white';

        return (
            <div className={`${textColor} space-y-2`}>
                {text.split('\n').map((line, index) => {
                    const lineParts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                        <p key={index} className="whitespace-pre-wrap">
                            {lineParts.map((part, i) =>
                                part.startsWith('**') && part.endsWith('**') ?
                                <strong key={i} className={`${boldColor} font-semibold`}>{part.slice(2, -2)}</strong> :
                                part
                            )}
                        </p>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl shadow-xl backdrop-blur-sm">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <BotIcon />}
                            <div className={`max-w-xl p-4 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-br from-[var(--primary-accent)] to-[var(--secondary-accent)] text-white rounded-br-none' : 'bg-white/60 text-gray-800 rounded-bl-none backdrop-blur-sm border border-white/20'}`}>
                                <FormattedMessage text={msg.text} isBot={msg.sender === 'bot'} />
                            </div>
                            {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4">
                            <BotIcon />
                            <div className="max-w-md p-4 rounded-2xl bg-white/60 rounded-bl-none">
                                <div className="flex items-center">
                                    <Spinner />
                                    <span className="ml-3 text-gray-500">The assistant is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-[var(--border-color)] bg-white/50 rounded-b-xl">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="e.g., 'maize stem borer'"
                        className="w-full pl-4 pr-14 py-3 bg-gray-100 border border-transparent rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/80 transition-shadow"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-br from-[var(--secondary-accent)] to-[var(--tertiary-accent)] rounded-full text-white hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;