
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: any }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: '#0F2C23', // Emerald-Saudi Dark
              color: '#fff',
              border: '1px solid #C4A574', // Gold-Saudi
            },
          }} />
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
