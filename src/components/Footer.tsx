'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { getBasePath, getLangFromPathname, getPerspectiveFromPathname } from '@/lib/site';
import { BrandMark } from './BrandMark';

// RTL languages
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

export function Footer() {
  const pathname = usePathname();
  const lang = getLangFromPathname(pathname, 'en');
  const perspective = getPerspectiveFromPathname(pathname);
  const basePath = getBasePath(lang, perspective);
  const isRTL = RTL_LANGUAGES.includes(lang);
  const dict = getDictionary(lang);

  return (
    <footer className={`border-t border-frc-blue mt-auto ${isRTL ? 'font-farsi' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BrandMark alt="FRC" width={24} height={24} className="opacity-85" />
              <span className="text-frc-gold text-base font-medium tracking-tight">
                Fractal Resonance Coherence
              </span>
            </div>
            <p className="text-frc-text-dim text-sm leading-relaxed max-w-md mb-5">
              {dict.footer.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-frc-steel">
              <span>Hadi Servat</span>
              <span className="text-frc-blue" aria-hidden="true">/</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-medium text-frc-text mb-4">{dict.footer.navigate}</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${basePath}/start-here`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.startHere}</Link>
              <Link href={`${basePath}/papers`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.papers}</Link>
              <Link href={`${basePath}/books`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.books}</Link>
              <Link href={`${basePath}/falsifications`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.falsifications}</Link>
              <Link href={`${basePath}/articles`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.articles}</Link>
              <Link href={`${basePath}/blog`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.blog}</Link>
              <Link href={`${basePath}/formulas`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.formulas}</Link>
              <Link href={`${basePath}/about`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.about}</Link>
            </div>
          </div>

          {/* External */}
          <div>
            <p className="text-sm font-medium text-frc-text mb-4">{dict.footer.external}</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${basePath}/join`} className="text-frc-text-dim hover:text-frc-gold">
                {dict.nav.join}
              </Link>
              <a href="https://zenodo.org/communities/frc" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Zenodo
              </a>
              <a href="https://orcid.org/0009-0004-7412-5129" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ORCID
              </a>
              <a href="https://www.researchgate.net/profile/Hadi-Servat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                ResearchGate
              </a>
              <a href="https://github.com/servathadi/fractalresonance" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                GitHub
              </a>
              <Link href="/for-ai" className="text-frc-text-dim hover:text-frc-gold">
                For AI / llms.txt
              </Link>
              <a href={`/${lang}/feed.xml`} className="text-frc-text-dim hover:text-frc-gold inline-flex items-center gap-1.5">
                RSS
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom colophon */}
      <div className="border-t border-frc-blue/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-sm text-frc-steel">
          <span className="font-mono text-[0.8125rem]" dir="ltr">
            dS + k* d ln C = 0
          </span>
          <div className="flex items-center gap-5 text-[0.8125rem]">
            <Link href={`${basePath}/privacy`} className="hover:text-frc-gold">
              {dict.footer.privacy}
            </Link>
            <Link href={`${basePath}/terms`} className="hover:text-frc-gold">
              {dict.footer.terms}
            </Link>
            <span className="tabular-nums">
              FRC {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
