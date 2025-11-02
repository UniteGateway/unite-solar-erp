import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, GeneratedReport } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { getAiChatResponse } from '../services/geminiService';

interface AiAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    reportContext: GeneratedReport | null;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, reportContext }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const clientName = reportContext?.formData.companyName || "your project";
            setMessages([{ sender: 'ai', text: `Hello! I'm your Unite Solar AI Assistant. How can I help you with the report for ${clientName}?` }]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, reportContext]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const history = newMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
                parts: [{ text: msg.text }]
            }));
            
            const aiResponseText = await getAiChatResponse(history, reportContext ? reportContext.reportData : null);
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }
    
    return (
        <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div 
                className={`fixed top-0 right-0 h-full bg-card dark:bg-solar-gray w-full max-w-md flex flex-col shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border dark:border-charcoal-gray flex-shrink-0">
                    <h3 className="text-xl font-bold text-primary dark:text-solar-gold font-display">AI Assistant</h3>
                    <button onClick={onClose} className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white text-3xl leading-none">&times;</button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'flex-row'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 bg-accent dark:bg-deep-green rounded-full flex-shrink-0 text-center font-bold flex items-center justify-center text-accent-foreground dark:text-white">AI</div>}
                            <div className={`max-w-xs md:max-w-sm rounded-lg p-3 shadow-md ${msg.sender === 'user' ? 'bg-primary dark:bg-solar-gold text-primary-foreground dark:text-solar-black rounded-br-none' : 'bg-secondary dark:bg-charcoal-gray text-secondary-foreground dark:text-white rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-accent dark:bg-deep-green rounded-full flex-shrink-0 text-center font-bold flex items-center justify-center text-accent-foreground dark:text-white">AI</div>
                            <div className="max-w-xs md:max-w-sm rounded-lg p-3 bg-secondary dark:bg-charcoal-gray text-secondary-foreground dark:text-white rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div style={{animationDelay: '0s'}} className="w-2 h-2 bg-muted-foreground dark:bg-gray-400 rounded-full animate-pulse"></div>
                                    <div style={{animationDelay: '0.2s'}} className="w-2 h-2 bg-muted-foreground dark:bg-gray-400 rounded-full animate-pulse"></div>
                                    <div style={{animationDelay: '0.4s'}} className="w-2 h-2 bg-muted-foreground dark:bg-gray-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border dark:border-charcoal-gray bg-background dark:bg-solar-black flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about this report..."
                            className="flex-1 w-full bg-secondary dark:bg-charcoal-gray border border-border dark:border-gray-600 rounded-lg p-2.5 text-foreground dark:text-white focus:ring-2 focus:ring-ring focus:border-ring transition"
                            disabled={isLoading}
                        />
                         <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-2.5 bg-primary dark:bg-solar-gold rounded-lg text-primary-foreground dark:text-solar-black disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105">
                            <PaperAirplaneIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
