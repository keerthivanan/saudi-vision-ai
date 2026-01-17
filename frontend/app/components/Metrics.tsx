'use client';

import { TrendingUp, Wallet, Users2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Metrics() {
    const { t } = useLanguage();

    const metrics = [
        { label: t('MetricLabel1'), value: '65%', sub: t('MetricSub1'), icon: Wallet },
        { label: t('MetricLabel2'), value: '500B', sub: t('MetricSub2'), icon: TrendingUp },
        { label: t('MetricLabel3'), value: '1M+', sub: t('MetricSub3'), icon: Users2 },
        { label: t('MetricLabel4'), value: '50%', sub: t('MetricSub4'), icon: Zap },
    ];

    return (
        <section id="metrics" className="py-24 bg-primary dark:bg-midnight-blue relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-sans text-4xl md:text-5xl font-bold text-primary-foreground dark:text-white mb-6">
                        {t('MetricsTitle')}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        {t('MetricsSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm relative group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-saudi to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-gold-saudi group-hover:bg-gold-saudi group-hover:text-midnight-blue transition-colors duration-300">
                                <metric.icon size={32} />
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-5xl font-black text-white tracking-tight"
                                >
                                    {metric.value}
                                </motion.span>
                            </div>

                            <h3 className="text-lg font-bold text-emerald-400 mb-1">{metric.label}</h3>
                            <p className="text-slate-400 text-sm">{metric.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
