import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  esportsStats,
  esportsTimeline,
  hostOf,
  projects,
  releases,
  sideProjects,
} from "./content";

const ids: string[] = releases.map((r) => r.id);

test("release ids are unique and none is contact", () => {
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).not.toContain("contact");
});

test("every short label fits the phone dock", () => {
  for (const r of releases) expect(r.short.length).toBeLessThanOrEqual(7);
});

test("the homepage lists releases in the same order", () => {
  const page = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
  const used = [...page.matchAll(/<Release id="([^"]+)"/g)].map((m) => m[1]);
  expect(used).toEqual(ids);
});

test("side project hosts are derived from https links", () => {
  for (const p of sideProjects) expect(p.href).toStartWith("https://");
  expect(sideProjects.map((p) => hostOf(p.href))).toEqual([
    "chaptify.app",
    "cafeprana.de",
    "github.com",
  ]);
});

test("only the Cancer Type Classifier is discontinued", () => {
  expect(
    sideProjects.filter((p) => p.discontinued).map((p) => p.title),
  ).toEqual(["Cancer Type Classifier"]);
});

test("titles are unique within each list (React keys)", () => {
  for (const list of [projects, sideProjects, esportsTimeline]) {
    const titles = list.map((e) => e.title);
    expect(new Set(titles).size).toBe(titles.length);
  }
  const stats = esportsStats.map((e) => e.stat);
  expect(new Set(stats).size).toBe(stats.length);
});
