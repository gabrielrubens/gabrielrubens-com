// Stamp the commit being built into public/version.json.
//
// This site has no CI. `npm run deploy` is a manual `wrangler deploy` from a
// laptop, so there is NO deploy run anywhere to read a deployed sha from. The
// only witness to what is actually live is the live site, which means the site
// has to carry its own version. That file is what .github/workflows/deploy-drift.yml
// fetches.
//
// Runs as npm's `prebuild`, so it fires for `npm run build` AND `npm run deploy`
// without either script having to remember it.
//
// Deliberately fails the build if git is unavailable or the tree has no commit:
// a version.json containing "unknown" would make the drift check green forever,
// which is the failure this whole thing exists to catch.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/version.json");

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

let sha;
try {
  sha = git("rev-parse", "HEAD");
} catch (err) {
  console.error("stamp-version: cannot read the git sha, refusing to build.");
  console.error(err.message);
  process.exit(1);
}

// A deploy from a dirty tree ships code that is not in any commit, so the sha
// alone would be a lie. Record it rather than block: the answer to "is what is
// running what should be running" is then honestly "cannot tell".
let dirty = false;
try {
  dirty = git("status", "--porcelain").length > 0;
} catch {
  dirty = false;
}

const payload = {
  sha,
  short: sha.slice(0, 8),
  dirty,
  builtAt: new Date().toISOString(),
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
console.log(`stamp-version: ${payload.short}${dirty ? " (DIRTY TREE)" : ""}`);
