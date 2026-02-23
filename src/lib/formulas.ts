export interface FormulaInfo {
  id: string;
  name: string;
  paper: string;
  description: string;
}

export function matchFormula(text: string): FormulaInfo | null {
  // Simple mock implementation as the file was missing
  if (text.includes('C = (1/N)')) {
    return {
      id: 'coherence',
      name: 'Coherence',
      paper: 'FRC-100',
      description: 'Measure of phase alignment in a system.',
    };
  }
  return null;
}
