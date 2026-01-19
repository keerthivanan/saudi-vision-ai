'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import ChatPreview from './components/ChatPreview';
import Metrics from './components/Metrics';
import Projects from './components/Projects';
import KnowledgeBase from './components/KnowledgeBase';
import Footer from './components/Footer';
import ProfileCard from './components/ProfileCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />



      <Pillars />
      <ChatPreview />
      <Metrics />
      <Projects />
      <KnowledgeBase />

      {/* 🔹 Creator Section - Added by Request */}
      <section className="relative z-10 py-20 flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-black/5">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-lg">
            Architected By
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">The Visionary Behind the Code</p>
        </div>
        <div className="flex justify-center scale-110">
          <ProfileCard />
        </div>
      </section>
      <Footer />
    </main>
  );
}
