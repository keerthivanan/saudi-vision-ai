'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams?.get('error') || 'Default';

    const errorMessages: Record<string, string> = {
        Signin: "Try signing in with a different account.",
        OAuthSignin: "Try signing in with a different account.",
        OAuthCallback: "Try signing in with a different account.",
        OAuthCreateAccount: "Try signing in with a different account.",
        EmailCreateAccount: "Try signing in with a different account.",
        Callback: "Try signing in with a different account.",
        OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "Check your email address.",
        CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
        default: "Unable to sign in.",
    };

    const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.default;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 md:p-12 max-w-lg w-full rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                        Authentication Error
                    </h1>

                    <p className="text-muted-foreground mb-8 text-lg">
                        {errorMessage}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Link
                            href="/auth/signin"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Try Again
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border border-white/10 transition-all duration-300 font-medium"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-background to-background" />
            </div>

            {/* @ts-ignore */}
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
