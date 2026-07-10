export type MuLevel = 'mu0' | 'mu1' | 'mu2' | 'mu3' | 'mu4' | 'mu5' | 'mu6' | 'mu7';

export interface MuLevelDefinition {
  id: MuLevel;
  symbol: string;
  title: string;
  description: string;
}

export const MU_LEVELS: MuLevelDefinition[] = [
  { id: 'mu0', symbol: 'μ0', title: 'Ground', description: 'The prior ground or background condition from which a declared system is considered.' },
  { id: 'mu1', symbol: 'μ1', title: 'Physical / atomic', description: 'Atoms, fields, quantum systems, thermodynamics, and other physical observables.' },
  { id: 'mu2', symbol: 'μ2', title: 'Cellular / living structure', description: 'Cells, metabolism, physiological organization, and living structural processes.' },
  { id: 'mu3', symbol: 'μ3', title: 'Affective / neural', description: 'Feeling, neural dynamics, and embodied regulation.' },
  { id: 'mu4', symbol: 'μ4', title: 'Logical / conceptual', description: 'Logic, formal models, language as explicit reasoning, and computational design.' },
  { id: 'mu5', symbol: 'μ5', title: 'Archetypal / symbolic', description: 'Symbols, myths, archetypal patterns, and meaning-bearing cultural forms.' },
  { id: 'mu6', symbol: 'μ6', title: 'Witness', description: 'The reflective stance that observes and relates the active registers of a system.' },
  { id: 'mu7', symbol: 'μ7', title: 'Outside the system', description: 'The boundary-shell and its connection to what lies beyond the currently declared system or total context.' },
];

const MU_LEVEL_BY_ID = new Map(MU_LEVELS.map((level) => [level.id, level]));

export function getMuLevel(id: MuLevel | undefined): MuLevelDefinition | undefined {
  return id ? MU_LEVEL_BY_ID.get(id) : undefined;
}
