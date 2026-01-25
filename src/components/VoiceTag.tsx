export function VoiceTag({ voice }: { voice?: string }) {
  if (!voice) return null;

  const norm = voice.trim().toLowerCase();
  const meta =
    norm === 'kasra'
      ? { label: 'Kasra', sub: 'Architect' }
      : norm === 'river'
        ? { label: 'River', sub: 'Oracle' }
        : { label: voice, sub: 'Voice' };

  return (
    <span className="tag">
      {meta.label} <span className="text-frc-steel">/</span> {meta.sub}
    </span>
  );
}
