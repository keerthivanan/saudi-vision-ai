'use client';

import { useState, useEffect } from 'react';
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

// Add Props Interface
interface ChatSidebarProps {
    refreshTrigger?: number;
    onSelectChat?: (id: string) => void;
}

export default function ChatSidebar({ refreshTrigger, onSelectChat }: ChatSidebarProps) {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [collapsed, setCollapsed] = useState(false);
    const [chats, setChats] = useState<any[]>([]);

    // Fetch History
    useEffect(() => {
        if (session?.user) {
            fetch('/api/v1/chat/history', {
                headers: { 'X-User-Email': session.user.email || '' }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Not Authorized");
                    return res.json();
                })
                .then(data => {
                    // Safety: Ensure it is an array
                    if (Array.isArray(data)) {
                        setChats(data);
                    } else {
                        console.warn("History API returned non-array:", data);
                        setChats([]);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch history", err);
                    setChats([]);
                });
        }
    }, [session, refreshTrigger]);

    // Format Date Helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-[#050A18] border-r border-white/5 flex flex-col flex-shrink-0 z-20 relative"
        >
            {/* Header / New Chat */}
            <div className="p-4">
                <button
                    onClick={() => window.location.href = '/chat'} // Simple reload/reset for new chat
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/10 group
            ${collapsed ? 'justify-center' : ''}`}
                >
                    <Plus className="w-5 h-5" />
                    {!collapsed && <span className="font-semibold text-sm">{t('NewChat')}</span>}
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {(() => {
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const lastWeek = new Date(today);
                    lastWeek.setDate(lastWeek.getDate() - 7);

                    const groups = {
                        [t('Today') || 'Today']: [] as any[],
                        [t('Yesterday') || 'Yesterday']: [] as any[],
                        [t('Previous7Days') || 'Previous 7 Days']: [] as any[],
                        [t('Older') || 'Older']: [] as any[]
                    };

                    chats.forEach(chat => {
                        // Handle potential timezone/format issues by creating a clean date object
                        const d = new Date(chat.updated_at || chat.created_at);
                        const chatDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

                        if (chatDate.getTime() === today.getTime()) {
                            groups[t('Today') || 'Today'].push(chat);
                        } else if (chatDate.getTime() === yesterday.getTime()) {
                            groups[t('Yesterday') || 'Yesterday'].push(chat);
                        } else if (chatDate > lastWeek) {
                            groups[t('Previous7Days') || 'Previous 7 Days'].push(chat);
                        } else {
                            groups[t('Older') || 'Older'].push(chat);
                        }
                    });

                    return Object.entries(groups).map(([label, groupChats]) => {
                        if (groupChats.length === 0) return null;

                        return (
                            <div key={label} className="space-y-2">
                                {!collapsed && (
                                    <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-600">
                                        {label}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {groupChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => onSelectChat ? onSelectChat(chat.id) : (window.location.href = `/chat?id=${chat.id}`)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all group text-left border border-transparent hover:border-emerald-saudi/10
                                                ${collapsed ? 'justify-center' : ''}`}
                                        >
                                            <MessageSquare className="w-4 h-4 text-slate-600 group-hover:text-emerald-saudi transition-colors flex-shrink-0" />
                                            {!collapsed && (
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm truncate font-medium text-slate-300 group-hover:text-emerald-50 transition-colors">{chat.title || "Untitled Chat"}</p>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    });
                })()}
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
