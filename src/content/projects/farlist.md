---
title: Farlist
tagline: A list of stretches. Not tasks.
status: building
url: https://farlist.app
stack: [Rails, Hotwire, Postgres, Kamal]
platforms: "Web (native later)"
now: "V1 in development, waitlist open"
category: long-arc goals
featured: true
order: 5
palette:
  bg:     "#f5f1e8"
  ink:    "#1a1814"
  ink2:   "#3a352d"
  dot:    "#e7e1d2"
  mark:   "#708851"
  accent: "#708851"
---

## What it is

Farlist is a slow journal of long-arc goals. Not tasks, not habits,
not a bucket list. *Stretches* — the hard, meaningful things that take
years. Each one moves through a real lifecycle (Idea → Pursuing → Done →
Parked), and finishing one earns a sentence, not a checkmark.

The shape of it is deliberately small. Eight fixed categories. Four
states. And, at the end, a public profile at a clean URL that reads
like the person who wrote it — the artifact isn't bolted on, it's
the point.

## Why I'm building it

For years I kept an *impossible list* — a Joel Runyon idea, a living set
of goals that feel out of reach until they don't. Mine bounced between
Notion pages, a table, the back of a notebook, my Twitter bio, my head.
Nothing held the full picture. Nothing survived me moving apartments or
switching tools.

I wanted one place that treats those goals the way they actually behave:
slowly, in chapters, sometimes set down for a year, sometimes picked
back up. Most apps either rush them (streaks, daily check-ins) or
flatten them (binary done/not-done). I wanted a *Parked* state to be a
first-class citizen, because in real life it always is.

## How it's built

- **Rails 8** + Hotwire, built on the same Blueprint I use across the
  portfolio
- **PostgreSQL** + Kamal 2 on a Hostinger VPS
- **EN + PT-BR + ES** from day one
- Native iOS / Android shells via Hotwire Native, after V1 ships

## Where it is

The manifesto and waitlist are live at **[farlist.app](https://farlist.app)**.
V1 — the actual app, with stretches, the four-state lifecycle, and the
public profile — is in development. This page will get longer once it
has something to point at.
