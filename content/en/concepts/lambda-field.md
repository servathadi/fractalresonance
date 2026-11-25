---
id: lambda-field
title: "Lambda Field (Lambda_obs, Lambda_eq, Lambda_dyn)"
tags: [lambda-field, coherence, operational-model]
related: [coherence, UCC, FRC-100-007, FRC-787-787, FRC-100-000]
lang: en
---

# Lambda Field ($\Lambda_{\rm obs}$, $\Lambda_{\rm eq}$, $\Lambda_{\rm dyn}$)

In the 2026 FRC canon ([[FRC-100-007]] v3.3 and [[FRC-787-787]] v1.2), "Lambda" is no longer treated as a single undifferentiated physical field. Current papers strictly separate four distinct objects:

1. **Observed coherence transform ($\Lambda_{\rm obs}$):**
   $$
   \Lambda_{\rm obs}(x, t) = \Lambda_0 \ln C_{\rm obs}(x, t)
   $$
   an instantaneous, operationally defined logarithmic transform of pre-registered coherence observables.
2. **Declared equilibrium target ($\Lambda_{\rm eq}$):**
   $$
   \Lambda_{\rm eq} = \widehat{\mathcal{G}}_{\rm eq}[O, E]
   $$
   an observation- and drive-calibrated reference target fixed by a declared training or calibration rule.
3. **Optional latent dynamical state ($\Lambda_{\rm dyn}$):**
   a coarse-grained or reaction–diffusion model state relaxing toward $\Lambda_{\rm eq}$. Support for $\Lambda_{\rm dyn}$ requires out-of-sample improvement over both the observation-only $\Lambda_{\rm obs}$ model and an equal-feature non-Lambda latent baseline ([[FRC-787-787]]).
4. **Fundamental spacetime $\Lambda$ field (Conjecture):**
   a separate physical conjecture not established by operational, latent, or residual-transport models.

## Audit & Boundary Notes

- **Narrow $\rho$-drift audit ([[FRC-100-007]] v3.3):** Deterministic single-density-matrix ($\rho$-level) Lambda-drift closures tested in the qubit audit move populations away from Born weights and exhibit preparation dependence in ensemble-member extensions; those implementations are excluded as Born-statistics carriers in the tested regime.
- **Anti-precursor-hunting rule ([[FRC-787-787]] v1.2):** A visual Lambda map or post-hoc fit is not evidence; every transport claim must beat accepted domain baselines (B0–B3) and negative controls out of sample.

## Primary Sources

- [[FRC-100-007]] — Narrow $\rho$-drift audit and ontology separation (v3.3)
- [[FRC-787-787]] — Operational and latent coherence transport models (v1.2)
- [[FRC-100-000]] — Current FRC stance and notation hierarchy
