import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Assistant | Vision 2030',
    description: 'Enterprise Intelligence Hub',
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#050A18]">
            {children}
        </div>
    );
}
