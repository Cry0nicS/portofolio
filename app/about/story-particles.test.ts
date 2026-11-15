import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { LOGO_CROSS, LOGO_CYCLE, LOGO_NODES } from "../logo";
import { CHAPTERS, chapter } from "./chapters";
import { LOGO_RUNS, along } from "./story-particles";

// Scroll maps to a chapter pair and holds still around each chapter's centre.
test("chapter progress", () => {
  const centres = [100, 300, 500];
  expect(chapter(centres, 0)).toEqual({ from: 0, t: 0 });
  expect(chapter(centres, 140)).toEqual({ from: 0, t: 0 }); // still holding the first shape
  expect(chapter(centres, 200)).toEqual({ from: 0, t: 0.5 });
  expect(chapter(centres, 400)).toEqual({ from: 1, t: 0.5 });
  expect(chapter(centres, 999)).toEqual({ from: 1, t: 1 });
});

// The header pulse reaches each node at its --at (globals.css), so the route the logo dots follow must be inside the node then too.
test("logo route meets each node on the header's beat", () => {
  for (const [x, y, r, at] of LOGO_NODES) {
    const met = LOGO_RUNS.some(({ from, to, points, length }) => {
      if (at < from || at > to) return false;
      const [px, py] = along(points, ((at - from) / (to - from)) * length);
      return Math.hypot(px - x, py - y) < r; // inside the node as it fires
    });
    expect(met).toBe(true);
  }
});

// The header's timing lives in globals.css, the particle logo's in app/logo.ts: they must not drift apart.
test("globals.css logo timing matches the shared logo", () => {
  const css = readFileSync(new URL("../globals.css", import.meta.url), "utf8");
  const at = [...css.matchAll(/--at:\s*([\d.]+);/g)].map((m) => Number(m[1]));
  expect(at).toEqual(LOGO_NODES.map((n) => n[3]));
  const cycle = `${LOGO_CYCLE / 1000}s`;
  const cross = `${LOGO_CROSS / 1000}s`;
  const has = (re: string) =>
    expect(css).toMatch(new RegExp(re.replace(/ /g, "\\s+")));
  has(`logo-fire ${cycle} calc\\(0\\.4s \\+ var\\(--at\\) \\* ${cross}\\)`);
  has(`logo-pulse ${cycle} 0\\.4s`);
  has(`logo-fire-hover ${cycle} calc\\(var\\(--at\\) \\* ${cross}\\) infinite`);
  has(`logo-pulse-hover ${cycle} linear infinite`);
});

// The page's sections must follow the Chapter list, or the rail highlights the wrong label.
test("page sections follow the Chapter list", () => {
  const page = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
  const ids = [...page.matchAll(/id="([^"]+)"\s+data-chapter/g)].map(
    (m) => m[1],
  );
  expect(ids).toEqual(CHAPTERS.map(({ id }) => id));
});
