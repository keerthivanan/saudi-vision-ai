'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText, ArrowLeft, Bot } from 'lucide-react';

export default function PrivacyPage() {
    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            color: "from-blue-500 to-blue-600",
            content: [
                { subtitle: "Personal Information", items: ["Name and email address", "Account credentials", "Profile information", "Communication preferences"] },
                { subtitle: "Usage Information", items: ["Chat conversations and queries", "Uploaded documents", "Feature usage patterns", "Device and browser information"] }
            ]
        },
        {
            icon: UserCheck,
            title: "How We Use Your Information",
            color: "from-emerald-500 to-emerald-600",
            items: [
                "Provide and improve our AI services",
                "Personalize your experience",
                "Process your requests and transactions",
                "Send important updates and notifications",
                "Ensure platform security and prevent fraud",
                "Comply with legal obligations"
            ]
        },
        {
            icon: Lock,
            title: "Data Protection & Security",
            color: "from-purple-500 to-purple-600",
            description: "We implement industry-leading security measures to protect your data:",
            items: [
                "End-to-end encryption for all data transmission",
                "Secure data storage in Saudi Arabia",
                "Regular security audits and penetration testing",
                "PII (Personally Identifiable Information) redaction",
                "Access controls and authentication",
                "ISO 27001 certified infrastructure"
            ]
        },
        {
            icon: Eye,
            title: "Your Rights",
            color: "from-amber-500 to-amber-600",
            description: "Under GDPR and Saudi data protection laws, you have the right to:",
            items: [
                { bold: "Access:", text: "Request copies of your personal data" },
                { bold: "Rectification:", text: "Correct inaccurate information" },
                { bold: "Erasure:", text: "Request deletion of your data" },
                { bold: "Portability:", text: "Transfer your data to another service" },
                { bold: "Objection:", text: "Object to certain data processing" },
                { bold: "Restriction:", text: "Limit how we use your data" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px]" />
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
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Legal & Privacy</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Privacy Policy
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
                        {/* Introduction */}
                        <div className="mb-12 pb-8 border-b border-slate-800">
                            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Saudi AI Enterprise ("we," "our," or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                                when you use our AI platform and services.
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

                                    {section.description && (
                                        <p className="text-slate-400 mb-4 ml-16">{section.description}</p>
                                    )}

                                    {section.content && (
                                        <div className="space-y-6 ml-16">
                                            {section.content.map((block, j) => (
                                                <div key={j}>
                                                    <h3 className="text-white font-semibold mb-2">{block.subtitle}</h3>
                                                    <ul className="space-y-2">
                                                        {block.items.map((item, k) => (
                                                            <li key={k} className="flex items-center gap-3 text-slate-400">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.items && !section.content && (
                                        <ul className="space-y-2 ml-16">
                                            {section.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-3 text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                                    {typeof item === 'string' ? (
                                                        item
                                                    ) : (
                                                        <span><strong className="text-white">{item.bold}</strong> {item.text}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}

                            {/* Data Retention */}
                            <div className="pt-8 border-t border-slate-800">
                                <h2 className="text-xl font-bold text-white mb-4">Data Retention</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    We retain your personal information only for as long as necessary to fulfill the purposes
                                    outlined in this Privacy Policy, unless a longer retention period is required by law.
                                    Conversation data is retained for 90 days unless you request earlier deletion.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-6 h-6 text-emerald-400" />
                                    <h2 className="text-lg font-bold text-white">Contact Us</h2>
                                </div>
                                <p className="text-slate-400 mb-4">
                                    If you have questions about this Privacy Policy or wish to exercise your rights:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p className="text-slate-300"><strong className="text-white">Email:</strong> privacy@saudiai.sa</p>
                                    <p className="text-slate-300"><strong className="text-white">Address:</strong> Riyadh, Saudi Arabia</p>
                                    <p className="text-slate-300"><strong className="text-white">Data Protection Officer:</strong> dpo@saudiai.sa</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
