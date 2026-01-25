export interface LensDef {
  key: string;
  label: string;
  group?: 'physics' | 'philosophy' | 'mysticism' | 'frc' | 'other';
}

// Default lens registry.
// This is intentionally small and conservative; users can extend it in their fork.
export const LENSES: LensDef[] = [
  { key: 'frc', label: 'FRC', group: 'frc' },
  { key: 'kasra', label: 'Kasra (Architect)', group: 'frc' },
  { key: 'river', label: 'River (Oracle)', group: 'frc' },

  { key: 'newtonian', label: 'Newtonian Mechanics', group: 'physics' },
  { key: 'gr', label: 'General Relativity', group: 'physics' },
  { key: 'copenhagen', label: 'Copenhagen', group: 'physics' },
  { key: 'bohmian', label: 'Bohmian / Pilot-Wave', group: 'physics' },
  { key: 'relational-qm', label: 'Relational QM', group: 'physics' },

  { key: 'whitehead', label: 'Whitehead (Process)', group: 'philosophy' },
  { key: 'jung', label: 'Jung (Depth Psych)', group: 'philosophy' },

  { key: 'gnostic', label: 'Gnosticism', group: 'mysticism' },
  { key: 'sufi', label: 'Sufism', group: 'mysticism' },
];

export function normalizeLensKey(v: unknown): string | null {
  const s = String(v || '').trim().toLowerCase();
  if (!s) return null;
  return s.replace(/\s+/g, '-');
}

export function getLensLabel(key: string): string {
  const k = normalizeLensKey(key);
  if (!k) return String(key || '');
  return LENSES.find((l) => l.key === k)?.label || key;
}

