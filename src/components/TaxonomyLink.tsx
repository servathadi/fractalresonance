import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTaxonomyHref, getTaxonomyLabel } from '@/lib/taxonomy';

interface TaxonomyLinkProps {
  taxon: string;
  basePath: string;
  lang: string;
  className?: string;
  children?: ReactNode;
}

export function TaxonomyLink({ taxon, basePath, lang, className, children }: TaxonomyLinkProps) {
  return (
    <Link href={getTaxonomyHref(basePath, taxon)} className={className}>
      {children || getTaxonomyLabel(taxon, lang)}
    </Link>
  );
}
