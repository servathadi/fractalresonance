---
title: "Cohérence (C)"
id: coherence
tags: [concept-central, jauge-scalaire, adimensionnel]
related: [entropy, witness, lambda]
lang: fr
---

# Cohérence (C)

Une jauge scalaire adimensionnelle mesurant le degré d'ordre interne ou de verrouillage de motif dans un système.

## Définition

Dans le cadre FRC, la cohérence C est définie par sa relation réciproque avec l'entropie :

```
S + k* ln C = const.
```

Où k* est la constante de cohérence (1 dans les couches d'information, k_B dans les couches thermodynamiques).

## Propriétés

- **Adimensionnel** — pur rapport, sans unités
- **Borné** — C dans (0, 1] pour les systèmes normalisés
- **Réciproque à l'entropie** — à mesure que S augmente, C diminue (et vice versa)
- **Invariant de jauge** — seuls les rapports C_1/C_2 sont physiquement significatifs

## Apparaît Dans

- [[FRC-566-001]] — Formalisation de la loi de réciprocité
- [[FRC-100-001]] — Définition originale
- [[FRC-200-001]] — Contexte de l'opérateur Lambda