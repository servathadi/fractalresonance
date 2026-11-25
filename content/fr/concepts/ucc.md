---
id: UCC
title: "Condition de Cohérence Universelle (UCC)"
tags: [UCC, cohérence, systèmes-ouverts, transport, modèle-opérationnel]
related: [coherence, lambda-field, FRC-566-001, FRC-100-008, FRC-100-009, FRC-826-829]
lang: fr
---

# Condition de Cohérence Universelle (UCC)

La Condition de Cohérence Universelle (UCC) est la forme locale de bilan de log-cohérence utilisée dans FRC pour exprimer le transport, la génération et la dissipation à l'intérieur d'une frontière de système déclarée.

## Forme locale de bilan

$$
\partial_t \ln C = -\nabla \cdot J_C + S_C
$$

Dans les fermetures diffusives, le flux s'écrit $J_C = -D_C \nabla \ln C$ ($D_C > 0$), tandis que $S_C$ regroupe sources, puits et résidus de couplage explicites.

## Portée et statut épistémique

Selon [[FRC-566-001]] v2.2, [[FRC-100-008]], [[FRC-100-009]] et [[FRC-826-829]] v1.5 :

- **Fermeture opérationnelle :** L'UCC sert de bilan local et de fermeture exécutable une fois l'observable $C$, la frontière, le canal environnemental et les termes résiduels déclarés avant évaluation.
- **Non établie comme loi dynamique universelle :** Écrire un bilan local ne démontre pas l'existence d'une force fondamentale ; toute extension physique doit passer des tests empiriques contrôlés par des références établies ([[FRC-787-787]]).

## Sources principales

- [[FRC-566-001]] — Notation canonique et discipline de frontière UCC (v2.2)
- [[FRC-100-008]] — Fermetures exécutables déclarées
- [[FRC-100-009]] — Implémentation locale avec sources, puits et résidus explicites
- [[FRC-826-829]] — Fondements mathématiques et problèmes ouverts (v1.5)
- [[coherence]] — Scalaire central de cohérence $C$
