"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: '**Welcome to the AI Club booth!** 🤖\n\nI\'m **Chip**, your AI Club Assistant! I\'m here to help you discover amazing things. Ask me about joining, upcoming events, today\'s demos (like the Image Generator), or how we learn by building real projects.\n\n- **Why join?** Community, workshops, mentorship, and portfolio-ready projects.\n- **Get involved:** Ask for meeting times, sign-up link, or ways to contribute.\n\nWhat can I tell you about our club? 🌟',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    const CHAT_SUGGESTIONS = [
        "What projects do you build at the AI Club?",
        "When and where are the meetings?",
        "How can I join or sign up?",
        "What demos are running today?",
        "Tell me an interesting AI fact",
        "How does AI image generation work?",
        "What skills will I learn in the club?",
        "Can beginners join the AI Club?",
    ];

    const MOBILE_SUGGESTIONS = [
        "Join Club",
        "Meeting Times",
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { 
            role: 'user', 
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await response.json();
            if (response.ok) {
                const assistantMessage = { 
                    role: 'assistant', 
                    content: data.reply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error || "An error occurred.");
            }

        } catch (error) {
            const errorMessage = { 
                role: 'assistant', 
                content: `⚠️ **Error**: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const MarkdownComponents = {
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            return !inline && match ? (
                <div className="my-4 rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <div className="bg-gray-800 px-4 py-2 text-sm text-gray-100 font-medium flex items-center justify-between">
                        <span>{language}</span>
                        <button
                            onClick={() => navigator.clipboard?.writeText(String(children))}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                            title="Copy code"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                <path d="M6 3a2 2 0 00-2 2v6h.5a.5.5 0 01.5.5v.5h1.5a.5.5 0 01.5.5v.5H9a1 1 0 102 0v-.5a.5.5 0 01.5-.5H13v-.5a.5.5 0 01.5-.5H14V5a2 2 0 00-2-2H6z"/>
                                <path d="M5.5 12H4v4a2 2 0 002 2h8a2 2 0 002-2v-4h-1.5a.5.5 0 00-.5.5v.5h-2a.5.5 0 00-.5.5v.5h-3v-.5a.5.5 0 00-.5-.5h-2v-.5a.5.5 0 00-.5-.5z"/>
                            </svg>
                        </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-relaxed">
                        <code className="font-mono" {...props}>
                            {String(children).replace(/\n$/, '')}
                        </code>
                    </pre>
                </div>
            ) : (
                <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            );
        },
        h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-gray-800 last:mb-0">
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-3 space-y-1">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-3 space-y-1">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-gray-800 leading-relaxed">
                {children}
            </li>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className="italic text-gray-800">
                {children}
            </em>
        ),
        a: ({ href, children }) => (
            <a 
                href={href} 
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => (
            <th className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border-b border-gray-200 px-4 py-2 text-gray-800">
                {children}
            </td>
        ),
    };

	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col h-[85vh] max-h-[800px] rounded-3xl overflow-hidden border border-gray-200 bg-white/95 backdrop-blur text-gray-900">
			{/* Header - match image page panel title */}
            <div className="px-3 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-gray-200">
				<h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-900">
					<span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px]" />
					Chip - AI Club Assistant
				</h2>
				<p className="text-gray-600 text-xs sm:text-sm mt-1">Ask anything. Clean, readable answers.</p>
                {/* Desktop suggestions */}
                <div className="mt-3 hidden sm:flex flex-wrap gap-2">
                    {CHAT_SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            className="px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition text-sm"
                            title="Use this prompt"
                            onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                        >
                            {s} 
                        </button>
                    ))}
                </div>
            </div>
			
			{/* Chat Area */}
			<div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col max-w-[90%] ${
                            msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                    >
                        <div className={`relative p-4 rounded-3xl transition-all ${
                            msg.role === 'user'
                                ? 'rounded-br-lg border border-blue-200 bg-blue-50 text-gray-900'
                                : 'rounded-bl-lg border border-gray-200 bg-white text-gray-900 shadow-sm'
                        }`}> 
                            {/* Message indicator */}
                            <div className={`absolute top-2 ${
                                msg.role === 'user' ? 'right-2' : 'left-2'
                            }`}>
								<div className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${
									msg.role === 'user' ? 'bg-blue-500' : 'bg-emerald-500'
								}`}></div>
                            </div>

                            {/* Message content */}
                            <div className={`mt-2 ${
                                'prose prose-gray prose-sm max-w-none text-gray-900'
                            }`}>
                                <ReactMarkdown components={MarkdownComponents}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                        
                        {/* Timestamp */}
                        <div className={`flex items-center gap-2 mt-2 px-2 ${
                            msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}> 
							<span className={`text-xs font-medium ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-500'}`}> 
                                {msg.timestamp}
                            </span>
							<span className={`w-1 h-1 rounded-full shadow-[0_0_6px] ${
								msg.role === 'user' ? 'bg-blue-400' : 'bg-emerald-400'
							}`}></span>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="self-start flex items-center gap-3">
                        <div className="p-4 rounded-3xl rounded-bl-lg border border-gray-200 bg-white shadow-sm text-gray-900">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2.5 w-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                </div>
                                <span className="text-sm text-gray-600 ml-2">AI is typing...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

			{/* Input Area */}
			<div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                <div className="space-y-2">
                    <div className="flex items-end gap-2 sm:gap-3 rounded-2xl p-2.5 sm:p-3 border border-gray-300 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <div className="flex-1">
                            <input
                                type="text"
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message here..."
                                className="w-full bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500 text-sm py-2 px-2 resize-none"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="rounded-full p-2.5 sm:p-3 text-white bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    
                    {/* Mobile suggestions - below input */}
                    <div className="flex gap-2 sm:hidden">
                        {MOBILE_SUGGESTIONS.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                className="px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition text-xs"
                                title="Use this prompt"
                                onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                            >
                                {s} 
                            </button>
                        ))}
                    </div>
                </div>
				<p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
                    Press Enter to send • Supports Markdown formatting
                </p>
            </div>
        </div>
    );
};

export default Chatbot;