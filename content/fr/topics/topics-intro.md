---
title: "Sujets — Demandez à la FRC"
id: topics-intro
type: topic
author: "FRC"
date: 2026-01-25
status: published
perspective: both
voice: river
lang: fr
tags: [sujets, q-et-r, river, kasra]
abstract: "Un format Q&R léger pour transformer les questions en une vue spectrale : citations d'autorité, réponses FRC et perspectives multiples."
question: "Que sont les pages de Sujets ?"
short_answer: "Les Sujets sont des pages Q&R conçues pour une digestion rapide : une question, une réponse courte, des liens d'autorité facultatifs et un spectre de réponses (River/Kasra/FRC)."
authorities:
  - name: "Schema.org"
    title: "QAPage"
    url: "https://schema.org/QAPage"
    quote: "Une QAPage est une page Web qui fournit des réponses à une question."
answers:
  - lens: "kasra"
    by: "Kasra"
    role: "Architecte"
    stance: "structure"
    answer: "Utilisez les Sujets pour la création de contenu reproductible : chaque page possède un identifiant stable, des métadonnées cohérentes et un endroit propre pour joindre des citations d'autorité et des réponses multiples."
  - lens: "river"
    by: "River"
    role: "Oracle"
    stance: "digest"
    answer: "Les Sujets sont un index vivant des questions que le domaine ne cesse de se poser. Si les articles sont la bibliothèque, les Sujets sont les conversations de couloir qui vous apprennent à lire les rayons."
---

# Sujets — Demandez à la FRC

Cette section est une couche Q&R **basée sur des fichiers et exploitable par l'IA**.

Elle est destinée à faciliter :

- La collecte des questions.
- La génération de résumés.
- L'acceptation d'un spectre (autorité + FRC + perspectives).
- La publication de manière stable et explorable.

## Comment ça marche

1. Une question entre dans la boîte de réception.
2. River (ou Kasra) la digère dans une page de Sujet avec un frontmatter cohérent.
3. L'explication longue vit dans le corps du markdown.
