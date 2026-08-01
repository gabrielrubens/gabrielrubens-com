# Analytics

GA4, added 2026-08-01. Before this the site had **no analytics at all**, which meant a published
post and a post nobody opened looked exactly the same.

## Why GA4 here, when Pensio is stricter

A deliberate split. This is a personal site with no accounts, no user data and nothing to leak, so
the bar is "does anyone read this". Pensio holds people's journals and keeps the stricter posture.
Choosing GA4 here also costs nothing to wire up: `~/dev/analytics/tools/ga4.py` already runs
unattended in the `Collect` GitHub Action, so the number reaches the Monday digest instead of
sitting in a dashboard nobody opens.

That last part is the whole point. An unread dashboard is the same failure as the weekly review
files that ran for three months with zero readers.

## How it is wired

| Where | What | Value |
|---|---|---|
| `src/layouts/Base.astro` | the gtag snippet | measurement id `G-CYG1592WG0` |
| `~/dev/analytics/apps/gabrielrubens.yml` | what the Data API reads | property id `326004239` |

**Two different ids, and mixing them up is the usual mistake.** The measurement id (`G-` prefix) is
where the browser sends hits. The numeric property id is what the Data API reads from. Both are
needed, in different places.

The measurement id is **hardcoded**, not an env var. It is a public identifier that ships in the
HTML of every page anyway, so treating it as config bought nothing and added a step that could be
forgotten, which would mean weeks of silently collecting nothing. `PUBLIC_GA_ID` still overrides it
if a fork or a staging property ever needs a different one.

### Which property, and what NOT to delete

The account holds two, both from the old WordPress site:

| Property | Id | Data stream | Covers | Verdict |
|---|---|---|---|---|
| `gabrielrubens.com - GA4` | **326004239** | yes, `G-CYG1592WG0` | Sep 2022 to mid 2024 | **use this** |
| `gabrielrubens.com` | 288097250 | **none** | 2021 to May 2023 | **keep, do not delete** |

The old one has no data stream, so it can never collect again. But it is the **only copy of the
first year**: probed 2026-08-01, it has 12 sessions in 2021-09 and 8 in 2022-03 where 326004239 has
zero. They overlap Sep 2022 to May 2023 because both were tagged during the migration, and after
May 2023 the old one is flat zero. An empty property costs nothing to keep; deleting it destroys
that first year permanently.

### Nothing counts except the live domain

Two gates, and the second one is the one that matters:

1. **Build time** — `import.meta.env.PROD`, so `npm run dev` emits nothing.
2. **Runtime** — `location.hostname === 'gabrielrubens.com'`, and **the loader is injected inside
   that check**, so a preview URL does not even download `gtag.js`.

The runtime gate exists because the build-time one is not sufficient on its own: **a Cloudflare
preview deployment is also a production build**, so `PROD` is true there and it would have reported
real hits from a `*.workers.dev` URL.

This is not paranoia. The portfolio's own Lighthouse CI quietly poisoned GotHired's PostHog
pageview funnels for weeks, and server-side events were the only clean source afterwards.
Self-inflicted traffic is the easiest way to make a number lie.

## Consent

Consent Mode v2 is set with **every advertising signal denied**:

```
ad_storage: denied · ad_user_data: denied · ad_personalization: denied · analytics_storage: granted
```

So nothing here feeds ad profiles, and `anonymize_ip` is on.

> ⚠️ **This is an analytics-only posture, not full EU compliance.** `analytics_storage: granted`
> still writes a cookie, and under ePrivacy a cookie banner is the strictly correct answer for EU
> visitors. That banner is **not built**. It is a deliberate, informed gap on a personal site with
> no accounts and no user data, not an oversight. If it ever matters, the options are a real
> consent banner, or switching `analytics_storage` to denied by default and accepting sampled data.

## Setup

Done, 2026-08-01. Both ids are committed and the collector is wired.

**No service-account grant was needed.** The `Collect` Action authenticates with `GA4_TOKEN_JSON`,
the same OAuth user token as the local `~/.config/gcloud/ga4-token.json`, and that token already
reads property 326004239 (verified by querying it directly). This was worth checking rather than
assuming: had the Action used a service account, it would have needed Viewer on the property first.

`run_all.py` guards the site step with `_has_ga4()`, which reads the yml and skips it while
`ga4_property_id` is blank. Now that the id is filled the weekly collection is **28 steps** instead
of 27, and the site appears in the Monday digest.

## Search Console: not connected, and the reason is simple

**There is no property for this domain.** Confirmed 2026-08-01 by listing everything the
`gsc-token` can read: 8 properties, and `gabrielrubens.com` is not among them. So there was nothing
to connect, only something to create.

Until one exists, nothing knows how a post performed *before* the click. GA4 tells you a visit
happened; only Search Console tells you the post was shown 400 times and clicked 3, which is the
difference between "nobody is interested" and "nobody can find it". That distinction is exactly
what the GotHired indexation story was about.

### Creating it

Use a **domain property** to match the rest of the portfolio (every other app is `sc-domain:`),
because it covers apex, `www` and both protocols in one:

```
sc-domain:gabrielrubens.com
```

Verification needs a DNS TXT record. The domain is on Cloudflare, which Search Console supports as
a one-click verification partner, so this is usually a couple of clicks rather than a manual record.

A **URL-prefix** property (`https://gabrielrubens.com/`) is the fallback, and it has one advantage
now that did not exist before today: with GA4 installed, Search Console can verify via the Google
Analytics method, no DNS at all. It is the weaker choice though, since it does not cover other
protocol or subdomain variants.

### After verifying

Put the id on the `gsc_property` line in `~/dev/analytics/apps/gabrielrubens.yml`. **Nothing else
needs changing.** `run_all.py` already carries a guarded `gsc` step for this app, so weekly
collection goes from 28 steps to 29 on its own.

⚠️ Do not fill that line before Search Console reports the property as **verified**. The guard only
checks that the value is non-empty, so an unverified id turns a skipped step into one that fails
every Monday.

Bing Webmaster Tools is a separate, optional connection. The other apps have one; this site does
not, and nothing is wired for it.
