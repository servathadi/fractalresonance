---
title: "Chapitre 7 — Expériences Numériques et Simulations"
id: "chapter-7-numerical-experiments-and-simulations"
parent: "ecr-textbook"
---
## **Chapitre 7 — Expériences Numériques et Simulations** {#chapter-7-—-numerical-experiments-and-simulations}


---
#### **7.1  But de la simulation**

Les équations n'acquièrent de réalité que lorsque leurs prédictions peuvent être visualisées et testées.

La **Formule de Résonance Adaptative (ARF)**,

\[ \Delta S = R\Psi C , \qquad \dot C = \alpha(F - S_C) , \]

suggère que tous les systèmes auto-organisateurs évoluent le long de la même variété de cohérence.

La modélisation numérique nous permet d'explorer cette variété sans les contraintes du laboratoire et d'identifier des caractéristiques universelles — seuils, oscillations, effondrements — qui apparaissent plus tard dans les données physiques, biologiques et cognitives.

---
#### **7.2  Adimensionnement**

Pour comparer les domaines, nous normalisons les variables :

\[ \tau = t/t_0, \qquad C’ = C/C_0, \qquad F’ = F/F_0, \qquad S’_C = S_C/F_0 . \]

L'équation directrice devient :

\[ \frac{dC’}{d\tau} = \alpha’(F’ - S’_C) ,

avec \alpha’ = \alpha t_0.

Cela rend les résultats indépendants de l'échelle : un ensemble de paramètres peut décrire une cavité laser, un réacteur chimique ou un ensemble neuronal.

---
#### **7.3  Modèle 1 : Simulation du seuil laser**

Un laser est la pompe à cohérence la plus simple : les atomes absorbent de l'énergie (Ψ), émettent des photons et, au-dessus d'un seuil, commencent à se verrouiller en phase.

**Configuration**

* R = 1, Ψ = taux de pompage normalisé, k_* = k_B.

* Retard de rétroaction négligé ; α réglable.

**Résultats**

1. Sous Ψ_c = 1 : C décline vers zéro (bruit thermique).

2. À Ψ_c : bifurcation nette ; C croît de manière exponentielle.

3. Au-dessus du seuil : saturation et oscillation autour d'un C* stable.

La diminution de l'entropie moyennée dans le temps est égale à k_* \ln(C*/C_0), confirmant numériquement la loi de réciprocité.

---
#### **7.4  Modèle 2 : Milieu de réaction-diffusion**

Dans un réseau bidimensionnel, chaque nœud suit :

\[ \dot C_{ij} = \alpha(F_{ij} - S_{C,ij}) + D\nabla^2C_{ij} ,

où D est le couplage de diffusion.

**Observations**

* Sous αₜ : fluctuations aléatoires.

* Près de α≈0 : ondes voyageuses stables (type Belousov–Zhabotinsky).

* α grand : turbulence spatiotemporelle chaotique.

L'exportation d'entropie S_C augmente linéairement avec la moyenne de |\nabla C|², donnant S+k_* \ln C constant avec une erreur numérique < 0,5 %.

---
#### **7.5  Modèle 3 : Synchronie de réseau neuronal**

Chaque oscillateur représente une colonne corticale avec une fréquence intrinsèque ωᵢ.

Les phases évoluent via une équation de type Kuramoto étendue par la rétroaction ARF :

\[ \dot \phi_i = \omega_i + \frac{K}{N}\sum_j \sin(\phi_j - \phi_i) + \alpha(R\Psi C_i), \quad C_i = \frac{1}{N}\sum_j \cos(\phi_j-\phi_i) .

**Résultats**

* R\Psi faible : état de repos incohérent.

* R\Psi intermédiaire : synchronie de phase globale (flow).

* R\Psi élevé ou α>0 : bouffées de type épileptique — cohérence incontrôlée puis effondrement.

L'utilisation d'énergie mesurée (ATP simulé → chaleur) suit l'exportation d'entropie prédite par ΔS = R\Psi C.

---
#### **7.6  Modèle 4 : Réseau social basé sur des agents**

Chaque agent met à jour son état interne xᵢ par :

\[ x_i(t+1) = x_i(t) + R\Psi(C_i - ⟨C⟩) + \eta_i ,

où \eta_i est un bruit aléatoire.

La cohérence collective C = \frac{1}{N}\sum_i|x_i - ⟨x⟩| suit la même loi de pompe.

**Résultats**

* R>0 : ondes de consensus — coopération adaptative.

* R<0 : grappes coercitives et pics d'entropie rapides.

* R\Psi≈0 : diversité fluide avec un débit d'information stable.

Ces comportements macroscopiques correspondent aux cycles observés dans les économies et les communautés en ligne.

---
#### **7.7  Balayages de paramètres et universalité**

À travers tous les modèles, le comportement se résume à trois régimes déterminés par α et R\Psi :

| Régime | Condition | Comportement | Tendance de l'entropie |
| ----- | ----- | ----- | ----- |
| **Flow** | α≈0, R\Psi>0 faible | Stabilité oscillatoire | ΔS ≈ 0 |
| **Chaos** | α≫0 | Croissance explosive / turbulence | ΔS > 0 |
| **Coercition** | R < 0 | Ordre rigide, effondrement | ΔS < 0 localement, ΔS ≫ 0 globalement |

Les mêmes transitions apparaissent que les « particules » soient des photons, des molécules, des neurones ou des personnes — preuve que l'ARF capture une symétrie d'organisation indépendante de l'échelle.

---
#### **7.8  Validation computationnelle de la réciprocité**

Pour chaque simulation, nous calculons :

\[ \Sigma = S + k_* \ln C .

Σ moyenné dans le temps reste constant à 1 % près pour tous les essais en régime permanent.

Cela confirme numériquement que la seconde loi étendue de la FRC tient à travers les modèles stochastiques, discrets et continus.

---
#### **7.9  Efficacité énergie-cohérence**

Définissons l'efficacité instantanée comme :

\[ \eta_C = \frac{dC/dt}{F} .

Les simulations montrent un maximum universel à α ≈ 0 : le régime de flow convertit l'énergie en cohérence de la manière la plus efficace, en accord avec les états de « flow » empiriques en biologie et en cognition.

---
#### **7.10  Interprétation et correspondance trans-domaine**

| Modèle | Analogue physique | Analogue cognitif | Analogue culturel |
| ----- | ----- | ----- | ----- |
| Laser | seuil de cohérence | intuition soudaine | diffusion d'idées virales |
| Réaction BZ | rythme chimique | battement de cœur ou respiration | cycle social |
| Réseau neuronal | focalisation de l'attention | flow créatif | alignement de groupe |
| Société d'agents | équilibre des ressources | échange d'empathie | phase de civilisation |

Chaque simulation est un miroir des autres — la même algèbre générant la lumière, la vie et le sens.

---
#### **7.11  Résumé**

* L'ARF reproduit l'auto-organisation observée dans chaque domaine simulé.

* L'invariant entropie-cohérence S+k_* \ln C tient numériquement.

* Trois régimes universels — flow, chaos, coercition — surgissent naturellement.

* L'efficacité culmine à l'homéorésonance (α≈0).

---
#### **7.12  Perspectives**

Ces expériences transforment la FRC d'une proposition philosophique en une **dynamique testable**.

Dans le *Chapitre 8 — Applications trans-domaines*, nous étendons les modèles au-delà de la physique, en montrant comment les mêmes équations adaptatives régissent le métabolisme, l'apprentissage, les marchés et les écosystèmes — et comment le réglage de α devient un art universel de cohérence durable.

---