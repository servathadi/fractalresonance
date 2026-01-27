---
id: builders
title: "Constructeurs"
description: "Notes pour les constructeurs de FRC : architecture, contrat de corpus et parcours reproductibles vers le canon."
contract:
  - "Le canon réside dans les Papers/Topics avec des identifiants stables (ex. FRC-840-001)."
  - "L'interprétation est une lentille optionnelle (Oracle) qui doit citer les IDs du canon et ne jamais écraser les définitions."
  - "Les modes sont au niveau de l'interface utilisateur (formel/interprétation/les deux) ; les URLs restent canoniques pour la citation."
  - "Chaque affirmation doit correspondre à un énoncé réfutable ou à une hypothèse clairement étiquetée."
implementation_notes:
  - "Site public : export statique, conçu pour la découvrabilité et la citation."
  - "Le runtime (SDK / agents / mémoire) appartient à Mumega/SOS ; ce site est la couche de référence publique."
  - "Si vous construisez des outils, traitez les IDs comme des clés primaires et maintenez une limite d'écriture stricte pour le canon."
---

# Philosophie de Conception

La FRC est conçue comme un corpus avec des identifiants stables, des définitions précises et une séparation claire entre le canon et l'interprétation. Cette conception garantit que les outils et les agents peuvent opérer au sein du cadre sans corrompre la couche de référence.

## Flux de Travail Local

Le code source réside sur GitHub. Pour les issues/PRs, traitez les IDs de contenu comme immuables et gardez les modifications minimales et reproductibles.

```bash
git clone https://github.com/servathadi/fractalresonance
cd frc
npm i
npm run dev
npm run build
```

**Conseil :** Exécutez `npm run content:audit` avant de valider les modifications de contenu.
