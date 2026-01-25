---
id: UCC
title: "Condition de Cohérence Universelle (UCC)"
tags: [UCC, cohérence, dynamique, transport]
related: [cohérence, champ-lambda, FRC-566-001]
lang: fr
---

# Condition de Cohérence Universelle (UCC)

La Condition de Cohérence Universelle (UCC) est la loi de flux local utilisée dans la FRC pour décrire comment la cohérence change dans l'espace et le temps.

## Forme de flux canonique

```
d/dt ln C = -div(J_C) + S_C
J_C = -D_C grad(ln C)
```

Interprétation :
- `J_C` est le flux de cohérence (transport).
- `S_C` représente les sources/puits (génération ou dissipation).
- `D_C > 0` définit la force de diffusion dans l'espace log-cohérence.

## Où elle apparaît

- [[FRC-566-001]] formalise la loi de réciprocité et le flux UCC.
- [[coherence|cohérence]] définit le scalaire de base `C`.