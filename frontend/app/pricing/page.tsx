'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles, Gem } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // Inject Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePurchase = async (plan: 'standard' | 'royal') => {
        if (!session) {
            // New User: Redirect to Signup with plan intent
            router.push(`/auth/signup?plan=${plan}`);
            return;
        }

        try {
            const token = (session as any).accessToken || (session as any).user?.accessToken;

            // 1. Create Order
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/v1/payment/checkout?plan=${plan}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Payment Failed");
            }

            const data = await res.json();

            // 2. Open Razorpay Options
            const options = {
                key: data.key_id, // Enter the Key ID generated from the Dashboard
                amount: data.amount,
                currency: data.currency,
                name: "The Global Oracle",
                description: plan === 'royal' ? "Royal Access Pack" : "Standard Credit Pack",
                image: "", // Optional: Add a Logo URL
                order_id: data.order_id,
                handler: async function (response: any) {
                    // 3. Verify Payment on Backend
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/api/v1/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: plan
                        })
                    });

                    if (verifyRes.ok) {
                        toast.success('Payment Successful! Credits Added. 💎');
                        router.refresh();
                    } else {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: session.user?.name || "",
                    email: session.user?.email || "",
                    contact: "" // Optional
                },
                theme: {
                    color: "#10B981" // Emerald
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error('Payment Failed: ' + response.error.description);
            });
            rzp1.open();

        } catch (error: any) {
            toast.error(`Payment Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans">
            {/* Background Decor - Dynamic Aurora */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-saudi/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gold-saudi/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-16 relative z-10"
            >
                <span className="inline-block px-4 py-2 rounded-full bg-emerald-saudi/10 text-emerald-saudi text-sm font-semibold mb-6 uppercase tracking-wider">
                    Pricing
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                    Power Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-saudi to-emerald-600">Vision</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl leading-relaxed font-light">
                    Purchase <span className="font-semibold text-slate-700 dark:text-slate-200">Credit Packs</span> on demand. No subscriptions. No hidden fees.
                    <br />Pure strategic power, exactly when you need it.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full relative z-10 px-4 items-center">

                {/* 1. Starter Pack (Free) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    whileHover={{ y: -10 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden flex flex-col h-[500px] group"
                >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-serif">Starter</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold text-slate-900 dark:text-white">0</span>
                        <span className="text-xl text-emerald-saudi font-serif">SAR</span>
                    </div>
                    <p className="text-emerald-saudi font-medium mb-8 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Just Visiting
                    </p>

                    <div className="flex-1 space-y-4">
                        {[
                            '30 Credits (One-time)',
                            'Access to Standard Engine',
                            'Basic Document Search',
                            'No Expiry on Credits'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                            </li>
                        ))}
                    </div>

                    <Link href="/auth/signup" className="block w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-[1.02]">
                        Claim Free Pack
                    </Link>
                </motion.div>

                {/* 2. Standard Pack (Popular) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    whileHover={{ y: -15 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-emerald-saudi shadow-2xl shadow-emerald-saudi/10 relative overflow-hidden flex flex-col h-[560px] transform scale-105 z-20"
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-saudi to-teal-500" />
                    <div className="absolute top-6 right-6 flex flex-col items-end">
                        <span className="bg-emerald-saudi text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-1">Most Popular</span>
                    </div>

                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Standard</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">50</span>
                        <span className="text-2xl text-emerald-saudi font-serif">SAR</span>
                    </div>
                    <p className="text-emerald-600 font-medium mb-8 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Gem className="w-4 h-4" /> 130 Solid Credits
                    </p>

                    <div className="flex-1 space-y-5">
                        {[
                            '130 Professional Credits',
                            'Priority RAG Processing',
                            'Deep Document Analysis',
                            'Smart PDF Summary',
                            'Email Support'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-emerald-saudi" />
                                </div>
                                <span className="text-sm font-semibold">{item}</span>
                            </li>
                        ))}
                    </div>

                    <button onClick={() => handlePurchase('standard')} className="block w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-saudi to-emerald-700 text-white font-bold text-lg text-center shadow-lg shadow-emerald-saudi/30 hover:shadow-xl hover:scale-[1.03] transition-all">
                        Buy Standard Pack
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">One-time payment. Use anytime.</p>
                </motion.div>

                {/* 3. Royal Pack (Premium) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    whileHover={{ y: -10 }}
                    className="bg-[#1a2e35] rounded-[2.5rem] p-8 border border-gold-saudi shadow-2xl relative overflow-hidden flex flex-col h-[500px] group"
                >
                    {/* Golden Glow Effect */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-saudi rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />

                    <h3 className="text-2xl font-bold text-white mb-2 font-serif flex items-center gap-2">
                        Royal <Crown className="w-5 h-5 text-gold-saudi fill-gold-saudi" />
                    </h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold text-white tracking-tighter">120</span>
                        <span className="text-xl text-gold-saudi font-serif">SAR</span>
                    </div>
                    <p className="text-gold-saudi/80 font-medium mb-8 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4" /> 200 Ultimate Credits
                    </p>

                    <div className="flex-1 space-y-4">
                        {[
                            '200 Elite Credits',
                            'GPT-5.1 (Exclusive Access)',
                            'Strategic Forecasting',
                            'Dedicated Advisor Support',
                            'Early Access to Features'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <div className="w-6 h-6 rounded-full bg-gold-saudi/10 flex items-center justify-center flex-shrink-0 border border-gold-saudi/20">
                                    <Check className="w-3.5 h-3.5 text-gold-saudi" />
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                            </li>
                        ))}
                    </div>

                    <button onClick={() => handlePurchase('royal')} className="block w-full py-4 rounded-2xl bg-gradient-to-r from-gold-saudi to-amber-600 text-white font-bold text-center shadow-lg shadow-gold-saudi/20 hover:scale-[1.02] transition-all border border-gold-saudi/30">
                        Acquire Royal Pack
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">One-time payment.</p>
                </motion.div>

            </div>
        </div>
    );
}
