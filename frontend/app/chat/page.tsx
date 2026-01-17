'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatInterface from '../components/chat/ChatInterface';

export default function ChatPage() {
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Handler for when a sidebar history item is clicked
    const handleSelectChat = (conversationId: string) => {
        // Use Next.js router for SPA-style navigation (no reload)
        router.push(`/chat?id=${conversationId}`);
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <ChatSidebar
                refreshTrigger={refreshTrigger}
                onSelectChat={handleSelectChat}
            />
            <main className="flex-1 flex flex-col w-full relative overflow-hidden">
                <ChatInterface onChatCreated={() => setRefreshTrigger(prev => prev + 1)} />
            </main>
        </div>
    );
}
