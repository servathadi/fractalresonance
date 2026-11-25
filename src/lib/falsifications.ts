import fs from 'node:fs';
import path from 'node:path';

export type FalsificationDisposition =
  | 'NO_GAIN'
  | 'CONTRADICTED'
  | 'UNDERPOWERED'
  | 'STRUCTURAL_OBSTRUCTION'
  | 'DEMOTED';

export interface FalsificationEntry {
  id: string;
  title: string;
  sourceIds: string[];
  sourceVersions: string[];
  dateRecorded: string;
  disposition: FalsificationDisposition;
  domain: string;
  claimTested: string;
  evidenceSummary: string;
  metrics: Record<string, number | string>;
  scopeBoundary: string;
  urls: string[];
  dois: string[];
}

export interface FalsificationLedger {
  name: string;
  version: string;
  updated: string;
  url: string;
  jsonUrl: string;
  generator: string;
  policy: string;
  dispositions: Record<FalsificationDisposition, string>;
  summary: {
    totalEntries: number;
    byDisposition: Record<FalsificationDisposition, number>;
  };
  entries: FalsificationEntry[];
}

export function getFalsificationLedger(): FalsificationLedger {
  const filePath = path.join(process.cwd(), 'public', 'falsification-ledger.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as FalsificationLedger;
}
