import { expect, test } from "bun:test";
import { LOGO_NODES, LOGO_RUNS, along, chapter } from "./story-particles";

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
