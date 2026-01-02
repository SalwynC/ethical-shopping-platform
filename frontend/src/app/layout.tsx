import type { Metadata } from 'next';

import './globals.css';
import { Providers } from './providers';
import { AppHeader } from '../components/layout/AppHeader';
import { BackToTop } from '../components/common/BackToTop';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Force dynamic rendering for the entire app
// Note: This applies to server components, client components are already dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use default system fonts to avoid build-time Google Fonts fetch

const title = 'Ethical Shopping Intelligence';
const description =
  'AI-assisted ethical shopping companion delivering transparent scores, price guidance, and responsible alternatives.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'ethical shopping',
    'responsible commerce',
    'LLM explanations',
    'price intelligence',
    'sustainable alternatives',
  ],
  authors: [{ name: 'Ethical Shopping Platform' }],
  openGraph: {
    title,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-512x512.png',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ethical-shop.example.com',
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('ethishop-theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const initialTheme = theme || systemTheme;
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`font-sans bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 text-slate-900 dark:text-slate-50 transition-all duration-500 min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>
          <AppHeader />
          <div className="h-14 md:h-16" />
          {children}
          <BackToTop />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
