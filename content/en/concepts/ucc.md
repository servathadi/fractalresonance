---
id: UCC
title: "Universal Coherence Condition (UCC)"
tags: [UCC, coherence, open-systems, transport, operational-model]
related: [coherence, lambda-field, FRC-566-001, FRC-100-008, FRC-100-009, FRC-826-829]
lang: en
---

# Universal Coherence Condition (UCC)

The Universal Coherence Condition (UCC) is the local log-coherence balance form used in FRC to express coherence transport, generation, and dissipation inside a declared system boundary.

## Local Balance Form

$$
\partial_t \ln C = -\nabla \cdot J_C + S_C
$$

In diffusive or gradient-transport closures, the flux is modeled as $J_C = -D_C \nabla \ln C$ (with $D_C > 0$), while $S_C$ accounts for explicit local sources, sinks, and coupling residuals.

## Scope and Epistemic Status

Per [[FRC-566-001]] v2.2, [[FRC-100-008]], [[FRC-100-009]], and [[FRC-826-829]] v1.5:

- **Operational closure:** UCC is used as a declared local bookkeeping and executable-closure form once the observable $C$, domain, boundary, environment channel, and residual terms are specified before scoring.
- **Not an established universal dynamical law:** Writing a local log-coherence balance equation does not by itself establish a fundamental force or universal physical dynamics; any physical extension must pass baseline-controlled empirical tests (see [[FRC-787-787]]).

## Primary Sources

- [[FRC-566-001]] — Canonical reciprocity notation and UCC boundary rules (v2.2)
- [[FRC-100-008]] — Declared executable closures
- [[FRC-100-009]] — Local implementation with explicit source, sink, and residual terms
- [[FRC-826-829]] — Mathematical foundations and open problems (v1.5)
- [[coherence]] — Core coherence scalar $C$
