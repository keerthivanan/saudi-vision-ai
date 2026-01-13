'use client';

import { Users, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function Pillars() {
    const { t } = useLanguage();

    const pillars = [
        {
            id: 'society',
            title: t('Pillar1Title'),
            description: t('Pillar1Desc'),
            icon: Users,
            color: 'emerald-saudi',
            // Reliable: "Group of friends" / Community (High traffic ID)
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80',
        },
        {
            id: 'economy',
            title: t('Pillar2Title'),
            description: t('Pillar2Desc'),
            icon: TrendingUp,
            color: 'gold-saudi',
            // Reliable: Business / Skyscraper (High traffic ID)
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
        },
        {
            id: 'nation',
            title: t('Pillar3Title'),
            description: t('Pillar3Desc'),
            icon: Building2,
            color: 'midnight-blue',
            // Reliable: Historical Architecture (High traffic ID) - PROVEN REPLACEMENT
            image: 'https://images.unsplash.com/photo-1552556755-27a964952044?auto=format&fit=crop&q=80',
        },
    ];

    return (
        <section id="pillars" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('PillarsTitle')}
                    </h2>
                    <div className="w-24 h-1 bg-gold-saudi mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:border-emerald-saudi/20 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Image Header */}
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <Image
                                    src={pillar.image}
                                    alt={pillar.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-6 rtl:left-auto rtl:right-6 z-20 flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-${pillar.color === 'gold-saudi' ? 'yellow-600' : pillar.color === 'emerald-saudi' ? 'emerald-700' : 'slate-800'}`}>
                                        <pillar.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white shadow-sm">{pillar.title}</h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                                    {pillar.description}
                                </p>

                                <button onClick={() => window.location.href = '#chat'} className={`w-full py-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 group-hover:gap-4
                  ${pillar.color === 'emerald-saudi'
                                        ? 'border-emerald-saudi text-emerald-saudi hover:bg-emerald-saudi hover:text-white'
                                        : pillar.color === 'gold-saudi'
                                            ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white'
                                            : 'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white'
                                    }`}>
                                    {t('LearnMore')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
