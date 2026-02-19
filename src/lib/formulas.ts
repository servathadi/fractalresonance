// Stub implementation to satisfy dependency in MarkdownContent.tsx
// This file is required for the build but formula functionality is minimal.
export interface FormulaInfo {
  id: string;
  name: string;
  paper: string;
  description: string;
}

export const formulas: FormulaInfo[] = [];

export function matchFormula(latex: string): FormulaInfo | undefined {
  return undefined;
}
