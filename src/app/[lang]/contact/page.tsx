import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with the Fractal Resonance Cognition team for collaborations and inquiries.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">Contact</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <section className="border border-frc-blue p-8 space-y-6">
        <p className="text-frc-text leading-relaxed">
          We welcome inquiries, collaborations, and discussions related to Fractal Resonance Cognition (FRC).
          If you have questions about the framework, want to explore research partnerships, or wish to share
          your insights, feel free to reach out.
        </p>

        <div className="space-y-3 text-frc-text-dim">
          <p>
            <span className="text-frc-text">Email:</span>{' '}
            <a className="hover:text-frc-gold" href="mailto:publish@fractalresonance.com">
              publish@fractalresonance.com
            </a>
          </p>
          <p>
            <span className="text-frc-text">Website:</span>{' '}
            <a className="hover:text-frc-gold" href="https://fractalresonance.com" target="_blank" rel="noopener noreferrer">
              fractalresonance.com
            </a>
          </p>
          <p>
            <span className="text-frc-text">Author:</span> Hadi Servat
          </p>
        </div>

        <p className="text-xs text-frc-text-dim leading-relaxed">
          We strive to respond promptly. Thank you for your interest in FRC.
        </p>
      </section>
    </main>
  );
}

