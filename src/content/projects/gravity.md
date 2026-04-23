---
title: Gravity
tagline: Stay close to the people you love.
status: live
url: https://mygravity.app
stack: [Rails, Hotwire, Hotwire Native, Postgres, Kamal]
platforms: "Web · iOS · Android"
launched: "Apr 2026"
now: "Live, Google Play submission underway"
category: relationships
featured: true
order: 3
icon: /assets/gravity.png
palette:
  bg:     "#1b1f3a"
  ink:    "#e8e9f4"
  ink2:   "#b4b6cc"
  dot:    "#2e3258"
  mark:   "#ffb14a"
  accent: "#ffb14a"
---

## What it is

Gravity reminds you to reach out to the people you care about, before
you've drifted too long. It makes acting on it take less than ten seconds.
You add the people you want to stay in orbit around, and Gravity tells you
who you're drifting from.

Not a CRM, not a contact manager. One job, done kindly.

## Why I built it

The people I love don't live near me anymore. Months kept slipping by, and
I'd realise I hadn't reached out, then feel guilty and still do nothing.
Every relationship tool I tried either felt like sales software or demanded
setup I'd never maintain. I wanted a companion that says *"it's been a
while"*, not *"YOU ARE OVERDUE."*

## How it's built

- **Rails 8** + Hotwire (Turbo + Stimulus)
- **Hotwire Native** on iOS and Android, one codebase, native push
- **PostgreSQL** + Kamal 2 on a Hostinger VPS
- Noticed gem + APNs / FCM for push
- **Stripe** (web) + **RevenueCat** (native IAP)
- Cross-tab sync and an offline queue so missed actions catch up quietly

*Screenshot placeholder. Real screenshots coming.*
