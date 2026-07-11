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
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BrandMark alt="FRC" width={24} height={24} className="opacity-70" />
              <span className="text-frc-gold text-sm font-medium tracking-wide">
                Fractal Resonance Coherence
              </span>
            </div>
            <p className="text-frc-text-dim text-xs leading-relaxed max-w-sm mb-4">
              {dict.footer.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-frc-steel">
              <span>Hadi Servat</span>
              <span className="text-frc-blue">|</span>
              <span>CC BY-NC-ND 4.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{dict.footer.navigate}</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${basePath}/about`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.about}</Link>
              <Link href={`${basePath}/articles`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.articles}</Link>
              <Link href={`${basePath}/blog`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.blog}</Link>
              <Link href={`${basePath}/topics`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.topics}</Link>
              <Link href={`${basePath}/tags`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.tags}</Link>
              <Link href={`${basePath}/people`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.people}</Link>
              <Link href={`${basePath}/papers`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.papers}</Link>
              <Link href={`${basePath}/formulas`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.formulas}</Link>
              <Link href={`${basePath}/positioning`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.positioning}</Link>
              <Link href={`${basePath}/mu-levels`} className="text-frc-text-dim hover:text-frc-gold">{dict.nav.muLevels}</Link>
            </div>
          </div>

          {/* External */}
          <div>
            <p className="font-mono text-[0.625rem] text-frc-steel uppercase tracking-widest mb-4">{dict.footer.external}</p>
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
              <a href="https://independent.academia.edu/HadiServat" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                Academia.edu
              </a>
              <a href="https://github.com/servathadi/fractalresonance" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                GitHub
              </a>
              <a href="https://notebooklm.google.com/notebook/c2da28c7-5c58-4904-9807-807584bd7f13" target="_blank" rel="noopener noreferrer" className="text-frc-text-dim hover:text-frc-gold">
                {dict.nav.askAi} (NotebookLM)
              </a>
              <a href="/llms.txt" className="text-frc-text-dim hover:text-frc-gold">
                llms.txt
              </a>
              <a href={`/${lang}/feed.xml`} className="text-frc-text-dim hover:text-frc-gold flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
                </svg>
                RSS
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-frc-blue/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider" dir="ltr">
            dS + k* d ln C = 0
          </span>
          <div className="flex items-center gap-4">
            <Link href={`${basePath}/privacy`} className="font-mono text-[0.5625rem] text-frc-steel hover:text-frc-gold tracking-wider">
              {dict.footer.privacy}
            </Link>
            <Link href={`${basePath}/terms`} className="font-mono text-[0.5625rem] text-frc-steel hover:text-frc-gold tracking-wider">
              {dict.footer.terms}
            </Link>
            <span className="font-mono text-[0.5625rem] text-frc-steel tracking-wider">
              FRC {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
