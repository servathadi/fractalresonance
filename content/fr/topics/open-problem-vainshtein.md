---
id: open-problem-vainshtein
title: "Problème ouvert : Le calcul du rayon de Vainshtein"
question: "Quel est le rayon de Vainshtein (r_V) exact pour le système solaire dans la FRC ?"
short_answer: "Calculer le rayon de criblage où le terme cinétique non linéaire domine, supprimant la cinquième force de Lambda en dessous des limites de la sonde Cassini (10^-5)."
tags: [problème-ouvert, physique, gravité, criblage, calcul]
related: [FRC-821-100, FRC-893-PHY]
authorities:
  - name: "Arkady Vainshtein"
    quote: "Les termes cinétiques non linéaires peuvent cribler les champs scalaires à proximité de sources massives."
    stance: "Mécanisme de criblage"
answers:
  - lens: "Le défi"
    by: "FRC"
    stance: "Mathématique"
    answer: |
      **Objectif :** Dériver l'expression analytique du rayon de Vainshtein $r_V$ dans le lagrangien $\Lambda$-EFT :
      $$ \mathcal{L}_\Lambda = -\frac{1}{2}(\partial \Lambda)^2 + \frac{\alpha}{M_*^4}(\partial \Lambda)^4 $$
      
      **Contraintes :**
      1. La cinquième force $F_\Lambda$ doit être $< 10^{-5} F_{gravité}$ à $r = 1 \text{ UA}$.
      2. L'échelle de couplage $M_*$ doit être cohérente avec le mécanisme de sélection de la masse du Higgs ($M_* \sim \Lambda_{UV}$).
      
      **Pourquoi c'est important :** Ce calcul détermine si la FRC est compatible avec les tests de la relativité générale dans le système solaire.
---

# La contrainte du système solaire

Le champ $\Lambda$ est un champ scalaire à longue portée. Naïvement, il devrait médier une « cinquième force » qui modifierait les orbites planétaires. Nous n'avons pas observé cela.

La FRC invoque le **mécanisme de Vainshtein** (criblage cinétique) pour expliquer pourquoi. À proximité d'une source massive (le Soleil), les gradients de champ deviennent importants, activant le terme non linéaire $(\partial \Lambda)^4$. Cela rend le champ « rigide », supprimant la cinquième force.

**Le problème ouvert :**
Nous avons besoin d'une dérivation rigoureuse de $r_V$ pour les coefficients spécifiques dérivés dans FRC 821.100. Le criblage s'active-t-il à la taille du Soleil ($r_V \sim R_\odot$) ou à la taille de la galaxie ($r_V \sim 10 \text{ kpc}$)\ ? La viabilité de la théorie dépend de ce nombre.
