'use client';

import { useState } from 'react';
import { Search, Mic, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');

    const suggestions = [
        t('Suggestion1'),
        t('Suggestion2'),
        t('Suggestion3')
    ];

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
            };
            recognition.start();
        } else {
            alert("Voice search not supported in this browser.");
        }
    };

    return (
        <section className="relative min-h-[800px] flex flex-col items-center justify-center overflow-hidden bg-midnight-blue pt-20">
            {/* Background Gradients & Patterns */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue via-[#0A1628] to-emerald-saudi/40" />
                {/* Abstract "Dunes" or "Arabesque" pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-saudi/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-saudi/10 rounded-full blur-[100px] -ml-40 -mb-40" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">

                {/* Headlines */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-gold-saudi" />
                        <span className="text-sm font-medium text-white/90 tracking-wide">{t('HeroTagline')}</span>
                    </div>

                    <h1 className="font-sans text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                        {t('HeroTitle1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">{t('HeroTitle2')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-200/90 font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
                        {t('HeroSubtitle')}
                    </p>
                </motion.div>

                {/* Enhanced RAG Search Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative max-w-3xl mx-auto"
                >
                    {/* Main Search Card */}
                    <div className="bg-white rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 backdrop-blur-sm relative overflow-visible z-20 transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="relative flex items-center">
                            <Search className="absolute left-6 w-6 h-6 text-emerald-saudi opacity-50 rtl:right-6 rtl:left-auto" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('SearchPlaceholder')}
                                onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/chat?q=${encodeURIComponent(query)}`)}
                                className="w-full text-lg md:text-xl py-6 pl-16 pr-32 rtl:pr-16 rtl:pl-32 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 font-medium"
                            />
                            <div className="absolute right-4 rtl:right-auto rtl:left-4 flex items-center gap-3">
                                <button onClick={startListening} className="p-2.5 rounded-full hover:bg-slate-100 text-emerald-saudi transition-colors group" title="Voice Search">
                                    <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                <a
                                    href={`/chat?q=${encodeURIComponent(query)}`}
                                    className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-saudi to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-emerald-saudi/30"
                                >
                                    {t('Explore')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                                </a>
                                <a
                                    href={`/chat?q=${encodeURIComponent(query)}`}
                                    className="md:hidden p-3.5 bg-emerald-saudi text-white rounded-xl"
                                >
                                    <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Prompt Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <span className="text-sm font-medium text-white/60 mr-2">{t('TryAsking')}</span>
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setQuery(suggestion);
                                    window.location.href = `/chat?q=${encodeURIComponent(suggestion)}`;
                                }}
                                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-emerald-saudi/30 text-emerald-100 text-sm font-medium backdrop-blur-md transition-all hover:scale-105"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Decorative Silhouette Elements (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-80 z-10 pointer-events-none opacity-40 bg-[url('https://images.unsplash.com/photo-1596627702842-8c464b0f92d4?auto=format&fit=crop&q=80')] bg-cover bg-bottom mix-blend-luminosity brightness-0 invert translate-y-16" />
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-midnight-blue to-transparent z-10" />
        </section>
    );
}
