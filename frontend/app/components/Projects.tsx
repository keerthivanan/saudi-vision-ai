'use client';

import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Projects() {
    const { t } = useLanguage();

    const projects = [
        {
            title: t('Project1Title'),
            desc: t('Project1Desc'),
            location: t('Project1Loc'),
            image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&q=80',
            officialUrl: 'https://www.neom.com',
        },
        {
            title: t('Project2Title'),
            desc: t('Project2Desc'),
            location: t('Project2Loc'),
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
            officialUrl: 'https://www.redseaglobal.com',
        },
        {
            title: t('Project3Title'),
            desc: t('Project3Desc'),
            location: t('Project3Loc'),
            image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80',
            officialUrl: 'https://qiddiya.com',
        },
        {
            title: t('Project4Title'),
            desc: t('Project4Desc'),
            location: t('Project4Loc'),
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80',
            officialUrl: 'https://www.roshn.sa',
        }
    ];

    return (
        <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('ProjectsTitle')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">
                            {t('ProjectsSubtitle')}
                        </p>
                    </div>
                    <button onClick={() => window.location.href = '#metrics'} className="group flex items-center gap-2 text-emerald-saudi font-bold border-b-2 border-emerald-saudi pb-1 hover:text-emerald-800 transition-colors">
                        {t('ViewAllProjects')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                    </button>
                </div>

                {/* Horizontal Scroll / Grid */}
                <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[300px] md:min-w-[420px] bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 snap-center relative group"
                        >
                            <div className="h-72 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-4 left-6 rtl:left-auto rtl:right-6 z-20 flex items-center gap-2 text-white/90 text-sm font-medium">
                                    <MapPin size={16} /> {project.location}
                                </div>
                            </div>

                            <div className="p-8 relative">
                                <div className="absolute left-0 rtl:left-auto rtl:right-0 top-8 bottom-8 w-1 bg-emerald-saudi rounded-r-full rtl:rounded-l-full rtl:rounded-r-none" />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{project.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                    {project.desc}
                                </p>
                                <a
                                    href={project.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => toast.success(`Opening official site: ${project.title}`)}
                                    className="inline-flex items-center gap-2 text-gold-saudi font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all cursor-pointer"
                                >
                                    {t('ExploreProject')} <ArrowRight size={16} className="rtl:rotate-180" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
