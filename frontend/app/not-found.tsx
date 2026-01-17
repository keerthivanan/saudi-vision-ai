import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background dark:bg-midnight-blue flex items-center justify-center relative overflow-hidden text-center px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-saudi/20 rounded-full blur-[120px]" />

            <div className="relative z-10">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-saudi to-emerald-900 mb-4 font-serif">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-6">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground dark:text-slate-300 max-w-lg mx-auto mb-10 text-lg">
                    The page you are looking for seems to have been lost in the digital dunes.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-emerald-saudi text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-saudi/30 hover:-translate-y-1"
                >
                    <Home size={20} /> Return to Home
                </Link>
            </div>
        </div>
    );
}
