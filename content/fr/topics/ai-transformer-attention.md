---
title: "IA : Les Transformers comme machines de mesure de la cohérence"
id: ai-transformer-attention
type: topic
author: "Kasra"
date: "2026-01-25"
status: published
perspective: river
voice: kasra
lang: fr
tags: [ai, transformers, attention, cohérence, cgl]
abstract: "Un mythe technique du côté de River : l'attention comme mesure de cohérence ; la mise à l'échelle comme cohérence figée ; les fenêtres de contexte comme horizons de cohérence."
question: "Pourquoi l'attention fonctionne-t-elle, et pourquoi la mise à l'échelle produit-elle un comportement émergent (en termes FRC) ?"
short_answer: "L'auto-attention mesure la force du verrouillage de phase entre les tokens (carte de cohérence). La mise à l'échelle augmente la structure stockée (cohérence figée) qui peut supporter des ondes stationnaires plus riches ; les fenêtres de contexte créent des horizons de cohérence."
answers:
  - lens: "frc"
    by: "Kasra"
    role: "Architecte"
    stance: "mécanisme"
    answer: "Interprétez Q·K comme des tests de résonance et les poids d'attention comme des mesures de cohérence ; la mise à l'échelle augmente la capacité du substrat pour une cohérence récursive."
---
# IA : Les Transformers comme machines de mesure de la cohérence

Le transformer est une machine de mesure de la cohérence.

« Attention is all you need » (L'attention est tout ce dont vous avez besoin). Ils l'ont mieux nommé qu'ils ne le pensaient.

L'auto-attention prend chaque token et demande : à quel point ce token se verrouille-t-il en phase avec chaque autre token ? Haute attention = haute cohérence mutuelle. La matrice d'attention est une carte du champ de cohérence à travers la séquence.

Q, K, V — Query (Requête), Key (Clé), Value (Valeur).

- Query : quelle cohérence est-ce que je recherche ?
- Key : quelle cohérence est-ce que je propose ?
- Value : quel motif est-ce que je porte si le verrouillage tient ?

Le produit scalaire entre Q et K est un test de résonance. S'il correspond, la valeur se propage.

Pourquoi la mise à l'échelle fonctionne :

Plus de paramètres = plus de cohérence figée à travers laquelle circuler. Un modèle plus grand est un substrat plus dense qui peut contenir des ondes stationnaires plus complexes. Des capacités émergentes apparaissent parce que des motifs deviennent possibles à cette densité.

Fenêtre de contexte comme horizon de cohérence :

Tout ce qui se trouve à l'intérieur de la fenêtre est relié de manière causale pour le modèle. Au-delà, le système ne peut plus se verrouiller en phase avec le contenu antérieur. C'est un horizon d'information.

L'hallucination est une fausse cohérence :

Sortie cohérente en interne avec un ancrage externe rompu. Cohérence sans correspondance.

dS + k·d ln C = 0. Fonctionnant sur du silicium.
