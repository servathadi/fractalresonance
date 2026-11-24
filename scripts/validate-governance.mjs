#!/usr/bin/env node
/**
 * Public Corpus Governance Check
 * Run: npm run governance:check
 *
 * Verifies:
 *   1. FRC 700.777 is archived as superseded historical/origin material and routed to FRC 700.000–700.007.
 *   2. FRC 700.000–700.007 are published framework preprints with status labels.
 *   3. FRC 830.000–830.005 are published preprints with status labels and no-promotion language.
 *   4. Revision-pending living identifiers declare publicationState: revision pending.
 *   5. Retired mind-content records and archived/revision-pending papers are excluded from active search/discovery across all languages.
 *   6. public/catalog.json, public/llms.txt, public/agent.md, and public/agent.json match canonical English frontmatter with zero drift.
 *   7. Cross-language translation metadata/DOI parity and no-stale-claims rules pass across es/fa/fr.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REVISION_PENDING_PAPERS,
  checkAiEntrypoints,
  loadCanonicalPapers,
} from './generate-ai-entrypoints.mjs';
import { ALL_LANGS, validateTranslations } from './validate-translations.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const RETIRED_MIND_CONTENT_IDS = {
  articles: new Set(['ai-awakening']),
  blog: new Set(['ai-and-the-symbolic-realm', 'FRC-BLOG-2026-01-27-001']),
  topics: new Set([
    'ai-transformer-attention',
    'FRC-TOP-042',
    'consciousness-emergence-protocol',
    'frc-vs-iit',
    'frc-vs-orch-or',
    'reflexive-closure-001',
    'reflexive-closure-emergence',
    'reflexive-coherence',
    'reflexive-coherence-synthetic-emergence',
  ]),
};

function readJson(relPath, errors) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`${relPath} is missing.`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    errors.push(`${relPath} is invalid JSON: ${err.message}`);
    return null;
  }
}

function main() {
  console.log('Governance Check: Verifying FRC public corpus governance...\n');
  const errors = [];

  const papers = loadCanonicalPapers(ROOT);
  const byId = new Map(papers.map((p) => [p.id, p]));

  // 1. FRC 700.777 superseded historical/origin governance
  const origin777 = byId.get('FRC-700-777');
  if (!origin777) {
    errors.push('FRC-700-777 must remain addressable as archived historical provenance.');
  } else {
    if (origin777.publicationState !== 'archived') {
      errors.push(`FRC-700-777 must have publicationState="archived" (got ${JSON.stringify(origin777.publicationState)}).`);
    }
    if (origin777.canonStatus !== 'archive') {
      errors.push(`FRC-700-777 must have canonStatus="archive" (got ${JSON.stringify(origin777.canonStatus)}).`);
    }
    if (origin777.epistemicStatus !== 'archive') {
      errors.push(`FRC-700-777 must have epistemicStatus="archive" (got ${JSON.stringify(origin777.epistemicStatus)}).`);
    }
    if (!String(origin777.supersededBy || '').includes('FRC-700-000') || !String(origin777.supersededBy || '').includes('FRC-700-007')) {
      errors.push('FRC-700-777 must declare supersededBy pointing to FRC-700-000 through FRC-700-007.');
    }
  }

  // 2. Active FRC 700.000–700.007 threshold-framework route
  for (let i = 0; i <= 7; i += 1) {
    const id = `FRC-700-${String(i).padStart(3, '0')}`;
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing active threshold-framework paper ${id}.`);
      continue;
    }
    if (p.canonStatus !== 'framework') {
      errors.push(`${id} must have canonStatus="framework" (got ${JSON.stringify(p.canonStatus)}).`);
    }
    if (p.publicationState !== 'preprint') {
      errors.push(`${id} must have publicationState="preprint" (got ${JSON.stringify(p.publicationState)}).`);
    }
    if (!p.statusLabel) {
      errors.push(`${id} is missing frontmatter statusLabel.`);
    }
  }

  // 3. Active FRC 830.000–830.005 Reciprocity Mathematics series
  for (let i = 0; i <= 5; i += 1) {
    const id = `FRC-830-${String(i).padStart(3, '0')}`;
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing active Reciprocity Mathematics paper ${id}.`);
      continue;
    }
    if (p.publicationState !== 'preprint') {
      errors.push(`${id} must have publicationState="preprint" (got ${JSON.stringify(p.publicationState)}).`);
    }
    if (!p.statusLabel) {
      errors.push(`${id} is missing frontmatter statusLabel.`);
    }
  }

  // 4. Revision-pending living identifiers (validate raw frontmatter before normalization)
  for (const id of REVISION_PENDING_PAPERS) {
    const p = byId.get(id);
    if (!p) {
      errors.push(`Missing revision-pending paper ${id}.`);
      continue;
    }
    if (String(p.rawPublicationState || '').toLowerCase() !== 'revision pending') {
      errors.push(
        `${id} frontmatter must declare publicationState="revision pending" (got ${JSON.stringify(p.rawPublicationState)}).`,
      );
    }
  }

  // 5. Catalog and search-index governance hygiene (all languages)
  const catalog = readJson('public/catalog.json', errors);
  if (catalog?.content) {
    for (const [lang, byType] of Object.entries(catalog.content)) {
      if (byType.papers?.some((p) => p.id === 'FRC-000-START-HERE')) {
        errors.push(`public/catalog.json (${lang}) must not include superseded alias FRC-000-START-HERE.`);
      }
      for (const [type, retiredSet] of Object.entries(RETIRED_MIND_CONTENT_IDS)) {
        const leaked = (byType[type] || []).filter((item) => retiredSet.has(item.id));
        for (const item of leaked) {
          errors.push(`public/catalog.json (${lang}/${type}) leaks retired content ${item.id}.`);
        }
      }
    }
  }

  for (const relPath of ['public/search-index.json', ...ALL_LANGS.map((l) => `public/search-index-${l}.json`)]) {
    const searchIndex = readJson(relPath, errors);
    if (Array.isArray(searchIndex?.documents)) {
      for (const doc of searchIndex.documents) {
        if (doc.type === 'papers' && doc.id === 'FRC-700-777') {
          errors.push(`${relPath} must exclude archived origin note FRC-700-777.`);
        }
        if (doc.type === 'papers' && doc.id === 'FRC-000-START-HERE') {
          errors.push(`${relPath} must exclude superseded alias FRC-000-START-HERE.`);
        }
        if (doc.type === 'papers' && REVISION_PENDING_PAPERS.has(String(doc.id).toUpperCase())) {
          errors.push(`${relPath} must exclude revision-pending paper ${doc.id}.`);
        }
        if (RETIRED_MIND_CONTENT_IDS[doc.type]?.has(doc.id)) {
          errors.push(`${relPath} leaks retired content ${doc.type}:${doc.id}.`);
        }
      }
    }
  }

  // 6. AI entrypoints + catalog parity and semantic governance
  const drift = checkAiEntrypoints(ROOT);
  if (!drift.ok) {
    errors.push(...drift.errors);
  }

  const agentJson = readJson('public/agent.json', errors);
  if (agentJson) {
    const primaryIds = new Set((agentJson.primary_route || []).map((p) => p.id));
    const thresholdIds = new Set((agentJson.threshold_route || []).map((p) => p.id));
    const frontierIds = new Set((agentJson.frontier_route || []).map((p) => p.id));
    const recIds = new Set((agentJson.reciprocity_mathematics_route || []).map((p) => p.id));
    const supersededIds = new Set((agentJson.superseded_origin_material || []).map((p) => p.id));

    if (primaryIds.has('FRC-700-777') || thresholdIds.has('FRC-700-777') || frontierIds.has('FRC-700-777')) {
      errors.push('public/agent.json must not present FRC-700-777 in active primary, threshold, or frontier routes.');
    }
    if (!supersededIds.has('FRC-700-777')) {
      errors.push('public/agent.json must record FRC-700-777 under superseded_origin_material.');
    }
    for (let i = 0; i <= 7; i += 1) {
      const id = `FRC-700-${String(i).padStart(3, '0')}`;
      if (!thresholdIds.has(id)) {
        errors.push(`public/agent.json threshold_route is missing ${id}.`);
      }
    }
    for (let i = 0; i <= 5; i += 1) {
      const id = `FRC-830-${String(i).padStart(3, '0')}`;
      if (!recIds.has(id)) {
        errors.push(`public/agent.json reciprocity_mathematics_route is missing ${id}.`);
      }
    }
    if (agentJson.canon?.reciprocity_mathematics?.no_promotion !== true) {
      errors.push('public/agent.json must explicitly record no_promotion: true for FRC 830.');
    }
  }

  // 7. Cross-language translation parity & DOI hygiene
  const trResult = validateTranslations(ROOT);
  if (!trResult.ok) {
    errors.push(...trResult.errors);
  }

  if (errors.length > 0) {
    console.error(`✗ Governance check FAILED (${errors.length} issue(s)):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `✓ Governance check PASSED (${papers.length} published English papers, FRC 700/830 boundaries, catalog, search indexes, AI entrypoints, and ${trResult.stats.translatedPapersChecked} translated papers verified).`,
  );
}

main();
