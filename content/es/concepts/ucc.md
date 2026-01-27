---
id: UCC
title: "Condición de Coherencia Universal (UCC)"
tags: [UCC, coherencia, dinámica, transporte]
related: [coherencia, campo-lambda, FRC-566-001]
lang: es
---
# Condición de Coherencia Universal (UCC)

La Condición de Coherencia Universal (UCC) es la ley de flujo local utilizada en la FRC para describir cómo cambia la coherencia a través del espacio y el tiempo.

## Forma de flujo canónica

```
d/dt ln C = -div(J_C) + S_C
J_C = -D_C grad(ln C)
```

Interpretación:
- `J_C` es el flujo de coherencia (transporte).
- `S_C` son las fuentes/sumideros (generación o disipación).
- `D_C > 0` establece la fuerza de difusión en el espacio de log-coherencia.

## Donde aparece

- [[FRC-566-001]] formaliza la ley de reciprocidad y el flujo UCC.
- [[coherence|coherencia]] define el escalar central `C`.