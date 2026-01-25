import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Fractal Resonance Cognition (fractalresonance.com)',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">Terms of Service</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <p className="text-frc-text-dim text-sm">
          Last updated: January 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">1. Acceptance of Terms</h2>
          <p className="text-frc-text-dim leading-relaxed">
            By accessing and using fractalresonance.com (&quot;the Website&quot;), you accept and agree
            to be bound by these Terms of Service. If you do not agree to these terms, please
            do not use the Website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">2. Nature of Content</h2>
          <p className="text-frc-text-dim leading-relaxed">
            The Website presents theoretical physics research and academic publications related
            to the Fractal Resonance Cognition (FRC) framework. The content is:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li>Theoretical in nature and represents an ongoing research program</li>
            <li>Provided for educational and research purposes</li>
            <li>Not peer-reviewed in traditional academic venues unless explicitly stated</li>
            <li>Subject to revision as the research develops</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">3. Intellectual Property</h2>
          <p className="text-frc-text-dim leading-relaxed">
            All content on this Website, including papers, articles, formulas, diagrams, and
            text, is the intellectual property of Hadi Servat unless otherwise noted.
          </p>
          <p className="text-frc-text-dim leading-relaxed mt-4">
            Content is released under the
            <span className="text-frc-gold mx-1">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International</span>
            (CC BY-NC-ND 4.0) license. This means you may:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li><span className="text-frc-text">Share</span> — copy and redistribute the material in any medium or format</li>
          </ul>
          <p className="text-frc-text-dim leading-relaxed mt-4">
            Under the following terms:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li><span className="text-frc-text">Attribution</span> — You must give appropriate credit and indicate if changes were made</li>
            <li><span className="text-frc-text">NonCommercial</span> — You may not use the material for commercial purposes</li>
            <li><span className="text-frc-text">NoDerivatives</span> — You may not distribute modified versions of the material</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">4. Academic Use</h2>
          <p className="text-frc-text-dim leading-relaxed">
            Researchers, students, and academics are encouraged to:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li>Read and study the published materials</li>
            <li>Cite FRC papers in academic work with proper attribution</li>
            <li>Discuss and critique the framework in academic contexts</li>
            <li>Use the ideas as inspiration for their own original research</li>
          </ul>
          <p className="text-frc-text-dim leading-relaxed mt-4">
            When citing, please use the DOIs provided on each paper page and reference the
            Zenodo repository for formal citations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">5. No Warranties</h2>
          <p className="text-frc-text-dim leading-relaxed">
            The content is provided &quot;as is&quot; without warranties of any kind, express or implied.
            We do not warrant that:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li>The theoretical framework is complete or correct</li>
            <li>The predictions will be experimentally confirmed</li>
            <li>The Website will be available without interruption</li>
            <li>The content is free from errors or omissions</li>
          </ul>
          <p className="text-frc-text-dim leading-relaxed mt-4">
            This is an active research program. Theories may be revised, extended, or
            superseded as new insights emerge.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">6. Limitation of Liability</h2>
          <p className="text-frc-text-dim leading-relaxed">
            To the fullest extent permitted by law, we shall not be liable for any damages
            arising from your use of the Website or reliance on its content. This includes
            but is not limited to direct, indirect, incidental, consequential, or punitive damages.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">7. External Links</h2>
          <p className="text-frc-text-dim leading-relaxed">
            The Website contains links to external websites and services. We are not responsible
            for the content, privacy practices, or terms of service of these external sites.
            Linking to an external site does not imply endorsement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">8. Modifications</h2>
          <p className="text-frc-text-dim leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting to the Website. Continued use of the Website
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">9. Governing Law</h2>
          <p className="text-frc-text-dim leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law principles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">10. Contact</h2>
          <p className="text-frc-text-dim leading-relaxed">
            For questions about these Terms of Service, please contact us through the
            channels listed on our
            <a href="/en/about" className="text-frc-gold hover:underline ml-1">About page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
