---
title: "I spent months on SEO for a site Google had barely indexed"
description: "I thought GotHired had a ranking problem. I sampled 30 pages, found 1 in Google's index, and realised there was nothing to rank in the first place."
pubDate: 2026-07-31
draft: false
tags: [seo, indie, gothired]
---

For a long time I thought GotHired, my AI helper for job seekers, had a ranking problem. Traffic
was flat, so I did what you do about ranking: I wrote posts, improved titles, and built more pages,
because more pages sounded like more chances to be found.

None of it moved.

## I kept adding pages

I kept treating it as a content problem, so the blog grew and I added programmatic pages, one per
tool a job seeker might use, until there were 121 of them. Each looked reasonable on its own. I
checked positions in Search Console now and then, saw very little, and assumed I needed more time
and more content.

That assumption was the whole problem: I was reading the report that tells you how you rank, and
never the one that tells you whether Google kept the page at all.

## 30 pages, 1 indexed

I finally sampled 30 URLs and asked a different question, not "where do these rank" but "are these
indexed". One was: the homepage. Of the rest, 24 came back as "Crawled, currently not indexed" and
5 as "URL is unknown to Google". The blog was zero out of twelve.

So there was nothing to rank. I had been optimising the position of pages that were not in the
index, which is like polishing the shelf placement of a product the shop never accepted.

The cause was the 121 programmatic pages, near identical by design (one template with a tool name
swapped in), and to a crawler that looks like a site padding itself out. Google did not punish
those pages in isolation: it got quieter about the whole domain, including the writing I had
actually worked on.

## The fix was deletion

I noindexed all 121 of them and trimmed the sitemap from 223 URLs down to 100. I also stopped
submitting a page that robots.txt blocks, a small contradiction that tells a crawler "I do not know
what I am doing". Then I wrote it down as P0 in the repo, because the honest thing was to admit
that the content backlog sits downstream of a problem I had not solved.

The uncomfortable part is that it was all removal. I took away most of what I had added, and I do
not know yet whether it worked.

## Check indexation first

Here is the whole check, and it really does take five minutes. In Search Console, open the Pages
report: it splits your URLs into indexed and not indexed, and it names the reason for each group.
For a specific page, paste it into URL Inspection at the top. The two statuses worth learning are
"Crawled, currently not indexed", which means Google came, looked, and decided the page was not
worth keeping, and "URL is unknown to Google", which means it never arrived at all. Those are very
different problems, and neither one is about your title tag.

If you want a number you can track, sample a fixed set of URLs through the URL Inspection API and
count how many come back indexed. I wrote a small script to do that weekly. **Keep the same sample
every run**, because re-sampling different URLs each time gives you a figure that moves on its own
and tells you nothing.

Do this before you check rank. It decides whether the next three months of work can possibly
matter.

And be careful with pages that are cheap to generate. 121 of them took one afternoon to create and
cost me a lot longer than that to undo. If a page only differs from its neighbour by one word, it
is probably not a page.

I have set a gate for myself now: no new content on that site until the indexed count moves off one
out of thirty. If it has not moved in six weeks, then content was never the constraint and
authority is, which is a different and much slower piece of work.
