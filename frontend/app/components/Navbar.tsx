'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, Bell, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

export default function Navbar() {
    const { data: session } = useSession();
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('Home'), href: '/' },
        { name: t('Pillars'), href: '#pillars' },
        { name: t('Projects'), href: '#projects' },
        { name: t('Progress'), href: '#metrics' },
        { name: t('AIAssistant'), href: '/chat' },
        { name: t('Resources'), href: '/resources' },
    ];


    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'glass-panel py-3 shadow-lg'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-emerald-saudi/10 flex items-center justify-center border border-emerald-saudi/20 group-hover:bg-emerald-saudi/20 transition-all">
                                <span className="font-serif text-2xl font-bold text-emerald-saudi">V</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Vision 2030</span>
                                <span className="text-[10px] uppercase tracking-widest text-emerald-saudi font-medium">Intelligence Hub</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-saudi dark:hover:text-emerald-400 transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-saudi transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="Toggle Theme"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            )}

                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-saudi/20 text-emerald-saudi hover:bg-emerald-saudi/5 transition-colors text-sm dark:border-emerald-saudi/40 dark:text-emerald-400"
                            >
                                <Globe size={16} />
                                <span className={language === 'ar' ? 'font-extrabold' : 'font-normal opacity-70'}>AR</span>
                                <span className="opacity-30">|</span>
                                <span className={language === 'en' ? 'font-extrabold' : 'font-normal opacity-70'}>EN</span>
                            </button>

                            <button onClick={() => toast("No new notifications!", { icon: '🔔' })} className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-saudi dark:hover:text-emerald-400 transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold-saudi border border-white" />
                            </button>

                            <div className="relative">
                                {session ? (
                                    <>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-emerald-saudi/20 hover:border-emerald-saudi/50 transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-saudi text-white flex items-center justify-center overflow-hidden border border-emerald-saudi">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <ChevronDown size={14} className="text-emerald-saudi" />
                                        </button>

                                        {/* Dropdown Menu - Simplified using group-focus logic or just click state */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Signed in as</p>
                                                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{session.user?.name || "User"}</p>
                                                </div>
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                                >
                                                    <LogOut size={14} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/auth/signin">
                                        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-saudi text-white text-sm font-bold shadow-lg shadow-emerald-saudi/20 hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95">
                                            <User size={16} />
                                            Sign In
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-[72px] left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-emerald-saudi/10 shadow-xl z-40 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl hover:bg-emerald-saudi/5 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4">
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                                >
                                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Theme
                                </button>
                                <button className="flex items-center gap-2 text-sm font-medium text-emerald-saudi">
                                    <Globe size={16} /> Language
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
