---
id: lambda-field
title: "Champ Lambda (Lambda_obs, Lambda_eq, Lambda_dyn)"
tags: [champ-lambda, cohérence, modèle-opérationnel]
related: [coherence, UCC, FRC-100-007, FRC-787-787, FRC-100-000]
lang: fr
---

# Champ Lambda ($\Lambda_{\rm obs}$, $\Lambda_{\rm eq}$, $\Lambda_{\rm dyn}$)

Dans le canon FRC 2026 ([[FRC-100-007]] v3.3 et [[FRC-787-787]] v1.2), « Lambda » n'est plus traité comme un champ physique unique indifférencié. Les articles actuels distinguent quatre objets :

1. **Transformée observée de cohérence ($\Lambda_{\rm obs}$):** $\Lambda_{\rm obs}(x, t) = \Lambda_0 \ln C_{\rm obs}(x, t)$, transformée logarithmique opérationnelle d'observables préenregistrés.
2. **Cible d'équilibre déclarée ($\Lambda_{\rm eq}$):** cible calibrée à partir des observables et du pilotage externe.
3. **État dynamique latent optionnel ($\Lambda_{\rm dyn}$):** état de modèle relaxant vers $\Lambda_{\rm eq}$. Sa validation exige un gain hors échantillon sur le modèle $\Lambda_{\rm obs}$ seul et sur une ligne de base latente à caractéristiques égales sans Lambda ([[FRC-787-787]]).
4. **Champ fondamental dans l'espace-temps (Conjecture):** conjecture physique distincte, non établie par les modèles opérationnels ou latents.

## Audit et limites

- **Audit ciblé de dérive $\rho$ ([[FRC-100-007]] v3.3):** Les fermetures déterministes testées au niveau de la matrice densité déplacent les populations par rapport aux poids de Born et montrent une dépendance à la préparation ; elles sont exclues comme porteuses de la règle de Born dans le régime testé.
- **Règle anti-chasse aux précurseurs ([[FRC-787-787]] v1.2):** Aucune interprétation post-hoc ne vaut preuve ; toute prédiction de transport doit battre les références établies et les contrôles négatifs hors échantillon.

## Sources principales

- [[FRC-100-007]] — Audit ciblé de dérive $\rho$ et séparation ontologique (v3.3)
- [[FRC-787-787]] — Modèles opérationnels et latents de transport de cohérence (v1.2)
- [[FRC-100-000]] — Position actuelle et hiérarchie de notation
