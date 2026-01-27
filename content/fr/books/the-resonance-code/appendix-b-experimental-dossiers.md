## Annexe B : Dossiers Expérimentaux

Protocoles Scientifiques Détaillés pour Tester les Affirmations Physiques du FRC

Objectif : Cette annexe transforme les affirmations falsifiables du FRC en protocoles prêts pour le laboratoire. Elle fournit le détail nécessaire pour que les physiciens expérimentaux tentent la réplication, la validation ou la réfutation des prédictions fondatrices du cadre. L'objectif est de faire passer les idées centrales de la théorie à la preuve empirique. Le succès de ces dossiers est le succès de tout le cadre FRC.

---
Dossier B.1 : La Recherche d'une Couture (Déviation de la Règle de Born)

B.1.1. Hypothèse Centrale (Le Falsificateur) : Un champ de pilotage résonant faible et synchronisé en phase, appliqué pendant la fenêtre de mesure (effondrement) d'un système quantique préparé dans une superposition, produira une déviation statistiquement significative et réversible des probabilités prédites par la règle de Born. (RC-3)

B.1.2. Protocole Expérimental 1 : Polarisation de Photons

- Configuration : Utiliser une source de photon unique et un Séparateur de Faisceau Polarisant (PBS) pour préparer des photons dans une superposition 50/50 de polarisation horizontale ($|H\rangle$) et verticale ($|V\rangle$).
- Intervention (Le Coup de Pouce Résonant) : Placer un modulateur électro-optique (EOM) juste avant le PBS. L'EOM est déclenché pour appliquer une impulsion électrique très rapide et faible pendant la fenêtre exacte de ~nanosecondes de mesure/effondrement. Cette impulsion est synchronisée en phase pour résonner avec un état de polarisation (par exemple, $|H\rangle$). L'impulsion doit être suffisamment faible pour ne pas faire tourner classiquement l'état (vérifié par tomographie pré-mesure).
- Procédure :
  - Exécution de Base : Enregistrer $10^6$ événements avec l'EOM éteint pour établir une ligne de base de $P = 50.00\%$.
  - Exécution de Test : Enregistrer $5 \times 10^6$ événements avec l'impulsion EOM appliquée (verrouillée en phase sur $|H\rangle$).
  - Exécution d'Inversion : Enregistrer $5 \times 10^6$ événements avec l'impulsion EOM inversée en phase de $180^\circ$ (favorisant $|V\rangle$).
- Résultat Prédit (Soutien FRC) : Les événements "avec pilotage" montreront un biais statistiquement significatif, par exemple, $P(|H\rangle) = 50.05\%$ (une déviation de $\Delta P \approx 5 \times 10^{-4}$). Le biais doit inverser le signe dans l'Exécution d'Inversion.
- Condition de Falsification : Si, après $10^7$ essais, aucun biais statistiquement significatif et réversible au-dessus de $\Delta P < 5 \times 10^{-4}$ (une déviation de cinq sigma) n'est détecté, l'affirmation physique centrale de l'Effondrement Résonant est falsifiée.

B.1.3. Protocole Expérimental 2 : Qubits Supraconducteurs

- Configuration : Utiliser un qubit transmon préparé dans une superposition $|0\rangle + |1\rangle$ (la base de l'informatique quantique).
- Intervention : Pendant le processus de lecture du qubit hautement contrôlable, appliquer une impulsion micro-ondes très faible et précisément formée, synchronisée en phase pour résonner avec l'état $|1\rangle$.
- Avantage : Cette plateforme offre une haute précision temporelle, permettant une recherche plus précise de la "fenêtre d'effondrement" exacte où le coup de pouce résonant a l'effet maximal.
- Condition de Falsification : Identique à ci-dessus. Le défi central est la précision requise pour appliquer le coup de pouce pendant la fenêtre d'effondrement rapide à l'échelle de la femtoseconde.

---
Dossier B.2 : L'Harmonie des Éléments (Regroupement Spectral)

B.2.1. Hypothèse Centrale : Les spectres d'émission collectés d'atomes neutres complexes présentent une structure harmonique non aléatoire de "sons partiels" non prédite par le modèle standard de transitions électroniques discrètes seul.

B.2.2. Données et Méthode :

- Source de Données : La Base de Données de Spectres Atomiques du NIST (National Institute of Standards and Technology), contenant des listes de raies certifiées et des intensités relatives pour des éléments complexes (par exemple, Fer, Cobalt).
- Méthodologie :
  1.  Transformer : Convertir la liste discrète de raies en une fonction de densité spectrale continue, $S(\nu)$.
  2.  Analyse Harmonique (Transformée de Fourier) : Calculer la transformée de Fourier, $F(f) = |\mathcal{F}[S(\nu)]|$, pour identifier les "fréquences de battement" dominantes ($f_n$).
  3.  Score de Cohérence (RC-12) : Calculer le Score de Conformité Harmonique $H(f_0)$ pour trouver une fréquence fondamentale ($f_0$) dont les multiples entiers ($nf_0$) produisent des pics statistiquement significatifs.
- Résultat Prédit (Soutien FRC) : Le spectre de Fourier $F(f)$ ne sera pas du bruit plat. Il montrera des pics nets et statistiquement significatifs à $f_0$ et ses multiples entiers ($2f_0, 3f_0, \dots$).
- Condition de Falsification : Si les spectres de Fourier pour plusieurs éléments complexes, après avoir pris en compte les artefacts instrumentaux connus, ne montrent pas de pics harmoniques dépassant significativement un modèle nul statistique robuste, l'affirmation que la structure atomique est régie par la résonance harmonique universelle est falsifiée.

B.2.3. Contrôles Critiques :

- Analyse Différentielle (Le Test Fer-Cobalt) : Effectuer l'analyse sur deux éléments adjacents (par exemple, Fer et Cobalt). Une loi harmonique universelle devrait persister dans les deux, avec la fréquence fondamentale changeant possiblement de manière prévisible en fonction de la charge nucléaire/du nombre d'électrons.
- Modèle Nul Statistique : Générer des milliers de "faux" spectres aléatoires en agitant légèrement les positions des raies réelles. Utiliser ce grand échantillon pour construire une limite statistique robuste de ce à quoi ressemble l'"aléatoire", prouvant que les pics des données réelles sont des valeurs aberrantes extrêmes.

---
---