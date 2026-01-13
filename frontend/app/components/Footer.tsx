import { Twitter, Linkedin, Youtube, Instagram, Globe, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

import toast from 'react-hot-toast';

export default function Footer() {
  const { t, language } = useLanguage();

  const footerLinks = {
    projects: [
      { name: t('Project1Title'), href: 'https://www.neom.com' },
      { name: t('Project2Title'), href: 'https://www.redseaglobal.com' },
      { name: t('Project3Title'), href: 'https://qiddiya.com' },
      { name: t('Project4Title'), href: 'https://www.roshn.sa' },
      { name: 'Soudah Peaks', href: 'https://soudah.sa' }, // Bonus
      { name: 'Diriyah Gate', href: 'https://dgda.gov.sa' }, // Bonus
    ],
    resources: [
      { name: t('ResCatEco'), href: '/resources' },
      { name: t('ResCatSoc'), href: '/resources' },
      { name: t('ResCatEnv'), href: '/resources' },
      { name: t('ResCatTech'), href: '/resources' },
    ],
    government: [
      { name: 'Vision 2030 Official', href: 'https://www.vision2030.gov.sa' },
      { name: 'PIF', href: 'https://www.pif.gov.sa' },
      { name: 'Data & AI Authority (SDAIA)', href: 'https://sdaia.gov.sa' },
      { name: 'Ministry of Tourism', href: 'https://mt.gov.sa' },
    ]
  };

  return (
    <footer className="bg-[#022c22] text-white pt-24 pb-0 relative overflow-hidden font-sans">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-saudi/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Section: Newsletter & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-white/5 pb-16 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-saudi to-emerald-800 rounded-xl flex items-center justify-center border border-emerald-400/20 shadow-lg shadow-emerald-900/50">
                <span className="font-serif text-3xl font-bold text-white">V</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight">Vision 2030</span>
                <span className="block text-xs uppercase tracking-[0.2em] text-gold-saudi font-semibold">Intelligence Hub</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md text-lg">
              {t('FooterTagline')}
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col items-start lg:items-end justify-center">
            <div className="max-w-lg w-full bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-saudi/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-gold-saudi/20" />

              <h5 className="font-bold text-xl mb-2 flex items-center gap-2">
                {t('Subscribe')} <Sparkles className="w-4 h-4 text-gold-saudi" />
              </h5>
              <p className="text-slate-400 text-sm mb-6">Join 50,000+ subscribers for the latest Kingdom updates.</p>

              <div className="flex gap-2 relative">
                <input
                  id="email-sub"
                  type="email"
                  placeholder={t('EmailPlaceholder')}
                  className="w-full bg-black/20 border border-white/10 px-5 py-4 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  onClick={() => {
                    (document.getElementById('email-sub') as HTMLInputElement).value = '';
                    toast.success(t('SubscribedSuccess') || "Welcome to the future! 🚀");
                  }}
                  className="bg-emerald-saudi hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center gap-2"
                >
                  {t('SubscribeBtn')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-20">
          {/* Column 1 */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-white mb-8 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold-saudi" /> {t('Projects')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {footerLinks.projects.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors text-sm py-1 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 group-hover:bg-emerald-500 transition-colors" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-white mb-8">{t('Resources')}</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 hover:text-gold-saudi transition-colors text-sm block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-white mb-8">Government</h4>
            <ul className="space-y-4">
              {footerLinks.government.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Socials */}
          <div>
            <h4 className="font-bold text-white mb-8">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: Twitter, href: "https://twitter.com/SaudiVision2030", color: "hover:bg-[#1DA1F2]" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/saudi-vision-2030", color: "hover:bg-[#0077b5]" },
                { Icon: Youtube, href: "https://www.youtube.com/user/SaudiVision2030", color: "hover:bg-[#FF0000]" },
                { Icon: Instagram, href: "https://www.instagram.com/saudivision2030/", color: "hover:bg-[#E1306C]" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 ${item.color} hover:text-white transition-all transform hover:-translate-y-1`}
                >
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/20 backdrop-blur-md py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium">© 2030 Vision Intelligence Hub. {t('RightsReserved')}</p>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400 font-medium">
            <Link href="/privacy" className="hover:text-emerald-saudi transition-colors">{t('PrivacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-emerald-saudi transition-colors">{t('TermsOfService')}</Link>
            <Link href="#" className="hover:text-emerald-saudi transition-colors">Accessibility</Link>
            <div className="flex items-center gap-2 border-l border-white/10 pl-6 rtl:border-r rtl:border-l-0 rtl:pr-6 rtl:pl-0 text-white">
              <Globe size={14} className="text-emerald-saudi" />
              <span>Kingdom of Saudi Arabia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
