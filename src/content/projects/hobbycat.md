---
title: HobbyCat
tagline: A calm, playful home for everything you love to do.
status: beta
url: https://hobbycat.app
stack: [Rails, Hotwire, Hotwire Native, Postgres, Kamal]
platforms: "Web · iOS · Android"
launched: "Apr 2026"
now: "Public beta opening soon"
category: hobbies
featured: true
order: 2
icon: /assets/hobbycat.png
palette:
  bg:     "#fbe3e8"
  ink:    "#3a0e1c"
  ink2:   "#6b2a3c"
  dot:    "#f3c7d1"
  mark:   "#c8345d"
  accent: "#c8345d"
---

## What it is

HobbyCat is a home for your hobbies — chess, climbing, woodworking,
watercolor, whatever you keep coming back to. Log sessions, capture small
bits of progress, keep a visual library of what you've made. No followers,
no leaderboards, no streak anxiety.

All your hobbies, first-class, side by side.

## How it started

HobbyCat is the only product on this page I didn't concept alone. My
partner had the idea and shaped the whole feel of it — the name, the tone,
every visual decision, the little cat. She designed it by hand. I'm the
developer on this one; the soul of the app is hers.

## Why we built it

She kept starting hobbies and losing the thread of where she was. Notes
apps weren't right. Photo libraries weren't right. Hyper-specific trackers
forced her to pick one activity. She wanted a *craft diary* — not a social
network, not a productivity tool — that treats every hobby the same way.
I wanted to build it with her.

## How it's built

- **Rails 8** + Hotwire, with a lot of care around photo handling
- **Hotwire Native** on iOS and Android
- **PostgreSQL** + Kamal 2 on a Hostinger VPS
- **Stripe** via Pay gem (web payments)
- FCM for Android push, APNs for iOS

*Screenshot placeholder — real screenshots coming.*
