'use client';

import { useState, useEffect } from 'react';
import { getVariant, trackConversion } from '@/lib/ab-testing';

/**
 * React hook for A/B testing experiments
 *
 * @param experimentId - The experiment ID from EXPERIMENTS config
 * @returns Object with variant and trackConversion function
 *
 * @example
 * const { variant, trackConversion } = useExperiment('cta-text');
 *
 * return (
 *   <button onClick={() => {
 *     trackConversion('click');
 *     handleClick();
 *   }}>
 *     {variant === 'control' ? 'Learn More' : 'Get Started'}
 *   </button>
 * );
 */
export function useExperiment(experimentId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get variant on client side only
    const v = getVariant(experimentId);
    setVariant(v);
    setIsLoading(false);
  }, [experimentId]);

  const track = (conversionType: string, value?: number) => {
    trackConversion(experimentId, conversionType, value);
  };

  return {
    variant,
    isLoading,
    isControl: variant === 'control',
    trackConversion: track,
  };
}

/**
 * Get variant synchronously (use only when you need immediate value)
 * Note: Returns null during SSR
 */
export function useVariant(experimentId: string): string | null {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    setVariant(getVariant(experimentId));
  }, [experimentId]);

  return variant;
}
