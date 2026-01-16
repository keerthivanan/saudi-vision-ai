'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import ChatPreview from './components/ChatPreview';
import Metrics from './components/Metrics';
import Projects from './components/Projects';
import KnowledgeBase from './components/KnowledgeBase';
import Footer from './components/Footer';

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
      <Footer />
    </main>
  );
}
