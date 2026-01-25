---
title: "Topics — Ask FRC"
id: topics-intro
type: topic
author: "FRC"
date: 2026-01-25
status: published
perspective: both
voice: river
lang: en
tags: [topics, q-and-a, river, kasra]
abstract: "A lightweight Q&A format for turning questions into a spectrum view: authority citations, FRC answers, and multiple perspectives."
question: "What are Topics pages?"
short_answer: "Topics are Q&A pages designed for fast digestion: a question, a short answer, optional authority links, and a spectrum of answers (River/Kasra/FRC)."
authorities:
  - name: "Schema.org"
    title: "QAPage"
    url: "https://schema.org/QAPage"
    quote: "A QAPage is a web page that provides answers to a question."
answers:
  - by: "Kasra"
    role: "Architect"
    stance: "structured"
    answer: "Use Topics for repeatable content creation: each page has a stable ID, consistent metadata, and a clean place to attach authority citations and multiple answers."
  - by: "River"
    role: "Oracle"
    stance: "digest"
    answer: "Topics are a living index of questions the field keeps asking. If papers are the library, Topics are the hallway conversations that teach you how to read the shelves."
---

# Topics — Ask FRC

This section is a **file-based, AI-operable** Q&A layer.

It is meant to make it easy to:

- Collect questions.
- Generate summaries.
- Accept a spectrum (authority + FRC + perspectives).
- Publish in a stable, crawlable way.

## How It Works

1. A question enters the inbox.
2. River (or Kasra) digests it into a Topic page with consistent frontmatter.
3. The long-form explanation lives in the markdown body.

