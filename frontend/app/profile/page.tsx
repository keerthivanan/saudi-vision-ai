'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Crown, Coins, Calendar, MessageSquare, Settings, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    image?: string;
    credits: number;
    tier: string;
    created_at: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (session?.user) {
            fetch('/api/v1/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data.email) {
                        setProfile(data);
                    }
                })
                .catch(err => console.error('Failed to load profile', err))
                .finally(() => setLoading(false));
        }
    }, [session, status, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-saudi border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const tierColors: Record<string, string> = {
        'free': 'bg-slate-500',
        'standard': 'bg-emerald-saudi',
        'royal': 'bg-gradient-to-r from-gold-saudi to-amber-500'
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-saudi mb-8 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>

                    {/* Profile Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-8"
                    >
                        {/* Banner */}
                        <div className="h-32 bg-gradient-to-r from-emerald-saudi to-emerald-700 relative">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-8 -mt-16 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>

                                {/* Name & Email */}
                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                        {session?.user?.name || 'User'}
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                        <Mail size={16} />
                                        {session?.user?.email}
                                    </p>
                                </div>

                                {/* Tier Badge */}
                                <div className={`px-4 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2 ${tierColors[profile?.tier || 'free']}`}>
                                    <Crown size={16} />
                                    {(profile?.tier || 'free').toUpperCase()} TIER
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Credits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gold-saudi/10 flex items-center justify-center">
                                    <Coins className="w-7 h-7 text-gold-saudi" />
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Available Credits</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{profile?.credits ?? 0}</p>
                                </div>
                            </div>
                            <Link href="/pricing" className="mt-4 block w-full py-2 text-center rounded-xl bg-gold-saudi/10 text-gold-saudi font-semibold hover:bg-gold-saudi/20 transition-colors">
                                Get More Credits
                            </Link>
                        </motion.div>

                        {/* Member Since */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-emerald-saudi/10 flex items-center justify-center">
                                    <Calendar className="w-7 h-7 text-emerald-saudi" />
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Member Since</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Today'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Settings className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Quick Actions</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">Manage Account</p>
                                </div>
                            </div>
                            <Link href="/settings" className="block w-full py-2 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Go to Settings
                            </Link>
                        </motion.div>
                    </div>

                    {/* Start Chat CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-emerald-saudi to-emerald-700 rounded-2xl p-8 text-white text-center"
                    >
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold-saudi" />
                        <h3 className="text-2xl font-bold mb-2">Ready to explore Vision 2030?</h3>
                        <p className="text-emerald-100 mb-6">Start a conversation with our AI Strategic Advisor</p>
                        <Link href="/chat" className="inline-flex items-center gap-2 bg-white text-emerald-saudi px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                            <MessageSquare size={20} />
                            Start New Chat
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
