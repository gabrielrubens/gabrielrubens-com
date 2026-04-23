---
title: Pensio
tagline: An AI that actually understands your journal.
status: live
url: https://pensio.app
stack: [Django, Python, Postgres, Hotwire Native]
platforms: "Web · iOS · Android · Obsidian"
launched: "Jan 2026"
now: "Live · growing steadily"
category: journaling
featured: true
order: 1
icon: /assets/pensio.png
palette:
  bg:     "#f5ece2"
  ink:    "#2a1a0e"
  ink2:   "#5c4133"
  dot:    "#ecd4bd"
  mark:   "#c0562b"
  accent: "#c0562b"
---

## What it is

Pensio reads your journal the way a thoughtful friend would — across years,
not just the entry in front of it. It picks up the emotions, the people,
the recurring themes, and surfaces connections you'd never notice on your
own. You keep writing in markdown (in Obsidian, a folder, or Pensio itself),
and the insight layer lives on top of it.

## Why I built it

It started with a moment re-reading a journal entry from three years prior
— meeting a past version of myself on the street. I wanted to see more of
that. So I converted four hundred entries into markdown, put them in a
folder, and tried to build the mirror I wanted.

The obvious approaches failed. Dumping entries into a local LLM gave
summaries with no context. Retrieval-Augmented Generation — the standard
"chat with your docs" pattern — was disastrous: it treats each entry as a
knowledge-base fact and can't see that two entries about the same person,
written six months apart, are the same story.

So I built a custom pipeline in Python. Instead of embeddings over raw text,
it extracts *structured meaning* from every entry — emotions, themes, people,
temporal focus — and assembles them into a graph. The AI reasons across
that graph, not across text chunks.

The validation moment: the system connected two entries two years apart by
the emotion running between them. It showed me something I'd lived but
hadn't seen. I showed it to my partner and a few friends, they had their
own versions of that moment, and Pensio became a product.

## How it's built

- **Extraction pipeline:** Python scripts that turn each entry into structured
  signals (emotion, people, themes, temporal focus).
- **Graph layer:** connections built across the entire journal history, not a
  vector index.
- **Backend:** Django REST, multi-vault with row-level isolation.
- **Obsidian plugin:** real-time sync, JWT auth, offline queue, selective folders.
- **Native:** Hotwire Native wrappers for iOS and Android.
- **Infra:** PostgreSQL, Docker, VPS.

*Screenshot placeholder — real screenshots coming.*
