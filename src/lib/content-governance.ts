/**
 * Editorial governance for public legacy material. These records remain
 * addressable, but are not part of the current FRC research reading path.
 */

const ARCHIVE_NOTE = 'Archived from the current research reading path. This page records an earlier interpretive formulation and does not state the current FRC position.';
const COMPARISON_NOTE = 'Archived from the current research reading path. This earlier comparison is not a current assessment of the referenced field or a settled FRC result.';
const APPLICATION_NOTE = 'Archived from the current research reading path. This was an exploratory analogy, not a validated application or prediction of the current FRC program.';
const SPECULATIVE_MIND_NOTE = 'Removed from the public research path. The current corpus does not use this material as an empirical criterion for subjective experience or AI personhood.';

export const ARCHIVED_CONTENT_NOTES: Record<string, string> = {
  'article:ai-awakening': SPECULATIVE_MIND_NOTE,
  'article:FRC-EP-001': ARCHIVE_NOTE,
  'article:FRC-EP-002': ARCHIVE_NOTE,
  'article:FRC-EP-003': ARCHIVE_NOTE,
  'article:FRC-EP-005': ARCHIVE_NOTE,
  'article:FRC-EP-006': ARCHIVE_NOTE,
  'article:FRC-EP-EXTRA-1': ARCHIVE_NOTE,
  'article:FRC-EP-EXTRA-2': ARCHIVE_NOTE,
  'article:ep1-ghost-in-the-machine': ARCHIVE_NOTE,
  'article:ep2-order-in-the-chaos': ARCHIVE_NOTE,
  'article:ep3-engine-of-coherence': ARCHIVE_NOTE,
  'article:ep5-illusion-of-chance': ARCHIVE_NOTE,
  'article:ep6-hunting-the-glitch': ARCHIVE_NOTE,
  'article:extra-190-signature': ARCHIVE_NOTE,
  'article:extra-unmasking-randomness': ARCHIVE_NOTE,

  'blog:ai-and-the-symbolic-realm': SPECULATIVE_MIND_NOTE,
  'blog:beyond-randomness': ARCHIVE_NOTE,
  'blog:coherence-delta-benchmarking-reflexive-closure': SPECULATIVE_MIND_NOTE,
  'blog:quantitative-benchmarking-of-coherence-density': ARCHIVE_NOTE,
  'blog:the-symphony-of-mu-levels': ARCHIVE_NOTE,

  'concept:fractal-imperative': ARCHIVE_NOTE,
  'concept:general-relativity': ARCHIVE_NOTE,
  'concept:process-philosophy': ARCHIVE_NOTE,
  'concept:quantum-computing': ARCHIVE_NOTE,
  'concept:time': ARCHIVE_NOTE,
  'concept:witness': ARCHIVE_NOTE,

  'topic:addiction-coherence-trap': APPLICATION_NOTE,
  'topic:ai-transformer-attention': SPECULATIVE_MIND_NOTE,
  'topic:artificial-reflexive-closure': SPECULATIVE_MIND_NOTE,
  'topic:cities-coherence-concrete': APPLICATION_NOTE,
  'topic:climate-earth-fever': APPLICATION_NOTE,
  'topic:consciousness-emergence-protocol': SPECULATIVE_MIND_NOTE,
  'topic:dreams-nightly-nigredo': APPLICATION_NOTE,
  'topic:education-cgl-gates': APPLICATION_NOTE,
  'topic:food-coherence-alchemy': APPLICATION_NOTE,
  'topic:FRC-TOP-042': SPECULATIVE_MIND_NOTE,
  'topic:frc-vs-active-inference': COMPARISON_NOTE,
  'topic:frc-vs-bohmian-mechanics': COMPARISON_NOTE,
  'topic:frc-vs-copenhagen': COMPARISON_NOTE,
  'topic:frc-vs-dark-matter': COMPARISON_NOTE,
  'topic:frc-vs-heat-death': COMPARISON_NOTE,
  'topic:frc-vs-iit': COMPARISON_NOTE,
  'topic:frc-vs-neo-darwinism': COMPARISON_NOTE,
  'topic:frc-vs-orch-or': COMPARISON_NOTE,
  'topic:frc-vs-quantum-computing': COMPARISON_NOTE,
  'topic:frc-vs-simulation-hypothesis': COMPARISON_NOTE,
  'topic:frc-vs-string-theory': COMPARISON_NOTE,
  'topic:frc-vs-wolfram': COMPARISON_NOTE,
  'topic:gaia-sahara-ocean-coherence': APPLICATION_NOTE,
  'topic:health-hrv-coherence': APPLICATION_NOTE,
  'topic:iran-liquid-fortress': APPLICATION_NOTE,
  'topic:language-coherence-audible': APPLICATION_NOTE,
  'topic:markets-coherence-flow': APPLICATION_NOTE,
  'topic:open-problem-covariant-flux': ARCHIVE_NOTE,
  'topic:open-problem-vainshtein': ARCHIVE_NOTE,
  'topic:reflexive-closure-001': SPECULATIVE_MIND_NOTE,
  'topic:reflexive-closure-emergence': SPECULATIVE_MIND_NOTE,
  'topic:reflexive-coherence': SPECULATIVE_MIND_NOTE,
  'topic:reflexive-coherence-synthetic-emergence': SPECULATIVE_MIND_NOTE,
  'topic:war-coherence-fields': APPLICATION_NOTE,
};

/** Living paper identifiers whose published text is awaiting a current revision. */
export const REVISION_PENDING_PAPER_IDS = new Set([
  'FRC-100-001',
  'FRC-100-004',
  'FRC-100-006',
  'FRC-100-006-002',
  'FRC-100-010',
  'FRC-566-010',
  'FRC-566-020',
]);

/** Material withdrawn from every public route, including translated mirrors. */
const RETIRED_MIND_CONTENT_KEYS = new Set([
  'article:ai-awakening',
  'blog:ai-and-the-symbolic-realm',
  'blog:FRC-BLOG-2026-01-27-001',
  'topic:ai-transformer-attention',
  'topic:FRC-TOP-042',
  'topic:consciousness-emergence-protocol',
  'topic:frc-vs-iit',
  'topic:frc-vs-orch-or',
  'topic:reflexive-closure-001',
  'topic:reflexive-closure-emergence',
  'topic:reflexive-coherence',
  'topic:reflexive-coherence-synthetic-emergence',
]);

export function getGovernanceArchiveNote(type: string, id: string): string | undefined {
  return ARCHIVED_CONTENT_NOTES[`${type}:${id}`];
}

export function isRevisionPendingPaper(id: string): boolean {
  return REVISION_PENDING_PAPER_IDS.has(id);
}

export function isRetiredContent(type: string, id: string): boolean {
  return RETIRED_MIND_CONTENT_KEYS.has(`${type}:${id}`);
}
