export interface FormulaInfo {
  id: string;
  paper: string;
  name: string;
  description: string;
}

export function matchFormula(text: string): FormulaInfo | null {
  // Minimal implementation to pass build
  return null;
}
