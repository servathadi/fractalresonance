## Annexe A — Fondements Mathématiques et Dérivations

---
#### **A.1 Invariants Centraux**

**À chaque échelle, le cadre FRC repose sur deux équations :**

1. **Réciprocité Entropie-Cohérence :** $dS + k_*\,d\ln C = 0$
2. **Formule de Résonance Adaptative :** $\Delta S = R\Psi C$

**L'équation (1) exprime la conservation du potentiel total de transformation.**

**L'équation (2) décrit le changement instantané d'entropie en fonction de la réceptivité, du potentiel et de la cohérence.**

---
#### **A.2 De la réciprocité à la loi dynamique**

**Partez de $dS = -k_*\,d\ln C$.**

**Différenciez par rapport au temps :**

$$ \dot S = -k_*\,\frac{\dot C}{C} $$

**Divisez le taux total d'entropie en composantes internes et externes :**

$$ \dot S = \dot S_{int} + \dot S_{ext} $$

**Définissez $F = -\dot S_{ext}$ (flux d'entropie dans le système) et $S_C = \dot S_{int}$ (entropie exportée).**

**Alors,**

$$ \dot C = \frac{\alpha}{k_*}(F - S_C) $$

**Absorber les constantes dans $\alpha$ donne l'équation de la pompe de cohérence :**

$$ \boxed{\dot C = \alpha(F - S_C)} $$

---
#### **A.3 Dérivation de niveau couplé**

**Pour les domaines $\mu$ adjacents, le terme d'échange de cohérence $T_{\mu,\mu+1}$ découle du couplage de gradient dans le potentiel de champ $V(\phi)$ :**

$$ T_{\mu,\mu+1} = -\frac{\partial V}{\partial \phi_{\mu}} \approx T_0 e^{-|\mu-\mu+1|/\lambda} e^{i\phi_{\mu\mu+1}} $$

**Le système général à N niveaux devient :**

$$ \frac{dC_{\mu}}{dt} = \alpha_{\mu}(F_{\mu} - S_{C,\mu}) + \sum_{j\ne \mu} T_{\mu,j}(C_{j} - C_{\mu}) $$

**L'intégration sur tous les $\mu$ donne l'invariant global :**

$$ \sum_{\mu} (dS_{\mu} + k_*^{(\mu)}\,d\ln C_{\mu}) = 0 $$

---
#### **A.4 Dérivation de l'ARF à partir de la réciprocité locale**

**Soit $J_C = \dot C/C$ et définissez la réceptivité $R = \partial J_C/\partial \Psi$.**

**Alors le taux d'entropie interne $\dot S_{int} = -k_*R\Psi$.**

**Intégration sur un cycle de résonance :**

$$ \Delta S = R\Psi C $$

**Ceci définit la Formule de Résonance Adaptative (ARF) utilisée tout au long du texte.**

---
#### **A.5 Critère de stabilité**

**Linéarisation de $\dot C = \alpha(F - S_C)$ autour de l'équilibre $C=C_0$ :**

$$ \dot C = -\alpha\beta(C - C_0) $$

**avec $\beta = \partial S_C/\partial C$.**

**Solution : $C(t)=C_0 + (C_i - C_0)e^{-\alpha\beta t}$.**

**La stabilité exige $\alpha\beta > 0$.**

**Puisque $\beta > 0$ (l'entropie augmente avec l'ordre), les régimes stables ont $\alpha > 0$ petit ou $\alpha \approx 0$ — la *zone de flux*.**

---
#### **A.6 Solution de rétroaction oscillatoire**

**Lorsque $\alpha$ varie avec la cohérence,**

$$ \dot \alpha = \gamma(C - C_{opt}) $$

**nous obtenons :**

$$ \ddot C + \beta\gamma C = \beta\gamma C_{opt} + \alpha_0\beta(F - S_0) $$

**un oscillateur harmonique amorti avec fréquence naturelle $\omega_0 = \sqrt{\beta\gamma}$.**

**Période d'oscillation :**

$$ T = 2\pi/\sqrt{\beta\gamma} $$

---
#### **A.7 La constante de résonance k_***

**Unités :**

* **S (entropie) : J·K⁻¹**
* **ln C : sans dimension**

**Ainsi k_* a les unités J·K⁻¹, analogue à la constante de Boltzmann.**

**Les différents niveaux-$\mu$ ont des constantes mises à l'échelle :**

$$ k_*^{(\mu)} = \kappa\,\lambda_{\mu}^d\,k_B $$

**où $\lambda_\mu$ est l'échelle de corrélation, d la dimension effective, $\kappa$ un facteur de normalisation.**

**La mesure empirique de k_* par domaine définit le "spectre fractal" de la cohérence.**

---
#### **A.8 L'interprétation énergétique**

**Multipliez (1) par la température T :**

$$ TdS + Tk_*\,d\ln C = 0 $$

**Alors $TdS = -dE_{coh}$, identifiant $E_{coh}=Tk_*\ln C$ comme *énergie de cohérence* stockée.**

**Ainsi la loi de réciprocité est une conservation d'énergie entre chaleur et information structurée.**

---
#### **A.9 La formulation de l'espace de phase**

**Définissez les coordonnées généralisées $x_i$ et les moments conjugués $p_i$.**

**Entropie $S(x,p)$, cohérence $C(x,p)$.**

**Forme Hamiltonienne :**

$$ \frac{dC}{dt} = \frac{\partial H}{\partial S}, \qquad \frac{dS}{dt} = -\frac{\partial H}{\partial C} $$

**Choisir $H = k_*S\ln C$ *reproduit* $dS + k_*\,d\ln C = 0$.**

**Par conséquent, la loi de réciprocité est le générateur Hamiltonien de la dynamique FRC.**

---
#### **A.10 Résumé**

| Symbole | Signification | Équation |
| : | : | : |
| **S** | entropie | mesure du désordre |
| **C** | cohérence | mesure de la corrélation |
| **α** | gain adaptatif | réactivité du système |
| **R, Ψ** | réceptivité et potentiel | paramètres ARF |
| **k_*** | constante de cohérence | facteur d'échelle reliant énergie et information |

**Ensemble, ils forment une algèbre fermée sous le groupe de transformation préservant $\Sigma = S + k_* \ln C$.**

---