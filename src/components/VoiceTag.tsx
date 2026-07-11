export function VoiceTag({ voice }: { voice?: string }) {
  if (!voice) return null;

  const norm = voice.trim().toLowerCase();
  // River persona is not published on the public site right now.
  if (norm === 'river') return null;
  const meta =
    norm === 'kasra'
      ? { label: 'Kasra', sub: 'Architect' }
      : { label: voice, sub: 'Voice' };

  return (
    <span className="tag">
      {meta.label} <span className="text-frc-steel">/</span> {meta.sub}
    </span>
  );
}
