import { expect, test } from "bun:test";
import { scrollAt, scrollDuration } from "./smooth-scroll";

// Long jumps take longer so what scrolling drives gets its moment, within bounds.
test("scroll duration paces by viewports travelled, up or down", () => {
  expect(scrollDuration(900, 900)).toBe(800);
  expect(scrollDuration(-1800, 900)).toBe(1600);
});

test("scroll duration has a floor for short hops and a cap for long ones", () => {
  expect(scrollDuration(20, 900)).toBe(350);
  expect(scrollDuration(90000, 900)).toBe(1800);
});

// Each leg eases out into its stop, so a passed chapter comes to rest before the next leg leaves.
test("scroll stops at each waypoint on the way", () => {
  const legs = [0, 900, 1800];
  expect(scrollAt(legs, 0, 900)).toEqual({ top: 0, done: false });
  expect(scrollAt(legs, 400, 900)).toEqual({ top: 450, done: false });
  expect(scrollAt(legs, 800, 900)).toEqual({ top: 900, done: false });
  expect(scrollAt(legs, 1600, 900)).toEqual({ top: 1800, done: true });
});

test("scroll runs backwards through waypoints too", () => {
  expect(scrollAt([1800, 900, 0], 1200, 900)).toEqual({
    top: 450,
    done: false,
  });
});
