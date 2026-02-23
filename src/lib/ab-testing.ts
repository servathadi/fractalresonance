/**
 * Lightweight A/B Testing Framework
 *
 * Usage:
 * 1. Define experiments in EXPERIMENTS config
 * 2. Use useExperiment hook in components
 * 3. Track conversions with trackConversion
 *
 * Variants are assigned consistently per user using localStorage.
 * Events are sent to Google Analytics for analysis.
 */

export interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[]; // Optional weights (default: equal)
  active: boolean;
}

// Define experiments here
export const EXPERIMENTS: Record<string, Experiment> = {
  // Example: test different CTA button text
  // 'cta-text': {
  //   id: 'cta-text',
  //   name: 'CTA Button Text',
  //   variants: ['control', 'variant-a', 'variant-b'],
  //   weights: [0.34, 0.33, 0.33],
  //   active: true,
  // },
};

const STORAGE_KEY = 'frc_ab_variants';

/**
 * Get stored variant assignments
 */
function getStoredVariants(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save variant assignments
 */
function saveVariants(variants: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Assign a variant based on weights
 */
function assignVariant(experiment: Experiment): string {
  const { variants, weights } = experiment;

  // Default to equal weights
  const w = weights || variants.map(() => 1 / variants.length);

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < variants.length; i++) {
    cumulative += w[i];
    if (random < cumulative) {
      return variants[i];
    }
  }

  return variants[variants.length - 1];
}

/**
 * Get the variant for a user in an experiment
 * Returns null if experiment doesn't exist or is inactive
 */
export function getVariant(experimentId: string): string | null {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment || !experiment.active) return null;

  const stored = getStoredVariants();

  // Return existing assignment
  if (stored[experimentId]) {
    return stored[experimentId];
  }

  // Assign new variant
  const variant = assignVariant(experiment);
  stored[experimentId] = variant;
  saveVariants(stored);

  // Track exposure
  trackExposure(experimentId, variant);

  return variant;
}

/**
 * Track experiment exposure (sent to GA)
 */
export function trackExposure(experimentId: string, variant: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'experiment_exposure', {
      event_category: 'A/B Testing',
      experiment_id: experimentId,
      variant: variant,
      non_interaction: true,
    });
  }
}

/**
 * Track conversion for an experiment
 */
export function trackConversion(
  experimentId: string,
  conversionType: string,
  value?: number
): void {
  const variant = getStoredVariants()[experimentId];
  if (!variant) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'experiment_conversion', {
      event_category: 'A/B Testing',
      experiment_id: experimentId,
      variant: variant,
      conversion_type: conversionType,
      value: value,
    });
  }
}

/**
 * Force a specific variant (for testing/preview)
 */
export function forceVariant(experimentId: string, variant: string): void {
  const stored = getStoredVariants();
  stored[experimentId] = variant;
  saveVariants(stored);
}

/**
 * Clear all variant assignments (for testing)
 */
export function clearVariants(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get all active experiments and their current assignments
 */
export function getActiveExperiments(): Record<string, string> {
  const stored = getStoredVariants();
  const active: Record<string, string> = {};

  for (const [id, experiment] of Object.entries(EXPERIMENTS)) {
    if (experiment.active && stored[id]) {
      active[id] = stored[id];
    }
  }

  return active;
}
