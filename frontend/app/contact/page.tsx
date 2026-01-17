'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.target as HTMLFormElement;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/v1/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: (form.elements[0] as HTMLInputElement).value,
                    last_name: (form.elements[1] as HTMLInputElement).value,
                    email: (form.elements[2] as HTMLInputElement).value,
                    message: (form.elements[3] as HTMLTextAreaElement).value
                }),
            });

            if (!response.ok) throw new Error('Submission failed');

            toast.success("Message sent successfully! We will contact you soon.", {
                duration: 5000,
                icon: '📨'
            });
            form.reset();
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: MapPin,
            title: "Visit Us",
            primary: "King Abdullah Financial District",
            secondary: "Riyadh 13519, Saudi Arabia",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: Mail,
            title: "Email Us",
            primary: "support@vision2030.ai",
            secondary: "partnerships@vision2030.ai",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Phone,
            title: "Call Us",
            primary: "+966 11 123 4567",
            secondary: "Sun-Thu, 9am - 5pm AST",
            color: "from-purple-500 to-purple-600"
        }
    ];

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Get in Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Let's Build the Future
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                                Together
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Connect with the Vision 2030 Intelligence Team for partnerships,
                            data access, or technical support.
                        </p>
                    </motion.div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {contactMethods.map((method, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <method.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{method.title}</h3>
                                <p className="text-emerald-400 font-medium">{method.primary}</p>
                                <p className="text-slate-500 text-sm">{method.secondary}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="relative pb-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Send us a message
                            </h2>
                            <p className="text-slate-400">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                                        placeholder="Mohammed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                                        placeholder="Al-Saud"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500 resize-none"
                                    placeholder="How can we help you achieve your Vision 2030 goals?"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-3 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Response Time Note */}
                        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Average response time: 24 hours</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
