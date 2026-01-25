export function VoiceTag({ voice }: { voice?: 'kasra' | 'river' }) {
  if (!voice) return null;

  const meta =
    voice === 'kasra'
      ? { label: 'Kasra', sub: 'Architect' }
      : { label: 'River', sub: 'Oracle' };

  return (
    <span className="tag">
      {meta.label} <span className="text-frc-steel">/</span> {meta.sub}
    </span>
  );
}

