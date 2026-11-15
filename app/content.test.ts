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
  for (const p of sideProjects) {
    expect(p.href).toStartWith("https://");
    // Every current project shows a bare host: its link's hostname minus a leading www.
    const host = hostOf(p.href);
    expect(host).not.toStartWith("www.");
    expect(new URL(p.href).hostname.endsWith(host)).toBe(true);
    expect(host.length).toBeGreaterThan(0);
  }
  expect(hostOf("https://www.example.de/x")).toBe("example.de");
  expect(hostOf("https://github.com/a/b")).toBe("github.com");
});

test("titles are unique within each list (React keys)", () => {
  for (const list of [projects, sideProjects, esportsTimeline]) {
    const titles = list.map((e) => e.title);
    expect(new Set(titles).size).toBe(titles.length);
  }
  const stats = esportsStats.map((e) => e.stat);
  expect(new Set(stats).size).toBe(stats.length);
});
