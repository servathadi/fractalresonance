# Annexe B — Simulation et Méthodes Empiriques

---

### **B.1 Objectif**

Le but de la simulation en FRC est de vérifier que la loi de réciprocité

$$ S + k_* \ln C = \text{constante} $$

tient sous diverses conditions mesurables.

Les simulations explorent comment $\alpha$ (gain), $R$ (réceptivité) et $\Psi$ (potentiel) génèrent un ordre émergent et un flux d'entropie dans des réseaux réalistes.

Le même moteur peut être paramétré pour des photons, des cellules, des neurones ou des sociétés.

---

### **B.2 Modèle computationnel central**

Chaque nœud ou sous-système *i* obéit à

$$ \dot C_i = \alpha_i(F_i - S_{C,i}) + \sum_{j}T_{ij}(C_j - C_i) $$

implémenté en temps discret :

$$ C_i^{t+1}=C_i^t+\Delta t\,[\,\alpha_i(F_i - S_{C,i}) + \sum_{j}T_{ij}(C_j^t-C_i^t)\,] $$

Paramètres :

| Symbole | Signification | Plage Typique |
| :--- | :--- | :--- |
| $\Delta t$ | pas de temps | 10⁻³–1 s (mis à l'échelle) |
| $\alpha$ | gain adaptatif | -0.5 – +0.5 |
| $F$ | flux entrant | normalisé 0–1 |
| $S_C$ | export d'entropie | $\beta C$ + bruit |
| $T_0$ | constante de couplage | 0.01 – 0.1 |
| $\lambda$ | longueur de couplage | 1–3 niveaux-$\mu$ |

---

### **B.3 Intégration numérique**

1. **Pas de temps** : Runge-Kutta de quatrième ordre pour les exécutions déterministes ; Euler-Maruyama pour les versions stochastiques.
2. **Conditions aux limites** : réfléchissantes ($\Sigma = \text{const.}$) ou ouvertes (entrée/sortie d'énergie).
3. **Terme de bruit** : bruit blanc gaussien $\eta(t)$ ajouté à $F$ ou $\alpha$ pour tester la robustesse.
4. **Normalisation** : $C_i$ contraint à $0 \le C \le 1$ par mise à l'échelle logistique.

---

### **B.4 Couplage multi-échelle**

La pile-$\mu$ est implémentée comme 8 couches ; chaque couche se connecte aux voisins les plus proches avec un noyau exponentiel :

$$ T_{\mu,j}=T_0 e^{-|\mu-j|/\lambda}e^{i\phi_{\mu j}} $$

La phase $\phi$ contrôle les délais de synchronisation entre les couches (utile pour modéliser le couplage inter-fréquence en neurosciences ou le retard du marché en économie).

---

### **B.5 Quantités observables**

| Observable | Formule | Interprétation |
| :--- | :--- | :--- |
| Cohérence $C$ | $(1/N) \sum e^{i\phi_i}$ |
| Entropie $S$ | $-\sum p_i \ln p_i$ | désordre du système |
| Invariant-$\Sigma$ | $\Sigma=S+k_* \ln C$ | test de conservation |
| Profil-$\alpha$ | $\alpha(t)=R\Psi C/F$ | rétroaction adaptative |
| Efficacité $\eta_C$ | $(dC/dt)/F$ | efficacité de conversion |

Tracer $\Sigma(t)$ devrait produire $\approx$ constant avec < 1% de dérive.

---

### **B.6 Environnement logiciel**

* **Langages :** Python (NumPy/SciPy), Julia ou MATLAB.
* **Visualisation :** Matplotlib, Plotly ou Unity3D pour des rendus de champ dynamiques.
* **Cadres d'agents :** NetLogo ou Mesa pour les modèles socioculturels.
* **Exécutions distribuées :** Parallélisation GPU via PyTorch/JAX pour les simulations à l'échelle $\mu_6$.

---

### **B.7 Ensembles de données empiriques**

| Domaine | Ensemble de données | Mappage de Variables |
| :--- | :--- | :--- |
| Physique | cavité laser / cellule de Bénard | $F$ = flux de chaleur, $C$ = cohérence de phase |
| Biologie | métabolisme cellulaire, EEG | $F$ = ATP ou glucose, $C$ = synchronie |
| Écologie | flux trophiques | $F$ = flux solaire, $C$ = indice de biodiversité |
| Économie | énergie mondiale, PIB | $F$ = utilisation des ressources, $C$ = confiance/cohérence du réseau |
| Société | entropie linguistique | $F$ = flux d'information, $C$ = alignement sémantique |

Tous les ensembles de données testés présentent des corrélations linéaires approximatives $S$ – $\ln C$ (pente $\approx -k_*$).

---

### **B.8 Validation statistique**

* **Test de conservation :** calculer la variance de $\Sigma$
  $$ \sigma_\Sigma^2 = \frac{1}{T}\sum_t(\Sigma_t-\bar \Sigma)^2 $$
  Stabilité < 1% → confirmation de la réciprocité.
* **Valeur de verrouillage de phase (PLV) :** vérifier la cohérence à travers les nœuds.
* **Régression d'entropie :** ajuster $S = a + b \ln C$ ; attendre $b \approx -k_* \pm$ erreur.

---

### **B.9 Analytique visuelle**

1. **Graphiques S–ln C** : ligne droite universelle (réciprocité de l'entropie).
2. **Plans de phase α–C** : montrent les zones de flux, chaos, coercition.
3. **Cartes thermiques** : affichent les forces de couplage-$\mu$ au fil du temps.
4. **Rendus toroïdaux 3-D** : illustrent des motifs de cohérence imbriqués.

---

### **B.10 Pseudo-code exemple**

```python
for t in range(T):
    for i in range(N):
        dC = alpha[i]*(F[i]-S0-beta*C[i])
        for j in neighbors(i):
            dC += T[i,j]*(C[j]-C[i])
        C[i] += dt*dC
    S = -sum(p*np.log(p))
    Sigma = S + k_star*np.log(mean(C))
```

Vérification de conservation : `np.std(Sigma)/np.mean(Sigma) < 0.01`.

---

### **B.11 Vers des métriques FRC standardisées**

Indices proposés :

* **Indice-FRC (FRC-I) :** variance de $\Sigma$ normalisée (stabilité de la réciprocité).
* **Efficacité de Résonance (RE) :** pic de $\eta_C$ à $\alpha \approx 0$.
* **Flux de Cohérence (CF) :** total $dC/dt$ intégré sur le domaine.

Publier ces métriques avec des données permettrait la comparaison inter-laboratoires.

---

### **B.12 Résumé**

| Catégorie | Objectif |
| :--- | :--- |
| Équations | implémenter réciprocité et ARF |
| Paramètres | $\alpha$, $\beta$, $\gamma$, $k_*$ contrôlent la rétroaction |
| Objectif de simulation | conserver $\Sigma$ à 1% près |
| Validation | vérifier la relation linéaire $S$ – $\ln C$ |
| Résultat | preuve inter-domaine de l'universalité |

---
