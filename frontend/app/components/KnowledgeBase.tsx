'use client';

import { FileText, Users, Building, Cpu, Leaf, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function KnowledgeBase() {
    const { t } = useLanguage();

    const categories = [
        { title: t('Cat1'), count: `124 ${t('DocumentsCount')}`, icon: FileText },
        { title: t('Cat2'), count: `85 ${t('DocumentsCount')}`, icon: Users },
        { title: t('Cat3'), count: `56 ${t('DocumentsCount')}`, icon: Building },
        { title: t('Cat4'), count: `200+ ${t('DocumentsCount')}`, icon: Cpu },
        { title: t('Cat5'), count: `42 ${t('DocumentsCount')}`, icon: Leaf },
        { title: t('Cat6'), count: `38 ${t('DocumentsCount')}`, icon: Landmark },
    ];

    return (
        <section id="resources" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('KBTitle')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('KBSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <div key={idx} onClick={() => window.location.href = `/resources?category=${cat.title.replace(/\s+/g, '')}`} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-black hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:border-emerald-saudi/20 transition-all duration-300 cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-emerald-saudi/5 flex items-center justify-center text-emerald-saudi group-hover:bg-emerald-saudi group-hover:text-white transition-colors">
                                    <cat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.title}</h3>
                                    <p className="text-slate-400 text-sm">{cat.count}</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:border-gold-saudi group-hover:text-gold-saudi transition-all">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
