import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import ErrorBoundary from "./components/ErrorBoundary";
import "./globals.css";

// Type workarounds for Next.js 14 component issues
const ProvidersAny = Providers as any;
const ErrorBoundaryAny = ErrorBoundary as any;

// Initialize fonts
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Saudi Vision 2030 Intelligence Hub',
    default: 'Saudi Vision 2030 Intelligence Hub | Enterprise AI',
  },
  description: "The official Enterprise Artificial Intelligence Platform for Saudi Vision 2030. Powered by advanced RAG and Bilingual AI.",
  metadataBase: new URL('https://saudivision2030.ai'), // Placeholder domain
  keywords: ['Saudi Arabia', 'Vision 2030', 'AI', 'Enterprise', 'RAG', 'Intelligence', 'Government'],
  authors: [{ name: 'Saudi Vision 2030 Intelligence Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saudivision2030.ai',
    title: 'Saudi Vision 2030 Intelligence Hub',
    description: 'Experience the future of government intelligence with the Saudi Vision 2030 AI Platform.',
    siteName: 'Saudi Vision 2030',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saudi Vision 2030 AI Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saudi Vision 2030 Intelligence Hub',
    description: 'The most advanced AI platform for Saudi Enterprise.',
    creator: '@SaudiVision2030',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

import { LanguageProvider } from "./context/LanguageContext";

// ... previous imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-accent/30">
        <ErrorBoundaryAny>
          <ProvidersAny>
            <LanguageProvider>
              <div className="relative z-10 flex-1 flex flex-col">
                {children}
              </div>
            </LanguageProvider>
          </ProvidersAny>
        </ErrorBoundaryAny>
      </body>
    </html>
  );
}
