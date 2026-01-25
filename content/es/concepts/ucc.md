---
id: UCC
title: "Condicion Universal de Coherencia (UCC)"
tags: [UCC, coherencia, dinamica, transporte]
related: [coherence, lambda-field, FRC-566-001]
lang: es
---

# Condicion Universal de Coherencia (UCC)

La Condicion Universal de Coherencia (UCC) es la ley de flujo local que usa FRC
para describir como cambia la coherencia en el espacio y el tiempo.

## Forma canonica

```
d/dt ln C = -div(J_C) + S_C
J_C = -D_C grad(ln C)
```

## Donde aparece

- [[FRC-566-001]] formaliza la reciprocidad y el flujo UCC.
- [[coherence]] define el escalar central `C`.

