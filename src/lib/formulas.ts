export interface FormulaInfo {
  id: string;
  name: string;
  paper: string;
  description: string;
}

export function matchFormula(text: string): FormulaInfo | null {
  // Dummy implementation for build
  return null;
}
