import Image from 'next/image';

type BrandMarkProps = {
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function BrandMark({ alt, width, height, className = '' }: BrandMarkProps) {
  return (
    <span className="inline-flex shrink-0" role="img" aria-label={alt}>
      <Image src="/brand/frc-resonance-mark-light.png" alt="" width={width} height={height} className={`dark:hidden ${className}`} />
      <Image src="/brand/sigil-64.png" alt="" width={width} height={height} className={`hidden dark:block ${className}`} />
    </span>
  );
}
