'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-saudi/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 relative z-10"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sidebar-dark border border-gold-saudi mb-6 shadow-lg">
                    <Crown className="w-8 h-8 text-gold-saudi" />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                    Choose Your <span className="text-emerald-saudi">Vision</span> Plan
                </h1>
                <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
                    Unlock the full potential of the Saudi Vision 2030 Enterprise AI. Select a plan that fits your strategic needs.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
                {/* Free Plan */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden group hover:border-emerald-saudi/30 transition-all"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Starter</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-slate-900">Free</span>
                        <span className="text-slate-400">/ forever</span>
                    </div>
                    <p className="text-slate-500 mb-8 h-12">Perfect for exploring the platform capabilities.</p>

                    <ul className="space-y-4 mb-8">
                        {[
                            '30 Free Credits',
                            'Basic Chat Access',
                            'Standard RAG Retrieval',
                            'Community Support'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Check className="w-3 h-3" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <Link href="/" className="block w-full py-4 rounded-xl bg-slate-100 text-slate-600 font-bold text-center hover:bg-slate-200 transition-colors">
                        Continue Free
                    </Link>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-sidebar-dark rounded-3xl p-8 border border-gold-saudi shadow-2xl relative overflow-hidden transform md:-translate-y-4"
                >
                    <div className="absolute top-0 right-0 bg-gold-saudi text-sidebar-dark text-xs font-bold px-3 py-1 rounded-bl-xl">
                        POPULAR
                    </div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-saudi to-amber-500" />

                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        Enterprise <Zap className="w-5 h-5 text-gold-saudi fill-gold-saudi animate-pulse" />
                    </h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">$49</span>
                        <span className="text-slate-400">/ month</span>
                    </div>
                    <p className="text-slate-400 mb-8 h-12">For power users requiring unlimited strategic insights.</p>

                    <ul className="space-y-4 mb-8">
                        {[
                            'Unlimited Credits',
                            'Priority AI Processing',
                            'Advanced RAG (Deep Search)',
                            'Multiple File Uploads',
                            '24/7 Dedicated Support'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-gold-saudi/20 flex items-center justify-center text-gold-saudi">
                                    <Check className="w-3 h-3" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => alert("Payment Gateway Integration Coming Soon!")}
                        className="block w-full py-4 rounded-xl bg-gradient-to-r from-gold-saudi to-amber-500 text-white font-bold text-center shadow-lg hover:shadow-gold-saudi/20 hover:scale-[1.02] transition-all"
                    >
                        Upgrade Now
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-3">14-day money back guarantee</p>
                </motion.div>
            </div>
        </div>
    );
}
