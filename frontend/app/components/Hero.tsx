'use client';

import { useState } from 'react';
import { Search, Mic, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Hero() {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState('');

    const suggestions = [
        t('Suggestion1'),
        t('Suggestion2'),
        t('Suggestion3')
    ];

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

            toast.loading(language === 'ar' ? 'جاري الاستماع...' : 'Listening...', { duration: 2000 });

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                toast.success(`Heard: "${transcript}"`);
            };
            recognition.onerror = () => {
                toast.error('Voice input failed. Please try again.');
            };
            recognition.start();
        } else {
            toast.error('Voice search not supported in this browser. Please use Chrome.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-secondary to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

            {/* Background Grid Pattern (Code Wiki style) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-saudi/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">

                {/* Vision 2030 Logo (Official High-Res) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center justify-center">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Saudi_Vision_2030_logo.svg/800px-Saudi_Vision_2030_logo.svg.png"
                            alt="Saudi Vision 2030"
                            width={600}
                            height={400}
                            className="h-32 md:h-48 w-auto brightness-0 invert drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                            unoptimized
                        />
                    </div>
                </motion.div>

                {/* Headlines */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-saudi/10 border border-emerald-saudi/20 mb-8 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-emerald-bright" />
                        <span className="text-sm font-medium text-emerald-bright tracking-wide">{t('HeroTagline')}</span>
                    </div>

                    <h1 className="font-sans text-5xl md:text-7xl font-extrabold text-foreground dark:text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                        {t('HeroTitle1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-bright to-emerald-saudi">{t('HeroTitle2')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground dark:text-slate-300 font-medium max-w-3xl mx-auto mb-20 leading-relaxed">
                        {t('HeroSubtitle')}
                    </p>
                </motion.div>

                {/* Search Card - Dark Glassmorphism with Emerald Glow */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-3xl mx-auto mb-12"
                >
                    <div className="bg-card/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-border dark:border-slate-800 
                        focus-within:border-emerald-saudi focus-within:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
                        <div className="flex items-center gap-3 bg-secondary dark:bg-black/50 rounded-xl px-4 py-3">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && query.trim() && (window.location.href = `/chat?q=${encodeURIComponent(query)}`)}
                                placeholder={t('SearchPlaceholder')}
                                className="flex-1 bg-transparent border-none outline-none text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-400 text-base"
                            />
                            <button
                                onClick={startListening}
                                className="p-2 hover:bg-emerald-saudi/10 rounded-lg text-slate-400 hover:text-emerald-bright transition-colors"
                                title="Voice Search"
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => query.trim() && (window.location.href = `/chat?q=${encodeURIComponent(query)}`)}
                                disabled={!query.trim()}
                                className="px-5 py-2 bg-emerald-saudi text-white rounded-lg hover:bg-emerald-bright disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-emerald-saudi/50"
                            >
                                {t('Explore')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Prompt Suggestions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center"
                >
                    <p className="text-sm text-slate-400 mb-4 font-medium">{t('TryAsking')}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[t('Suggestion1'), t('Suggestion2'), t('Suggestion3')].map((suggestion, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    window.location.href = `/chat?q=${encodeURIComponent(suggestion)}`;
                                }}
                                className="px-4 py-2 bg-secondary dark:bg-black/50 border border-border dark:border-slate-700 rounded-full text-sm text-muted-foreground dark:text-slate-300 
                                    hover:bg-emerald-saudi/10 hover:border-emerald-saudi hover:text-emerald-bright transition-all backdrop-blur-sm"
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ANIMATED 8K RIYADH SKYLINE - Premium Cinematic Background */}
            <div className="absolute bottom-0 left-0 right-0 h-full w-full z-0 pointer-events-none overflow-hidden">
                {/* Ken Burns Animated Background - Slow Zoom Effect */}
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* 8K Quality Riyadh KAFD Night Skyline */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=100&w=3840&auto=format&fit=crop')`,
                        }}
                    />
                </motion.div>

                {/* Breathing Glow Overlay */}
                <motion.div
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-emerald-saudi/10 mix-blend-overlay"
                />

                {/* Premium Gradient Overlays for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-slate-950 via-background/80 dark:via-slate-950/80 to-background/40 dark:to-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/90 dark:from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/50 dark:from-slate-950/50 via-transparent to-background/50 dark:to-slate-950/50" />
            </div>
        </div>
    );
}
