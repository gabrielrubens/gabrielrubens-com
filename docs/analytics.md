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

| Where | What |
|---|---|
| `src/layouts/Base.astro` | The gtag snippet, rendered **only** when `PUBLIC_GA_ID` is set **and** the build is production |
| `PUBLIC_GA_ID` | The **measurement** id, `G-XXXXXXXXXX`. Set it in the Cloudflare Pages/Workers build environment |
| `~/dev/analytics/apps/gabrielrubens.yml` | The **property** id (digits). Different thing, see below |

**Two different ids, and mixing them up is the usual mistake.**
`PUBLIC_GA_ID` is the measurement id (`G-` prefix) that the browser sends hits to.
`ga4_property_id` is the numeric property id the Data API reads from. You need both, in different
places.

### Localhost never counts

`gaId` resolves to `undefined` outside a production build, so `npm run dev` and preview builds emit
no tag at all. This is not paranoia: the portfolio's own Lighthouse CI quietly poisoned GotHired's
PostHog pageview funnels for weeks, and server-side events were the only clean source afterwards.
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

## Setup, once

1. Create a GA4 property for `gabrielrubens.com` (Admin -> Create property -> Web data stream).
2. Copy the **measurement id** (`G-XXXXXXXXXX`) into `PUBLIC_GA_ID` in the Cloudflare build env.
3. Copy the **property id** (digits, Admin -> Property Settings) into `ga4_property_id` in
   `~/dev/analytics/apps/gabrielrubens.yml`.
4. Grant the analytics service account Viewer on the property, so the Action can read it. The
   account is the one already used for the other properties; see `analytics/tools/ga4.py`.

Step 3 is guarded: `run_all.py` skips the site entirely while `ga4_property_id` is blank, so an
unfilled id never breaks a Monday collection. It starts reporting by itself once the id lands.

## What is still not measured

Nothing knows how a post performed *before* the click: no impressions, and no Search Console
either, because it is not confirmed whether a GSC property exists for this domain. Add
`gsc_property` to the yml and a `gsc` step in `run_all.py` if you verify one.
