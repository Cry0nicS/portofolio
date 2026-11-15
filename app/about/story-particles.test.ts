import { expect, test } from "bun:test";
import { chapter } from "./story-particles";

// Scroll maps to a chapter pair and holds still around each chapter's centre.
test("chapter progress", () => {
  const centres = [100, 300, 500];
  expect(chapter(centres, 0)).toEqual({ from: 0, t: 0 });
  expect(chapter(centres, 140)).toEqual({ from: 0, t: 0 }); // still holding the first shape
  expect(chapter(centres, 200)).toEqual({ from: 0, t: 0.5 });
  expect(chapter(centres, 400)).toEqual({ from: 1, t: 0.5 });
  expect(chapter(centres, 999)).toEqual({ from: 1, t: 1 });
});
