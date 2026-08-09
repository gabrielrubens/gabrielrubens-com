---
title: "Every check was green and one of my apps had not deployed in ten weeks"
description: "I spent a week chasing a flaky deploy step. The instrumentation I added to diagnose it found something worse: another one of my apps had not deployed at all in ten weeks, and every check was green."
pubDate: 2026-08-07
draft: false
tags: [ci, deploy, indie, pensio, farlist]
---

For about a week, releasing Pensio (my AI journaling app) came with a tax. Every few deploys the
same step would fail: `Wait for VPS SSH to be reachable`, the little gate that checks the VPS is
there before Kamal starts. It would poll for ten minutes, find nothing, and go red. A rerun almost
always worked, so I treated it as weather and typed `gh run rerun` a lot.

## I blamed the host three times

First it was fail2ban, which was wrong, and I had to write a commit whose whole job was to stop
saying so. Then ufw, also wrong: the firewall was open throughout a live episode. Then some
transient inside the box, a wedged sshd or a full accept queue. I also had two cheap fixes queued
up and ready to build: move SSH out of the way of scanners, or start a Tailscale tunnel on the
runner.

Every one of those theories lives inside my server, and I kept reaching for them because that is
the part I can log into. A CI timeout is also a bad witness: it can mean a slow build, a wedged
service, or just the more than 6,000 tests that run on every push, so my first instinct was that
the problem was something of mine being too slow.

The clue I under used for days is that the same deploy works from my own laptop. Same Kamal 2
command, same host, same key, connecting on the first try every time. Only GitHub Actions could
not get there.

## Thirty five seconds apart, and only one of them got in

The measurement that ended it was an adjacency in the logs. One deploy job burned all 32 of its
polls against the VPS between 21:09 and 21:20. The next job, on a different runner, connected on
its first try at 21:20:48. Same server, same key, same command, 35 seconds later. No condition
inside a host is selectively invisible to one visitor for ten minutes and instantly open to the
next one.

So I stopped guessing and instrumented the gate instead: print the runner's public IP on every
run, then test the path to my VPS several different ways, plus a completely unrelated second VPS
of mine, before the deploy starts. The next blocked runner printed the answer. Every route to both
servers was dead, and in the same second a plain HTTPS call to a third party from that same runner
succeeded. The runner's internet was fine. My provider, specifically, was unreachable from that one
address.

That killed both of my cheap fixes at once. Moving SSH somewhere else does nothing when
everything else is blocked as well, and a tunnel started on the runner cannot come up when the
runner cannot reach the box in the first place either. The
block is per source IP and provider wide, so the answer is a stable address (a self hosted runner
or a bastion), which I have deliberately not built yet. What I shipped instead is the boring
mitigation: retry the deploy on a fresh runner, which is `gh run rerun` with me removed from it. It
rescued five of the next six blocked deploys.

I want to be honest that this is a workaround and not a fix. I still cannot explain why it started
when it did. There were zero of these failures in the 119 deploy runs of the three weeks before
August 1, and I changed nothing in my own infrastructure on that date, so something upstream moved
and I am routing around it rather than solving it.

## The release that never reached production

Then the mitigation caused exactly the bug it was supposed to prevent. I tagged v0.73.1, every job
reported success, the GitHub Release published itself, and production stayed on v0.73.0. I shipped
v0.73.2 for no reason other than to make v0.73.1 exist on the server.

The mechanism is a GitHub Actions detail worth knowing: a `skipped` result propagates transitively
through `needs`. On a good day the retry job is skipped, and that skip kept travelling down the
graph until production inherited it, even though production's own direct dependencies had all
succeeded. The cause was a decision I had written up as a virtue at the time: I left the
production job's `if:` condition byte identical, because it is the highest blast radius line in the
file. The instinct was right and the result was wrong. **An unchanged condition is only
conservative if its inputs are unchanged too.** I fixed it with a stricter condition, not a looser
one, and put the workflow YAML under test for the first time.

## What the backport found in Farlist

With Pensio soaked for a couple of days I copied the diagnostic step out to my other four apps.
Farlist, my slow journal for long arc goals, ran it once and printed a completely clean path to its
server, so the network was never its problem.

Its deploy had been failing on every single attempt since May 25. Ten weeks. The cause was an
expired GHCR token, which is a thirty second fix. Everything merged in that window was built,
tested, and never shipped, including the Active Storage patch I had merged the day before.

The reason nobody noticed is the part I want to remember, because none of it was carelessness. The
branch looked healthy, since Dependabot's green runs are what you see first in the run list. The
failure lived in a job inside a different workflow, so you have to already suspect it to filter for
it. And the site returned HTTP 200 the entire time, because it was serving old code, not down.
Uptime monitoring is blind to this by construction. Pinging a URL can never tell you which version
answered.

## Check the sha, not the pipeline

The guard I shipped to all five apps is a daily scheduled workflow that asks one question: is the
sha running on the server the sha that should be running.

My first idea was "alert if there has been no deploy in N days", and it is wrong. A quiet app can
legitimately go a month without a commit, so that check cries wolf, and a check that cries wolf is
one you train yourself to ignore. The precise invariant, the one that was actually violated for ten
weeks, is deployed version equals intended version. It has no false positives from inactivity.

If you have a side project that deploys itself, this is the five minute version: open the last
successful deploy run, find the commit it shipped, and compare it to the head of your main branch.
Not the badge, not the run list, the sha. Green CI tells you your pipeline ran. It does not tell you
your app changed.

I am still not sure the SSH block is permanent or a passing episode, so the structural fix stays
parked with a date on it. The drift check I would keep either way.

There is a second reason to revisit it, and it is money rather than reliability. I deploy a lot:
72 deploy triggering runs in four days on one app, across five apps that all build and test on
every push. A runner of my own would fix the block for free, since the connection would never
leave the box, and it would cut what I spend on build minutes. What stops me is that it is one
more service to run, patch and monitor, and right now everything lives in one place. I have not
worked out yet whether the saving is bigger than the cost of that extra moving part.
