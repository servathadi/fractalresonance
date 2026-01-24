import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fractal Resonance Coherence',
  description: 'Research platform for the Fractal Resonance Coherence framework — exploring consciousness, coherence, and quantum foundations.',
  keywords: ['FRC', 'fractal resonance', 'coherence', 'consciousness', 'quantum mechanics', 'entropy'],
  authors: [{ name: 'Hadi Servat' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
