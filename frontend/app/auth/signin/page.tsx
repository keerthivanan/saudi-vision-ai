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
      await signIn('google', {
        callbackUrl: '/',
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary mb-6 shadow-sm">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-semibold text-3xl text-foreground mb-2 tracking-tight">
            Sign in to SaudiAI
          </h1>
          <p className="text-muted-foreground text-[15px] max-w-xs mx-auto">
            Welcome back. Please authenticate to access the intelligence hub.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">

          <div className="space-y-6">
            {/* Action Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 font-medium text-[15px] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isSigningIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border/50 mt-8 space-y-4">
            <p className="text-[13px] text-muted-foreground">
              New to the platform?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline transition-all font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center mt-8 uppercase tracking-wider">
          Secured by Saudi Vision 2030 SSO
        </p>
      </motion.div>
    </div>
  );
}

export default function SignIn() {
  return (
    // @ts-ignore
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
