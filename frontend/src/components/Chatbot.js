import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// ==========================================================
// SVG ICONS COMPONENTS
// ==========================================================

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 015.69 3.117L12 21.75l-5.69-6.633z" clipRule="evenodd" />
        <path d="M4.155 5.923a.75.75 0 01.218-.086A11.2 11.2 0 0112 4.5c4.24 0 8.02.23 11.242 1.337a.75.75 0 01.218.086c.26.1.428.368.428.663v3.161c0 .32-.182.61-.47.746A12.72 12.72 0 0112 10.5c-4.135 0-7.854.396-11.08.977a.75.75 0 01-.47-.746V6.586c0-.295.167-.563.428-.663z" />
    </svg>
);

const LoadingDots = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

// ==========================================================
// MAIN CHATBOT COMPONENT
// ==========================================================

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Halo! Saya asisten AI. Tanyakan apa saja tentang dokumen di KMS ini.',
            sources: []
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = newMessage.trim();
        
        if (!query || isLoading) return;

        // Add user message to UI
        setMessages(prev => [...prev, { sender: 'user', text: query }]);
        setNewMessage('');
        setIsLoading(true);

        try {
            console.log('🔄 Sending query to AI...');
            const { data } = await api.post('/ai/chat', { query });
            
            if (data.success) {
                setMessages(prev => [
                    ...prev,
                    { 
                        sender: 'ai', 
                        text: data.answer, 
                        sources: data.sources || [] 
                    }
                ]);
            } else {
                throw new Error(data.message || 'Failed to get AI response');
            }

        } catch (error) {
            console.error('❌ Error fetching AI response:', error);
            
            let errorText = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
            
            if (error.response?.data?.message) {
                errorText = error.response.data.message;
            } else if (error.message) {
                errorText = error.message;
            }

            setMessages(prev => [
                ...prev,
                { 
                    sender: 'system', 
                    text: `❌ ${errorText}` 
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                sender: 'ai',
                text: 'Halo! Saya asisten AI. Tanyakan apa saja tentang dokumen di KMS ini.',
                sources: []
            }
        ]);
    };

    const getMessageStyles = (sender) => {
        const baseStyles = "p-3 rounded-lg max-w-[85%] text-sm whitespace-pre-wrap";
        
        switch (sender) {
            case 'user':
                return `${baseStyles} bg-cyan-500 text-white`;
            case 'ai':
                return `${baseStyles} bg-white text-gray-800 shadow-sm border border-gray-200`;
            case 'system':
                return `${baseStyles} bg-red-100 text-red-700 border border-red-200`;
            default:
                return `${baseStyles} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[500px] rounded-lg shadow-xl flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="bg-cyan-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <RobotIcon />
                            <h3 className="font-semibold text-lg">AI Assistant</h3>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={clearChat}
                                className="text-xs bg-cyan-700 px-2 py-1 rounded hover:bg-cyan-800 transition-colors"
                                title="Clear chat history"
                            >
                                Clear
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-cyan-200 transition-colors"
                                title="Close chat"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div 
                        ref={chatBodyRef} 
                        className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
                    >
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* AI Avatar */}
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                                        <RobotIcon />
                                    </div>
                                )}
                                
                                {/* Message Bubble */}
                                <div className={getMessageStyles(msg.sender)}>
                                    <p>{msg.text}</p>
                                    
                                    {/* Sources */}
                                    {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <h4 className="text-xs font-semibold text-gray-500 mb-1">Sumber Referensi:</h4>
                                            <div className="flex flex-col space-y-1">
                                                {msg.sources.map((source) => (
                                                    <Link
                                                        key={source._id}
                                                        to={`/documents/${source._id}`}
                                                        className="text-xs text-cyan-600 hover:underline truncate"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        📄 {source.title} ({source.score}% relevan)
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                                    <RobotIcon />
                                </div>
                                <div className="p-3 rounded-lg bg-white text-gray-500 shadow-sm border border-gray-200">
                                    <LoadingDots />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form 
                        onSubmit={handleSubmit} 
                        className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Ketik pertanyaan Anda..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-cyan-600 text-white p-2 rounded-full hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                disabled={isLoading || !newMessage.trim()}
                                title="Send message"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-cyan-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform ${
                    isOpen ? 'rotate-90' : 'hover:scale-110'
                } hover:bg-cyan-700`}
                title={isOpen ? "Tutup Chat" : "Buka AI Assistant"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
};

export default Chatbot;