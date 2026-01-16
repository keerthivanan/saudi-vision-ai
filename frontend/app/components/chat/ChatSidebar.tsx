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
            className="h-screen bg-secondary/30 backdrop-blur-xl border-r border-border flex flex-col flex-shrink-0 z-20 relative transition-colors duration-500"
        >
            {/* Header / New Chat */}
            <div className="p-4">
                <button
                    onClick={() => window.location.href = '/chat'} // Simple reload/reset for new chat
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm group
            ${collapsed ? 'justify-center' : ''}`}
                >
                    <Plus className="w-5 h-5" />
                    {!collapsed && <span className="font-medium text-sm">{t('NewChat')}</span>}
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-border">
                {(() => {
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const lastWeek = new Date(today);
                    lastWeek.setDate(lastWeek.getDate() - 7);

                    const labelToday = t('Today') || 'Today';
                    const labelYesterday = t('Yesterday') || 'Yesterday';
                    const labelWeek = t('Previous7Days') || 'Previous 7 Days';
                    const labelOlder = t('Older') || 'Older';

                    const groups: Record<string, any[]> = {
                        [labelToday]: [],
                        [labelYesterday]: [],
                        [labelWeek]: [],
                        [labelOlder]: []
                    };

                    chats.forEach(chat => {
                        // Handle potential timezone/format issues by creating a clean date object
                        const d = new Date(chat.updated_at || chat.created_at);
                        const chatDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

                        if (chatDate.getTime() === today.getTime()) {
                            groups[labelToday]!.push(chat);
                        } else if (chatDate.getTime() === yesterday.getTime()) {
                            groups[labelYesterday]!.push(chat);
                        } else if (chatDate > lastWeek) {
                            groups[labelWeek]!.push(chat);
                        } else {
                            groups[labelOlder]!.push(chat);
                        }
                    });

                    return Object.entries(groups).map(([label, groupChats]) => {
                        if (groupChats.length === 0) return null;

                        return (
                            <div key={label} className="space-y-2">
                                {!collapsed && (
                                    <h3 className="px-3 text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
                                        {label}
                                    </h3>
                                )}
                                <div className="space-y-0.5">
                                    {groupChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => onSelectChat ? onSelectChat(chat.id) : (window.location.href = `/chat?id=${chat.id}`)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-all group text-left
                                                ${collapsed ? 'justify-center' : ''}`}
                                        >
                                            <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                            {!collapsed && (
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[13px] truncate font-medium">{chat.title || "Untitled Conversation"}</p>
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
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-md">

                {/* Toggle Collapse */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all z-30 shadow-sm"
                >
                    <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>

                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center flex-col gap-4' : ''}`}>
                    {/* User Info */}
                    <div className={`flex items-center gap-3 flex-1 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                            )}
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{session?.user?.name || 'User'}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{t('ProPlan')}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : ''}`}>
                        <Link href="/">
                            <button className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-colors" title={t('GoHome')}>
                                <LogOut className="w-4 h-4 rotate-180 rtl:rotate-0" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
