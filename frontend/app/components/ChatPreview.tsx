'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, Paperclip, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../context/LanguageContext';

type Message = {
    role: 'user' | 'ai';
    content: string;
};

export default function ChatPreview() {
    const { data: session } = useSession();
    const { t, language } = useLanguage();

    // Initialize messages based on current language
    const [messages, setMessages] = useState<Message[]>([
        { role: 'user', content: t('InitialUserMsg') },
        { role: 'ai', content: t('InitialAIMsg') }
    ]);

    // Reset messages when language changes (optional, but good for demo)
    useEffect(() => {
        setMessages([
            { role: 'user', content: t('InitialUserMsg') },
            { role: 'ai', content: t('InitialAIMsg') }
        ]);
    }, [language, t]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            // If not logged in, we might want to redirect or show a warning.
            // But for "Preview" on landing page, maybe we allow guest or mock it?
            // For now, let's try to hit the endpoint. If it requires auth, it might 401.
            // The user asked "is all pages connected". 
            // If endpoint requires Authed User, we need a session.

            const response = await fetch('/api/v1/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If using manual token, but NextAuth uses cookies usually
                },
                body: JSON.stringify({
                    message: userMsg,
                    // conversation_id: ... // Optional, backend creates new if missing
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setMessages(prev => [...prev, { role: 'ai', content: "Please Sign In to access the Intelligent Q&A Assistant." }]);
                    setIsLoading(false);
                    return;
                }
                throw new Error('Network response was not ok');
            }

            // Streaming logic
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiResponseContent = "";

            setMessages(prev => [...prev, { role: 'ai', content: "" }]); // Placeholder

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '').trim();
                            if (dataStr === '[DONE]') break;

                            try {
                                const data = JSON.parse(dataStr);
                                if (data.event === 'token') {
                                    aiResponseContent += data.data;
                                    // Update the last message
                                    setMessages(prev => {
                                        const newMsgs = [...prev];
                                        const lastIndex = newMsgs.length - 1;
                                        if (lastIndex >= 0) {
                                            const msg = newMsgs[lastIndex]!;
                                            newMsgs[lastIndex] = {
                                                role: msg.role,
                                                content: aiResponseContent
                                            };
                                        }
                                        return newMsgs;
                                    });
                                }
                            } catch (e) {
                                console.error("Error parsing stream:", e);
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I'm having trouble connecting to the Vision 2030 network right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="chat" className="py-24 bg-white relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-gold-saudi" />
                        <span className="text-emerald-saudi font-bold tracking-widest text-sm uppercase">{t('ChatPreSubtitle')}</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900">
                        {t('ChatPreTitle')}
                    </h2>
                </div>

                {/* Chat Interface Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-white rounded-[2rem] shadow-[0_32px_64px_rgba(0,108,53,0.08)] border border-slate-100 overflow-hidden"
                >
                    {/* Authentication Lock Overlay */}
                    {!session && (
                        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#0B1224] p-8 rounded-3xl text-center max-w-md shadow-2xl border border-white/10"
                            >
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-serif">{t('AuthRequired')}</h3>
                                <p className="text-slate-400 mb-8">{t('AuthDesc')}</p>

                                <div className="flex flex-col gap-3">
                                    <a
                                        href="/auth/signin"
                                        className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20"
                                    >
                                        {t('SignInAccess')}
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Chat Body */}
                    <div className={`p-8 md:p-12 min-h-[500px] max-h-[600px] overflow-y-auto flex flex-col bg-gradient-to-b from-slate-50/50 to-white ${!session ? 'blur-sm' : ''}`}>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full mb-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-12 h-12 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center border-2 border-gold-saudi mr-4 rtl:mr-0 rtl:ml-4 mb-auto">
                                        <span className="font-serif font-bold text-white text-xs text-center leading-none">V<br />2030</span>
                                    </div>
                                )}

                                <div className={`max-w-xl px-8 py-6 rounded-2xl text-lg leading-relaxed shadow-sm
                            ${msg.role === 'user'
                                        ? 'bg-emerald-saudi text-white rounded-tr-sm shadow-emerald-saudi/10 rtl:rounded-tr-2xl rtl:rounded-tl-sm'
                                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* ... existing loading ... */}
                        {isLoading && (
                            <div className="flex justify-start w-full mb-8">
                                <div className="w-12 h-12 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center border-2 border-gold-saudi mr-4 rtl:mr-0 rtl:ml-4">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="bg-slate-50 border border-slate-200 px-8 py-6 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-slate-500 rtl:rounded-tl-2xl rtl:rounded-tr-sm">
                                    <Loader2 className="w-5 h-5 animate-spin" /> {t('Analyzing')}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`border-t border-slate-100 p-6 md:p-8 bg-white ${!session ? 'blur-sm pointer-events-none' : ''}`}>
                        <form onSubmit={handleSubmit} className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-emerald-saudi/20">
                            <button type="button" className="p-4 text-slate-400 hover:text-emerald-saudi transition-colors">
                                <Paperclip size={24} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={session ? t('ChatPlaceholder') : t('GuestPlaceholder')}
                                disabled={isLoading || !session}
                                className="flex-1 py-4 text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-400 text-slate-800 disabled:opacity-50"
                            />
                            <div className="flex items-center gap-2 pr-2">
                                <button type="button" className="p-3 text-slate-400 hover:text-emerald-saudi transition-colors">
                                    <Mic size={24} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim() || !session}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-gold-saudi to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-gold-saudi/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send size={20} className="ml-1" />
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
