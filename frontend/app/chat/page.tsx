'use client';

import ChatSidebar from '../components/chat/ChatSidebar';
import ChatInterface from '../components/chat/ChatInterface';

export default function ChatPage() {
    return (
        <>
            <ChatSidebar />
            <main className="flex-1 flex flex-col relative">
                <ChatInterface />
            </main>
        </>
    );
}
