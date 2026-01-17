'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Scroll, FileCheck, AlertCircle, HelpCircle, ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        {
            icon: Scroll,
            title: "Use License",
            color: "from-blue-500 to-blue-600",
            description: "Permission is granted to temporarily access the materials (information or software) on Saudi AI Enterprise's website for personal, non-commercial transitory viewing only.",
            items: [
                "This is the grant of a license, not a transfer of title.",
                "You may not modify or copy the materials.",
                "You may not use the materials for any commercial purpose.",
                "You may not attempt to reverse engineer any software."
            ]
        },
        {
            icon: FileCheck,
            title: "AI Usage Guidelines",
            color: "from-emerald-500 to-emerald-600",
            description: "Our AI Consultant is designed to provide strategic insights. However:",
            items: [
                "You must verify critical information with official sources.",
                "You must not use the AI for illegal or harmful purposes.",
                "We are not liable for decisions made based solely on AI output.",
                "AI responses are informational and not professional advice."
            ]
        },
        {
            icon: AlertCircle,
            title: "Disclaimer",
            color: "from-amber-500 to-amber-600",
            description: "The materials on Saudi AI Enterprise's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property."
        },
        {
            icon: Shield,
            title: "Limitations",
            color: "from-purple-500 to-purple-600",
            description: "In no event shall Saudi AI Enterprise or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Saudi AI Enterprise's website."
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Hero */}
            <section className="relative pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <Scale className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Last updated: January 17, 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="relative pb-24">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12"
                    >
                        {/* Agreement */}
                        <div className="mb-12 pb-8 border-b border-slate-800">
                            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                            <p className="text-slate-400 leading-relaxed">
                                By accessing or using the Saudi Vision 2030 Enterprise AI Platform ("Service"),
                                you agree to be bound by these Terms of Service. If you disagree with any part
                                of these terms, you may not access the Service.
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-12">
                            {sections.map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                                            <section.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                    </div>

                                    <div className="ml-16">
                                        <p className="text-slate-400 leading-relaxed mb-4">{section.description}</p>

                                        {section.items && (
                                            <ul className="space-y-2">
                                                {section.items.map((item, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-slate-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Governing Law */}
                            <div className="pt-8 border-t border-slate-800">
                                <h2 className="text-xl font-bold text-white mb-4">Governing Law</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    These terms shall be governed by and construed in accordance with the laws of the
                                    Kingdom of Saudi Arabia. Any disputes relating to these terms will be subject to
                                    the exclusive jurisdiction of the courts of Riyadh.
                                </p>
                            </div>

                            {/* Changes to Terms */}
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Changes to Terms</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    We reserve the right to modify these terms at any time. We will notify you of any
                                    changes by posting the new Terms of Service on this page and updating the
                                    "Last updated" date.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <HelpCircle className="w-6 h-6 text-emerald-400" />
                                    <h2 className="text-lg font-bold text-white">Questions?</h2>
                                </div>
                                <p className="text-slate-400 mb-4">
                                    If you have any questions about these Terms, please contact us.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p className="text-slate-300"><strong className="text-white">Email:</strong> legal@saudiai.sa</p>
                                    <p className="text-slate-300"><strong className="text-white">Address:</strong> Riyadh, Saudi Arabia</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
