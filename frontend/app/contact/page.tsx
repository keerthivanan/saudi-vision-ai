'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/contact`, {
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

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Connect with the Vision 2030 Intelligence Team for partnerships, data access, or technical support.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-midnight-blue text-white rounded-3xl p-10 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />

                        <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-saudi/20 rounded-xl">
                                    <MapPin className="w-6 h-6 text-emerald-saudi" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Headquarters</h3>
                                    <p className="text-slate-300">King Abdullah Financial District (KAFD)<br />Riyadh 13519, Saudi Arabia</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-saudi/20 rounded-xl">
                                    <Mail className="w-6 h-6 text-emerald-saudi" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                                    <p className="text-slate-300">support@vision2030.ai<br />partnerships@vision2030.ai</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-saudi/20 rounded-xl">
                                    <Phone className="w-6 h-6 text-emerald-saudi" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                                    <p className="text-slate-300">+966 11 123 4567<br />Sun-Thu, 9am - 5pm AST</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-saudi/10 rounded-full blur-[80px] -mr-16 -mb-16" />
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100"
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-saudi focus:border-transparent outline-none transition-all" placeholder="Mohammed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-saudi focus:border-transparent outline-none transition-all" placeholder="Al-Saud" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-saudi focus:border-transparent outline-none transition-all" placeholder="name@company.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-saudi focus:border-transparent outline-none transition-all" placeholder="How can we help you achieve your Vision 2030 goals?"></textarea>
                            </div>

                            <button disabled={isSubmitting} className="w-full bg-emerald-saudi hover:bg-emerald-800 disabled:bg-emerald-saudi/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-saudi/30 flex items-center justify-center gap-2">
                                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className={`w-5 h-5 rtl:rotate-180 ${isSubmitting ? 'animate-pulse' : ''}`} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
