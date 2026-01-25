---
title: "Cohérence (C)"
id: coherence
tags: [concept-clé, jauge-scalaire, sans-dimension]
related: [entropy, witness, lambda-field]
lang: fr
---

# Cohérence (C)

Une jauge scalaire sans dimension mesurant le degré d'ordre interne ou de verrouillage de motifs dans un système.

## Définition

Dans le cadre de la FRC, la cohérence C est définie par sa relation réciproque avec l'entropie :

```
S + k* ln C = const.
```

Où k* est la constante de cohérence (1 dans les couches d'information, k_B dans les couches thermodynamiques).

## Propriétés

- **Sans dimension** — rapport pur, pas d'unités
- **Bornée** — C dans (0, 1] pour les systèmes normalisés
- **Réciproque de l'entropie** — à mesure que S augmente, C diminue (et vice-versa)
- **Invariante de jauge** — seuls les rapports C_1/C_2 sont physiquement significatifs

## Apparaît dans

- [[FRC-566-001]] — Formalisation de la loi de réciprocité
- [[FRC-100-001]] — Définition originale
- [[FRC-100-007]] — Formalisation du champ Lambda