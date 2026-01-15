'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Globe, Bell, Shield, Trash2, ArrowLeft, Check, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        setMounted(true);
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading' || !mounted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-saudi border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.error('Account deletion is not available in demo mode.', { duration: 4000 });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-saudi mb-8 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Profile
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-emerald-saudi/10 flex items-center justify-center">
                                <Settings className="w-6 h-6 text-emerald-saudi" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                                <p className="text-slate-500 dark:text-slate-400">Manage your preferences</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Settings Cards */}
                    <div className="space-y-6">

                        {/* Appearance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                Appearance
                            </h2>

                            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose light or dark mode</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${theme === 'light'
                                                ? 'bg-emerald-saudi text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <Sun size={16} /> Light
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${theme === 'dark'
                                                ? 'bg-emerald-saudi text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <Moon size={16} /> Dark
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Language</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred language</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => language !== 'en' && toggleLanguage()}
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${language === 'en'
                                                ? 'bg-emerald-saudi text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <Globe size={16} /> English
                                    </button>
                                    <button
                                        onClick={() => language !== 'ar' && toggleLanguage()}
                                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${language === 'ar'
                                                ? 'bg-emerald-saudi text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <Globe size={16} /> العربية
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Bell size={20} />
                                Notifications
                            </h2>

                            <div className="flex items-center justify-between py-4">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your account</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setNotifications(!notifications);
                                        toast.success(notifications ? 'Notifications disabled' : 'Notifications enabled');
                                    }}
                                    className={`w-14 h-8 rounded-full p-1 transition-all ${notifications ? 'bg-emerald-saudi' : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Account */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Shield size={20} />
                                Account
                            </h2>

                            <div className="space-y-4">
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center justify-between py-4 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                        <LogOut size={20} />
                                        Sign Out
                                    </span>
                                    <ArrowLeft size={20} className="rotate-180 text-slate-400" />
                                </button>

                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full flex items-center justify-between py-4 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-900/50"
                                >
                                    <span className="flex items-center gap-3 text-red-600 dark:text-red-400 font-medium">
                                        <Trash2 size={20} />
                                        Delete Account
                                    </span>
                                    <ArrowLeft size={20} className="rotate-180 text-red-400" />
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
