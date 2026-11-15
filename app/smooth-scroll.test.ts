import { expect, test } from "bun:test";
import { scrollAt, scrollDuration } from "./smooth-scroll";

// Paced by distance within bounds, plus a beat per waypoint passed, under one overall cap.
test("scroll duration paces by distance, up or down", () => {
  expect(scrollDuration(900, 900)).toBe(600);
  expect(scrollDuration(-900, 900)).toBe(600);
  expect(scrollDuration(20, 900)).toBe(400);
  expect(scrollDuration(90000, 900)).toBe(900);
});

test("scroll duration adds a beat per waypoint, capped", () => {
  expect(scrollDuration(900, 900, 2)).toBe(1500);
  expect(scrollDuration(4500, 900, 4)).toBe(2500);
});

// It must move on the very first frame: no ease-in ramp.
test("scroll leaves briskly", () => {
  expect(scrollAt([0, 1000], 16, 600).top).toBeGreaterThan(40);
});

test("scroll lands exactly at the end, up or down", () => {
  expect(scrollAt([0, 900, 1800], 1000, 1000)).toEqual({
    top: 1800,
    done: true,
  });
  expect(scrollAt([1800, 900, 0], 1000, 1000)).toEqual({ top: 0, done: true });
});

// Through a waypoint it slows to a fifth of the leg's pace but never stops.
test("scroll slows through a waypoint without stopping", () => {
  const at = (ms: number) => scrollAt([0, 900, 1800], ms, 1000).top;
  expect(at(500)).toBeCloseTo(900);
  const near = at(510) - at(490);
  const away = at(260) - at(240);
  expect(near).toBeGreaterThan(0);
  expect(near).toBeLessThan(away / 3);
});
