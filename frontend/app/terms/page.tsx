import React from 'react';
import Link from 'next/link';
import { Shield, Scale, Scroll, FileCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-mesh noise-texture">
            {/* Floating Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Hero */}
            <section className="relative py-32">
                <div className="container-professional relative z-10 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="animate-fade-in-down mb-6">
                            <span className="badge-neon inline-flex items-center gap-2">
                                <Scale className="w-4 h-4" />
                                Legal Agreement
                            </span>
                        </div>
                        <h1 className="text-display text-gradient mb-6 animate-scale-in">
                            Terms of Service
                        </h1>
                        <p className="text-body-large text-muted-foreground animate-fade-in-up delay-200">
                            Last updated: January 6, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-professional relative z-10">
                <div className="container-professional max-w-4xl">
                    <div className="glass-card p-12 space-y-12">

                        {/* Introduction */}
                        <div className="animate-fade-in-up">
                            <h2 className="text-heading-2 text-gradient mb-4">Agreement to Terms</h2>
                            <p className="text-body text-muted-foreground leading-relaxed">
                                By accessing or using the Saudi Vision 2030 Enterprise AI Platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                            </p>
                        </div>

                        {/* Usage License */}
                        <div className="animate-fade-in-up delay-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Scroll className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">Use License</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <p className="text-muted-foreground">Permission is granted to temporarily access the materials (information or software) on Saudi AI Enterprise's website for personal, non-commercial transitory viewing only.</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>This is the grant of a license, not a transfer of title.</li>
                                    <li>You may not modify or copy the materials.</li>
                                    <li>You may not use the materials for any commercial purpose.</li>
                                    <li>You may not attempt to reverse engineer any software.</li>
                                </ul>
                            </div>
                        </div>

                        {/* AI Usage */}
                        <div className="animate-fade-in-up delay-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                                    <FileCheck className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">AI Usage Guidelines</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <p className="text-muted-foreground">
                                    Our AI Consultant is designed to provide strategic insights. However:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>You must verify critical information with official sources.</li>
                                    <li>You must not use the AI for illegal or harmful purposes.</li>
                                    <li>We are not liable for decisions made based solely on AI output.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="animate-fade-in-up delay-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">Disclaimer</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <p className="text-muted-foreground">
                                    The materials on Saudi AI Enterprise's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="animate-fade-in-up delay-400">
                            <div className="glass-card p-6 bg-primary/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <HelpCircle className="w-6 h-6 text-primary" />
                                    <h2 className="text-heading-3">Questions?</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about these Terms, please contact us.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> legal@saudiai.sa</p>
                                    <p><strong>Address:</strong> Riyadh, Saudi Arabia</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link href="/" className="glass-card px-6 py-3 rounded-xl font-semibold hover-lift inline-block">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
