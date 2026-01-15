'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Download, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ResourcesPage() {
    const { t, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Categories
    const categories = [
        { id: 'All', label: t('ResCatAll') },
        { id: 'Economy', label: t('ResCatEco') },
        { id: 'Society', label: t('ResCatSoc') },
        { id: 'Environment', label: t('ResCatEnv') },
        { id: 'Tech', label: t('ResCatTech') },
    ];

    // Mock Documents Data (Dynamic using t())
    const documents = [
        {
            id: 1,
            title: t('Doc1Title'),
            desc: t('Doc1Desc'),
            category: 'Economy',
            size: '4.2 MB',
            date: '2023-08-15',
            type: 'PDF'
        },
        {
            id: 2,
            title: t('Doc2Title'),
            desc: t('Doc2Desc'),
            category: 'Tech',
            size: '12.5 MB',
            date: '2024-01-10',
            type: 'PDF'
        },
        {
            id: 3,
            title: t('Doc3Title'),
            desc: t('Doc3Desc'),
            category: 'Environment',
            size: '8.1 MB',
            date: '2023-11-22',
            type: 'PDF'
        },
        {
            id: 4,
            title: t('Doc4Title'),
            desc: t('Doc4Desc'),
            category: 'Economy',
            size: '3.5 MB',
            date: '2023-09-05',
            type: 'PDF'
        },
        {
            id: 5,
            title: t('Doc5Title'),
            desc: t('Doc5Desc'),
            category: 'Society',
            size: '6.8 MB',
            date: '2023-12-01',
            type: 'PDF'
        },
        {
            id: 6,
            title: t('Doc6Title'),
            desc: t('Doc6Desc'),
            category: 'Tech',
            size: '2.1 MB',
            date: '2024-02-14',
            type: 'PDF'
        }
    ];

    // Filter Logic
    const filteredDocs = documents.filter(doc => {
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                {/* Header Section */}
                <section className="bg-midnight-blue text-white py-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif tracking-tight">
                                {t('ResTitle')}
                            </h1>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                                {t('ResSubtitle')}
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative group">
                                <div className="absolute inset-0 bg-emerald-saudi/30 blur-xl rounded-full group-hover:bg-emerald-saudi/50 transition-all duration-500" />
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center p-2 transition-all group-hover:bg-white/15 focus-within:ring-2 focus-within:ring-emerald-saudi/50">
                                    <Search className="w-6 h-6 text-slate-300 ml-4 rtl:ml-0 rtl:mr-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('SearchRes')}
                                        className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 px-4 py-2 text-lg"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border
                                ${selectedCategory === cat.id
                                        ? 'bg-emerald-saudi text-white border-emerald-saudi shadow-lg shadow-emerald-saudi/20'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-saudi hover:text-emerald-saudi'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Results Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredDocs.map((doc) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={doc.id}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-emerald-saudi/30 transition-all duration-300 group flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-saudi/10 transition-colors">
                                            <FileText className="w-6 h-6 text-slate-500 group-hover:text-emerald-saudi transition-colors" />
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {doc.type}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-emerald-saudi transition-colors">
                                        {doc.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1">
                                        {doc.desc}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                                        <div className="text-xs text-slate-400 font-medium space-y-1">
                                            <p>{doc.size}</p>
                                            <p>{doc.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a href="/chat" className="p-2 rounded-lg hover:bg-emerald-saudi/10 text-emerald-saudi transition-colors" title={t('AnalyzeWithAI')}>
                                                <Sparkles className="w-5 h-5" />
                                            </a>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-emerald-saudi transition-colors shadow-lg shadow-black/5">
                                                <Download className="w-3.5 h-3.5" />
                                                <span>{t('Download')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredDocs.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">No documents found matching your criteria.</p>
                            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All') }} className="mt-4 text-emerald-saudi font-semibold hover:underline">
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
