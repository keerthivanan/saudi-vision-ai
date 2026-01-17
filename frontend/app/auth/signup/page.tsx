'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Shield, Sparkles, ArrowRight, Bot, Zap, Lock, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function SignUpContent() {
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleGoogleSignUp = async () => {
    setIsSigningUp(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsSigningUp(false);
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

  const benefits = [
    "Access to 500+ official Vision 2030 documents",
    "Real-time AI-powered insights & analysis",
    "Bilingual support: Arabic & English",
    "Enterprise-grade security",
    "Priority support access",
  ];

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Left Side - Sign Up Form */}
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
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Get Started Free</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Create your account
              </h1>
              <p className="text-slate-400 text-sm">
                Join the future of Saudi intelligence
              </p>
            </div>

            <div className="space-y-6">
              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isSigningUp}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] group"
              >
                {isSigningUp ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                    <ArrowRight className="w-4 h-4 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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

              {/* Terms */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Sign in
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

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
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

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Everything you need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              understand Vision 2030
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-md mb-10 leading-relaxed">
            Get instant access to Saudi Arabia's most comprehensive AI-powered knowledge platform.
          </p>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
          >
            <p className="text-slate-300 italic mb-4">
              "The most comprehensive platform for understanding Saudi's transformation. Absolutely essential for any business operating in the Kingdom."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Mohammed Al-Rashid</p>
                <p className="text-slate-500 text-xs">CEO, Riyadh Ventures</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    // @ts-ignore
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
