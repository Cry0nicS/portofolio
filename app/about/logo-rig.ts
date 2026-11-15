// The header logo's run played on the /about logo's dots: nodes swell and spin, the pulse runs the route and lights what it passes.
import { LOGO_CROSS, LOGO_CYCLE, LOGO_NODES } from "../logo";

// The header logo's run (globals.css): the pulse crosses the route in 1.9s of every 2.4s, and each node swells 1.5x as it passes
const SWELL = 0.14 * LOGO_CYCLE; // how long a node takes to shrink back
const PULSE = 0.03; // half the pulse's length, a dash of 6 on a route of pathLength 100
const SPIN = (Math.PI * 2) / (LOGO_CYCLE * 4); // node dots turn once every four runs
export const LOGO_STILL = LOGO_CYCLE - 1; // the quiet moment reduced motion shows: the pulse gone and no node swelling

// Points along a run, x then y; a 4-number segment is a quadratic curve (control point, end), flattened into short lines
function polyline(...segments: number[][]) {
  const out = segments[0].slice();
  for (const s of segments.slice(1)) {
    if (s.length === 2) {
      out.push(...s);
      continue;
    }
    const x0 = out[out.length - 2];
    const y0 = out[out.length - 1];
    for (let k = 1; k <= 8; k++) {
      const u = k / 8;
      const m = 1 - u;
      out.push(
        m * m * x0 + 2 * m * u * s[0] + u * u * s[2],
        m * m * y0 + 2 * m * u * s[1] + u * u * s[3],
      );
    }
  }
  return out;
}

function runLength(points: number[]) {
  let length = 0;
  for (let i = 2; i < points.length; i += 2)
    length += Math.hypot(
      points[i] - points[i - 2],
      points[i + 1] - points[i - 1],
    );
  return length;
}

// LOGO_ROUTE as runs, and when the pulse covers each: the main line, then the branch down to the sub-node
export const LOGO_RUNS = [
  {
    from: 0,
    to: 1,
    points: polyline(
      [23, 48],
      [28.5, 32],
      [33, 17, 50, 17],
      [113, 17],
      [113, 48],
      [107.5, 64],
      [103, 79, 86, 79],
      [23, 79],
    ),
  },
  { from: 0.85, to: 0.92, points: [58, 79, 58, 90] },
].map((run) => ({ ...run, length: runLength(run.points) }));

// The point at distance d along a run and the unit normal there: x, y, nx, ny
export function along(points: number[], d: number) {
  let i = 2;
  let len = Math.hypot(points[2] - points[0], points[3] - points[1]);
  while (d > len && i < points.length - 2) {
    d -= len;
    i += 2;
    len = Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1]);
  }
  const dx = (points[i] - points[i - 2]) / len;
  const dy = (points[i + 1] - points[i - 1]) / len;
  const u = Math.min(d, len);
  return [points[i - 2] + dx * u, points[i - 1] + dy * u, -dy, dx];
}

// The logo's dots: hooks below nodeStart, nodes below routeStart, then the route.
// rest is x, y, isAccent per dot; off is how the run moves it from there; owner is the node a hook or node dot moves with; at is when the pulse passes a route dot.
export type LogoDots = {
  rest: Float32Array;
  offX: Float32Array;
  offY: Float32Array;
  owner: Uint8Array;
  at: Float32Array;
  nodeStart: number;
  routeStart: number;
};

export function logoRig({
  rest,
  offX,
  offY,
  owner,
  at,
  nodeStart,
  routeStart,
}: LogoDots) {
  const n = offX.length;
  const live = rest.slice(); // where each dot heads this frame, written in place
  const glow = new Float32Array(n); // how much each dot lights up this frame, 0..1
  const fire = new Float32Array(LOGO_NODES.length); // how swollen each node is, 0..1
  const spinX = new Float32Array(LOGO_NODES.length); // each node's turn and swell, as cos and sin
  const spinY = new Float32Array(LOGO_NODES.length);

  function step(now: number) {
    const time = now % LOGO_CYCLE;
    const pulse = time / LOGO_CROSS; // how far along the route the pulse is; past 1 it has gone
    for (let k = 0; k < LOGO_NODES.length; k++) {
      const since =
        (time - LOGO_NODES[k][3] * LOGO_CROSS + LOGO_CYCLE) % LOGO_CYCLE;
      fire[k] = Math.max(0, 1 - since / SWELL);
      const turn = now * SPIN * (k % 2 ? 1 : -1);
      spinX[k] = Math.cos(turn) * (1 + 0.5 * fire[k]);
      spinY[k] = Math.sin(turn) * (1 + 0.5 * fire[k]);
    }
    for (let i = 0; i < n; i++) {
      const k = owner[i];
      let dx = offX[i];
      let dy = offY[i];
      if (i < nodeStart) {
        dx *= fire[k];
        dy *= fire[k];
      } else if (i < routeStart) {
        dx = offX[i] * spinX[k] - offY[i] * spinY[k];
        dy = offX[i] * spinY[k] + offY[i] * spinX[k];
        glow[i] = fire[k];
      } else {
        // The lanes spread as the pulse passes
        glow[i] = Math.max(0, 1 - Math.abs(at[i] - pulse) / PULSE);
        dx *= 1 + 3 * glow[i];
        dy *= 1 + 3 * glow[i];
      }
      live[i * 3] = rest[i * 3] + dx;
      live[i * 3 + 1] = rest[i * 3 + 1] + dy;
    }
  }

  return { live, glow, step };
}
