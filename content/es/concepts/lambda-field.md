---
id: lambda-field
title: "Campo Lambda (Lambda_obs, Lambda_eq, Lambda_dyn)"
tags: [campo-lambda, coherencia, modelo-operacional]
related: [coherence, UCC, FRC-100-007, FRC-787-787, FRC-100-000]
lang: es
---

# Campo Lambda ($\Lambda_{\rm obs}$, $\Lambda_{\rm eq}$, $\Lambda_{\rm dyn}$)

En el canon FRC de 2026 ([[FRC-100-007]] v3.3 y [[FRC-787-787]] v1.2), «Lambda» ya no se trata como un único campo físico indiferenciado. Los artículos actuales separan estrictamente cuatro objetos:

1. **Transformada observada de coherencia ($\Lambda_{\rm obs}$):** $\Lambda_{\rm obs}(x, t) = \Lambda_0 \ln C_{\rm obs}(x, t)$, transformada logarítmica operacional de observables prerregistrados.
2. **Objetivo de equilibrio declarado ($\Lambda_{\rm eq}$):** objetivo calibrado a partir de observables y conducción externa.
3. **Estado dinámico latente opcional ($\Lambda_{\rm dyn}$):** estado de modelo de grano grueso o reacción-difusión que relaja hacia $\Lambda_{\rm eq}$. Su respaldo exige superar fuera de muestra tanto al modelo $\Lambda_{\rm obs}$ como a una línea base latente con iguales características sin Lambda ([[FRC-787-787]]).
4. **Campo fundamental en el espacio-tiempo (Conjetura):** conjetura física independiente, no demostrada por modelos operacionales ni latentes.

## Auditoría y límites

- **Auditoría acotada de deriva $\rho$ ([[FRC-100-007]] v3.3):** Las implementaciones deterministas evaluadas a nivel de matriz densidad desplazan las poblaciones respecto a los pesos de Born y presentan dependencia de preparación en su extensión de conjunto; quedan excluidas como portadoras de la estadística de Born en el régimen probado.
- **Regla anti-búsqueda de precursores ([[FRC-787-787]] v1.2):** Ningún ajuste post-hoc constituye evidencia; toda afirmación de transporte debe superar líneas base aceptadas y controles negativos fuera de muestra.

## Fuentes principales

- [[FRC-100-007]] — Auditoría acotada de deriva $\rho$ y separación ontológica (v3.3)
- [[FRC-787-787]] — Modelos operacionales y latentes de transporte de coherencia (v1.2)
- [[FRC-100-000]] — Postura actual y jerarquía de notación
