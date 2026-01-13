'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-mesh noise-texture">
            {/* Floating Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl floating"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Hero */}
            <section className="relative py-32">
                <div className="container-professional relative z-10 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="animate-fade-in-down mb-6">
                            <span className="badge-neon inline-flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Legal & Privacy
                            </span>
                        </div>
                        <h1 className="text-display text-gradient mb-6 animate-scale-in">
                            Privacy Policy
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
                            <h2 className="text-heading-2 text-gradient mb-4">Introduction</h2>
                            <p className="text-body text-muted-foreground leading-relaxed">
                                Saudi AI Enterprise ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI platform and services.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div className="animate-fade-in-up delay-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">Information We Collect</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <div>
                                    <h3 className="text-heading-3 mb-2">Personal Information</h3>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Name and email address</li>
                                        <li>Account credentials</li>
                                        <li>Profile information</li>
                                        <li>Communication preferences</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-heading-3 mb-2">Usage Information</h3>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                        <li>Chat conversations and queries</li>
                                        <li>Uploaded documents</li>
                                        <li>Feature usage patterns</li>
                                        <li>Device and browser information</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="animate-fade-in-up delay-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">How We Use Your Information</h2>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-15">
                                <li>Provide and improve our AI services</li>
                                <li>Personalize your experience</li>
                                <li>Process your requests and transactions</li>
                                <li>Send important updates and notifications</li>
                                <li>Ensure platform security and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>

                        {/* Data Protection */}
                        <div className="animate-fade-in-up delay-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">Data Protection & Security</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <p className="text-muted-foreground">
                                    We implement industry-leading security measures to protect your data:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>End-to-end encryption for all data transmission</li>
                                    <li>Secure data storage in Saudi Arabia</li>
                                    <li>Regular security audits and penetration testing</li>
                                    <li>PII (Personally Identifiable Information) redaction</li>
                                    <li>Access controls and authentication</li>
                                    <li>ISO 27001 certified infrastructure</li>
                                </ul>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div className="animate-fade-in-up delay-400">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-heading-2">Your Rights</h2>
                            </div>
                            <div className="space-y-4 ml-15">
                                <p className="text-muted-foreground">
                                    Under GDPR and Saudi data protection laws, you have the right to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Access:</strong> Request copies of your personal data</li>
                                    <li><strong>Rectification:</strong> Correct inaccurate information</li>
                                    <li><strong>Erasure:</strong> Request deletion of your data</li>
                                    <li><strong>Portability:</strong> Transfer your data to another service</li>
                                    <li><strong>Objection:</strong> Object to certain data processing</li>
                                    <li><strong>Restriction:</strong> Limit how we use your data</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Retention */}
                        <div className="animate-fade-in-up delay-500">
                            <h2 className="text-heading-2 mb-4">Data Retention</h2>
                            <p className="text-muted-foreground">
                                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Conversation data is retained for 90 days unless you request earlier deletion.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="animate-fade-in-up delay-600">
                            <div className="glass-card p-6 bg-primary/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-6 h-6 text-primary" />
                                    <h2 className="text-heading-3">Contact Us</h2>
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    If you have questions about this Privacy Policy or wish to exercise your rights:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> privacy@saudiai.sa</p>
                                    <p><strong>Address:</strong> Riyadh, Saudi Arabia</p>
                                    <p><strong>Data Protection Officer:</strong> dpo@saudiai.sa</p>
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
