'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Shield, Zap, Award, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
        return;
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const handleGoogleSignUp = async () => {
    setIsSigningUp(true);
    setError(null);

    try {
      await signIn('google', {
        callbackUrl: '/',
      });
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsSigningUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const benefits = [
    { title: "Strategic Intelligence", desc: "Access verified Vision 2030 datasets." },
    { title: "Hybrid Search", desc: "Perfect recall with Vector + Keyword fusion." },
    { title: "Bilingual Flow", desc: "Native Arabic and English LLM support." },
    { title: "Bank-Level Security", desc: "PII redaction and encrypted storage." }
  ];

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mt-64" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -mr-64 -mb-64" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-[#0B1224] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 mb-6 group transition-all duration-500 hover:scale-110">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-3 tracking-tight">
              Join the Platform
            </h1>
            <p className="text-muted-foreground font-sans text-sm md:text-base">
              Establish your enterprise AI workspace
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{benefit.title}</h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isSigningUp}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-black hover:bg-gray-100 transition-all duration-300 font-medium text-sm md:text-base mb-8 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSigningUp ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign Up with Google
                <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-white/5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign In
              </Link>
            </p>
            <p className="text-[10px] text-white/30 px-6 uppercase tracking-widest leading-relaxed">
              Trusted by enterprise stakeholders for Saudi Vision 2030 implementation.
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-10 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <Shield className="w-6 h-6 text-white" />
          <Award className="w-6 h-6 text-white" />
          <Zap className="w-6 h-6 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
