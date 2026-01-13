'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Shield, Zap, Award, ArrowRight, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function SignInContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error');

  useEffect(() => {
    // Handle specific NextAuth error codes
    if (urlError && urlError !== 'undefined') {
      const errorMap: Record<string, string> = {
        'Signin': 'Try signing in with a different account.',
        'OAuthSignin': 'Try signing in with a different account.',
        'OAuthCallback': 'Try signing in with a different account.',
        'OAuthCreateAccount': 'Try signing in with a different account.',
        'EmailCreateAccount': 'Try signing in with a different account.',
        'Callback': 'Try signing in with a different account.',
        'OAuthAccountNotLinked': 'To confirm your identity, sign in with the same account you used originally.',
        'EmailSignin': 'The e-mail could not be sent.',
        'CredentialsSignin': 'The demo login failed. Please try again.',
        'SessionRequired': 'Please sign in to access this page.',
        'default': 'Unable to sign in.',
      };

      const errorMessage = errorMap[urlError] || errorMap['default'];
      setError(errorMessage || "An unknown error occurred.");
    } else if (urlError === 'undefined') {
      setError("An unexpected configuration error occurred. Please check the server logs.");
    }
  }, [urlError]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          router.push('/');
          return;
        }
      } catch (e) {
        console.error("Session check failed", e);
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      // Force popup for Google to see immediate errors
      await signIn('google', {
        callbackUrl: window.location.origin + '/',
        redirect: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
      setIsSigningIn(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      console.log("Attempting Demo Login...");
      const result = await signIn('credentials', {
        redirect: true,
        callbackUrl: window.location.origin + '/',
      });
      if (result?.error) {
        setError(result.error);
        setIsSigningIn(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -ml-64 -mb-64" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="bg-[#0B1224] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 font-serif text-3xl font-bold text-primary">V</div>
            <h1 className="text-3xl font-bold text-white mb-2">Intelligence Hub</h1>
            <p className="text-slate-400">Secure Enterprise AI Platform</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold mb-1">Sign-in Error</p>
                <p className="opacity-90">{error}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 transition-all font-bold disabled:opacity-50"
            >
              {isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Login with Google
                </>
              )}
            </button>

            <button
              onClick={handleDemoSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-bold disabled:opacity-50"
            >
              <User className="w-5 h-5" />
              Demo Access (Fail-safe)
            </button>
          </div>

          <div className="text-center pt-4 border-t border-white/5">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Return to Website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignIn() {
  return (
    // @ts-ignore
    <Suspense fallback={<div className="min-h-screen bg-[#050A18] flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
