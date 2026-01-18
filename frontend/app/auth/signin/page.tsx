'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Shield, Sparkles, ArrowRight, Bot, Zap, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

function SignInContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error');

  useEffect(() => {
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
      setError(errorMap[urlError] || errorMap['default'] || "An unknown error occurred");
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
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Saudi Vision 2030</h2>
              <p className="text-emerald-400 text-sm">Intelligence Hub</p>
            </div>
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Your Gateway to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              AI-Powered Insights
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-md mb-12 leading-relaxed">
            Access the most advanced RAG system for Saudi Vision 2030 intelligence.
            Real-time data, expert analysis, bilingual support.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Zap, text: "Instant answers from 500+ official documents" },
              { icon: Lock, text: "Enterprise-grade security & encryption" },
              { icon: Star, text: "Bilingual AI: Arabic & English" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-slate-300">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white font-bold text-2xl">Saudi Vision 2030</h2>
            <p className="text-emerald-400 text-sm">Intelligence Hub</p>
          </div>

          {/* Card */}
          <div className="bg-slate-950/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Welcome Back</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Sign in to continue
              </h1>
              <p className="text-slate-400 text-sm">
                Access your personalized intelligence dashboard
              </p>
            </div>

            <div className="space-y-6">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 transition-all duration-300 font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] group"
              >
                {isSigningIn ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  New to the platform?{' '}
                  <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-[11px] text-slate-600 text-center mt-8 uppercase tracking-wider">
            Secured by Saudi Vision 2030 Enterprise SSO
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    // @ts-ignore
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
