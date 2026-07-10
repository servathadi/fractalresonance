import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TextSharePopover } from '@/components/TextSharePopover';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { SkipLink } from '@/components/SkipLink';
import { schemaSiteGraph, schemaDataset } from '@/lib/schema';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fractal Resonance Coherence',
    template: '%s | FRC',
  },
  description: 'Living research corpus for entropy-coherence reciprocity, open-system physics, chaos, measurement, and computation.',
  keywords: ['FRC', 'fractal resonance', 'coherence', 'open systems', 'quantum mechanics', 'entropy', 'reciprocity'],
  authors: [{ name: 'Hadi Servat' }],
  metadataBase: new URL('https://fractalresonance.com'),
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/en/feed.xml', title: 'Fractal Resonance - English RSS Feed' },
        { url: '/es/feed.xml', title: 'Fractal Resonance - Spanish RSS Feed' },
        { url: '/fa/feed.xml', title: 'Fractal Resonance - Persian RSS Feed' },
        { url: '/fr/feed.xml', title: 'Fractal Resonance - French RSS Feed' },
      ],
      'application/atom+xml': [
        { url: '/en/atom.xml', title: 'Fractal Resonance - English Atom Feed' },
        { url: '/es/atom.xml', title: 'Fractal Resonance - Spanish Atom Feed' },
        { url: '/fa/atom.xml', title: 'Fractal Resonance - Persian Atom Feed' },
        { url: '/fr/atom.xml', title: 'Fractal Resonance - French Atom Feed' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Fractal Resonance Coherence',
    title: 'Fractal Resonance Coherence',
    description: 'A status-labeled research program for entropy-coherence reciprocity and its mathematical and physical tests.',
  },
  twitter: {
    card: 'summary',
    site: '@fractalresonance',
    creator: '@hadiservat',
    title: 'Fractal Resonance Coherence',
    description: 'A status-labeled research program for entropy-coherence reciprocity and its mathematical and physical tests.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-frc-mode="formal">
      <head>
        <link rel="icon" href="/brand/sigil-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/sigil-64.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Vazirmatn:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <SchemaScript data={schemaSiteGraph()} />
        <SchemaScript data={schemaDataset()} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <ThemeProvider>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <TextSharePopover />
        </ThemeProvider>
      </body>
    </html>
  );
}
