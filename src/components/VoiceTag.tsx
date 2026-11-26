export function VoiceTag({ voice }: { voice?: string }) {
  if (!voice) return null;

  const norm = voice.trim().toLowerCase();
  // Internal persona labels (Kasra / River) are not published on the public site.
  if (norm === 'river' || norm === 'kasra') return null;

  return (
    <span className="font-mono text-[0.8125rem] text-frc-steel">
      {voice}
    </span>
  );
}
