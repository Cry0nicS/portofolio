import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import robots from "./robots";
import { pageMetadata, site } from "./site";
import sitemap from "./sitemap";

const file = (path: string) =>
  `${import.meta.dir}${path === "/" ? "" : path}/page.tsx`;

test("every listed page has a route file; non-home pages build metadata from their own path", () => {
  for (const { path } of site.pages) {
    expect(existsSync(file(path))).toBe(true);
    if (path !== "/")
      expect(readFileSync(file(path), "utf8")).toContain(
        `pageMetadata("${path}")`,
      );
  }
});

test("canonical and og url equal the path; noindex exactly for legal pages", () => {
  for (const page of site.pages) {
    const m = pageMetadata(page.path);
    expect(m.alternates?.canonical).toBe(page.path);
    expect(m.openGraph?.url).toBe(page.path);
    expect(m.robots).toEqual("legal" in page ? { index: false } : undefined);
  }
});

test("sitemap lists the indexable pages only, home without a trailing slash", () => {
  expect(sitemap().map((e) => e.url)).toEqual([
    site.origin,
    `${site.origin}/about`,
  ]);
});

test("robots points at the sitemap on the origin", () => {
  expect(robots().sitemap).toStartWith(site.origin);
});
