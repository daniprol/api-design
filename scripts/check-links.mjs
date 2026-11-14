#!/usr/bin/env node
/**
 * Post-build internal link checker.
 *
 * Walks every HTML file in `dist/`, collects internal `href`s that start with
 * the site base, and verifies a matching page or file exists. Also checks that
 * `#fragment` targets exist on the target page. Exits 1 on broken links.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const BASE = "/api-design";

if (!existsSync(DIST)) {
  console.error("dist/ not found. Run `pnpm build` first.");
  process.exit(1);
}

/** @param {string} dir @returns {string[]} */
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html"));
const idCache = new Map();

/** @param {string} file */
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

/** @param {string} pathname */
const resolve = (pathname) => {
  const local = join(DIST, decodeURIComponent(pathname.slice(BASE.length)));
  if (existsSync(local) && statSync(local).isFile()) return local;
  const index = join(local, "index.html");
  return existsSync(index) ? index : undefined;
};

const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (!href.startsWith(`${BASE}/`) && href !== BASE) continue;
    const [pathname, hash] = href.split("#");
    const target = resolve(pathname);
    if (!target) {
      broken.push(`${relative(DIST, file)} → ${href} (page not found)`);
    } else if (hash && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(hash))) {
      broken.push(`${relative(DIST, file)} → ${href} (missing #${hash})`);
    }
  }
}

if (broken.length) {
  console.error(
    `✗ ${broken.length} broken internal link(s):\n  ${[...new Set(broken)].join("\n  ")}`,
  );
  process.exit(1);
}
console.log(`✓ Checked internal links in ${htmlFiles.length} pages. No broken links.`);
