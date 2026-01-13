'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import {
    Plus,
    MessageSquare,
    Settings,
    LogOut,
    User,
    ChevronLeft,
    Search,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatSidebar() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [collapsed, setCollapsed] = useState(false);
    const [chats, setChats] = useState([
        { id: 1, title: t('Chat1'), date: t('Today') },
        { id: 2, title: t('Chat2'), date: t('Yesterday') },
        { id: 3, title: t('Chat3'), date: t('LastWeek') },
    ]);

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-[#050A18] border-r border-white/5 flex flex-col flex-shrink-0 z-20 relative"
        >
            {/* Header / New Chat */}
            <div className="p-4">
                <button
                    onClick={() => console.log("New Chat")}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/10 group
            ${collapsed ? 'justify-center' : ''}`}
                >
                    <Plus className="w-5 h-5" />
                    {!collapsed && <span className="font-semibold text-sm">{t('NewChat')}</span>}
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                {!collapsed && (
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">
                        {t('History')}
                    </p>
                )}

                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors group text-left
              ${collapsed ? 'justify-center' : ''}`}
                    >
                        <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors flex-shrink-0" />
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm truncate">{chat.title}</p>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-white/5">

                {/* Toggle Collapse */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#0B1224] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/50 transition-all z-30"
                >
                    <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>

                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center flex-col gap-4' : ''}`}>
                    {/* User Info */}
                    <div className={`flex items-center gap-3 flex-1 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-emerald-saudi/20 border border-emerald-saudi/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-emerald-saudi" />
                            )}
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate">{t('ProPlan')}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : ''}`}>
                        <Link href="/">
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title={t('GoHome')}>
                                <LogOut className="w-4 h-4 rotate-180 rtl:rotate-0" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
