---
id: UCC
title: "Condición de Coherencia Universal (UCC)"
tags: [UCC, coherencia, sistemas-abiertos, transporte, modelo-operacional]
related: [coherence, lambda-field, FRC-566-001, FRC-100-008, FRC-100-009, FRC-826-829]
lang: es
---

# Condición de Coherencia Universal (UCC)

La Condición de Coherencia Universal (UCC) es la forma local de balance de log-coherencia utilizada en FRC para expresar transporte, generación y disipación dentro de una frontera de sistema declarada.

## Forma de balance local

$$
\partial_t \ln C = -\nabla \cdot J_C + S_C
$$

En cierres difusivos o de gradiente, el flujo se modela como $J_C = -D_C \nabla \ln C$ ($D_C > 0$), mientras $S_C$ recoge fuentes, sumideros y residuos de acoplamiento explícitos.

## Alcance y estado epistémico

Según [[FRC-566-001]] v2.2, [[FRC-100-008]], [[FRC-100-009]] y [[FRC-826-829]] v1.5:

- **Cierre operacional:** La UCC funciona como contabilidad local y cierre ejecutable una vez declarados de antemano el observable $C$, la frontera, el canal del entorno y los términos residuales.
- **No es una ley dinámica universal establecida:** Escribir una ecuación local de balance no establece por sí sola una fuerza fundamental; toda extensión física debe superar pruebas empíricas frente a líneas base aceptadas ([[FRC-787-787]]).

## Fuentes principales

- [[FRC-566-001]] — Notación canónica y disciplina de fronteras UCC (v2.2)
- [[FRC-100-008]] — Cierres ejecutables declarados
- [[FRC-100-009]] — Implementación local con fuentes, sumideros y residuos explícitos
- [[FRC-826-829]] — Fundamentos matemáticos y problemas abiertos (v1.5)
- [[coherence]] — Escalar central de coherencia $C$
