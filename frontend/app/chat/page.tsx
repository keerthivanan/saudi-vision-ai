'use client';

import { useState } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatInterface from '../components/chat/ChatInterface';

export default function ChatPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <>
            <ChatSidebar refreshTrigger={refreshTrigger} />
            <main className="flex-1 flex flex-col relative">
                <ChatInterface onChatCreated={() => setRefreshTrigger(prev => prev + 1)} />
            </main>
        </>
    );
}
