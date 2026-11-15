import { expect, test } from "bun:test";
import { LOGO_CROSS, LOGO_NODES } from "../logo";
import { LOGO_STILL, logoRig } from "./logo-rig";

// One hook dot and one node dot on node 2, and one route dot the pulse passes halfway along
const K = 2;
const dots = () => ({
  rest: new Float32Array([10, 20, 1, 30, 40, 0, 50, 60, 1]),
  offX: new Float32Array([3, 4, 2]),
  offY: new Float32Array([4, 0, 0]),
  owner: new Uint8Array([K, K, 0]),
  at: new Float32Array([0, 0, 0.5]),
  nodeStart: 1,
  routeStart: 2,
});
const moved = (live: Float32Array, rest: Float32Array, i: number) =>
  Math.hypot(live[i * 3] - rest[i * 3], live[i * 3 + 1] - rest[i * 3 + 1]);

test("reduced motion rests: no glow and hook dots at rest", () => {
  const { rest } = dots();
  const rig = logoRig(dots());
  rig.step(LOGO_STILL);
  expect([...rig.glow]).toEqual([0, 0, 0]);
  expect([rig.live[0], rig.live[1]]).toEqual([rest[0], rest[1]]);
});

test("a node fires when the pulse reaches it on the route", () => {
  const { rest } = dots();
  const rig = logoRig(dots());
  rig.step(LOGO_NODES[K][3] * LOGO_CROSS);
  expect(rig.glow[1]).toBe(1);
  expect(moved(rig.live, rest, 0)).toBeCloseTo(5); // the hook dot pushed its full offset
  expect(moved(rig.live, rest, 1)).toBeCloseTo(4 * 1.5); // the node dot swollen 1.5x
});

test("a route dot glows as the pulse passes and not after", () => {
  const { rest } = dots();
  const rig = logoRig(dots());
  rig.step(0.5 * LOGO_CROSS);
  expect(rig.glow[2]).toBeCloseTo(1);
  expect(moved(rig.live, rest, 2)).toBeCloseTo(2 * 4); // its lane 4x wider
  rig.step(0.6 * LOGO_CROSS);
  expect(rig.glow[2]).toBe(0);
  expect(moved(rig.live, rest, 2)).toBeCloseTo(2);
});

// The canvas holds live as the target of both logo Chapters, so it must never be swapped out
test("live positions keep their identity across steps", () => {
  const rig = logoRig(dots());
  const { live, glow } = rig;
  rig.step(100);
  rig.step(LOGO_STILL);
  expect(rig.live).toBe(live);
  expect(rig.glow).toBe(glow);
});
