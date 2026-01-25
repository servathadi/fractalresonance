---
id: UCC
title: "Universal Coherence Condition (UCC)"
tags: [UCC, coherence, dynamics, transport]
related: [coherence, lambda-field, FRC-566-001]
lang: en
---

# Universal Coherence Condition (UCC)

The Universal Coherence Condition (UCC) is the local flow law used in FRC to
describe how coherence changes over space and time.

## Canonical flow form

```
d/dt ln C = -div(J_C) + S_C
J_C = -D_C grad(ln C)
```

Interpretation:
- `J_C` is coherence flux (transport).
- `S_C` is sources/sinks (generation or dissipation).
- `D_C > 0` sets the diffusion strength in log-coherence space.

## Where it appears

- [[FRC-566-001]] formalizes the reciprocity law and the UCC flow.
- [[coherence]] defines the core scalar `C`.

