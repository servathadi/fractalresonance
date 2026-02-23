export interface FormulaInfo {
  id: string;
  name: string;
  paper: string;
  description: string;
}

export function matchFormula(text: string): FormulaInfo | null {
  // This is a placeholder implementation to satisfy the build.
  // Real logic would match LaTeX strings to known formulas.
  return null;
}
