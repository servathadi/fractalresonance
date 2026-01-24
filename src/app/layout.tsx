import type { Metadata } from 'next';
import { SchemaScript } from '@/components/SchemaScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TextSharePopover } from '@/components/TextSharePopover';
import { schemaSiteGraph, schemaDataset } from '@/lib/schema';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fractal Resonance Coherence',
    template: '%s | FRC',
  },
  description: 'Research platform for the Fractal Resonance Coherence framework — exploring consciousness, coherence, and quantum foundations.',
  keywords: ['FRC', 'fractal resonance', 'coherence', 'consciousness', 'quantum mechanics', 'entropy', 'reciprocity'],
  authors: [{ name: 'Hadi Servat' }],
  metadataBase: new URL('https://fractalresonance.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Fractal Resonance Coherence',
    title: 'Fractal Resonance Coherence',
    description: 'Research platform exploring the reciprocal relationship between entropy and coherence.',
    images: [{ url: '/brand/banner.jpg', width: 1024, height: 572 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fractal Resonance Coherence',
    description: 'Research platform exploring the reciprocal relationship between entropy and coherence.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/brand/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/brand/logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <SchemaScript data={schemaSiteGraph()} />
        <SchemaScript data={schemaDataset()} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <TextSharePopover />
        </ThemeProvider>
      </body>
    </html>
  );
}
