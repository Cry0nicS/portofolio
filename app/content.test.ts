import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { releases } from "./content";

const ids = releases.map((r) => r.id);

test("release ids are unique and none is contact", () => {
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).not.toContain("contact" as never);
});

test("every short label fits the phone dock", () => {
  for (const r of releases) expect(r.short.length).toBeLessThanOrEqual(7);
});

test("the homepage lists releases in the same order", () => {
  const page = readFileSync("app/page.tsx", "utf8");
  const used = [...page.matchAll(/<Release id="([^"]+)"/g)].map((m) => m[1]);
  expect(used).toEqual(ids);
});
