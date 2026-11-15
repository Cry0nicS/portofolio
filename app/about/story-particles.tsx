"use client";

// One cloud of dots that becomes each chapter of the story as the page scrolls, bursting apart between shapes.
import { useEffect, useRef } from "react";
import {
  LOGO_ACCENT,
  LOGO_CROSS,
  LOGO_CYCLE,
  LOGO_INK,
  LOGO_NODES,
  LOGO_ROUTE,
} from "../logo";

const INK = "#f00"; // marker colours when sampling a shape; drawn as --text and --accent
const ACCENT = "#0f0";
const NARROW = 1000; // below this the shape sits above the text, as in about.css
const RADIUS = 70; // px around the pointer that pushes dots away
const SHOCK = 220; // px reach of a click shockwave
const SPRING = 0.07;
const DAMPING = 0.82;
const BURST = 0.45; // how far dots fly between shapes, as a share of the smaller viewport side

type Shape = {
  w: number;
  h: number;
  draw: (c: CanvasRenderingContext2D) => void;
};

const PAD = 3; // the logo is drawn this far in from the shape's edge

// The header logo's run (globals.css): the pulse crosses the route in 1.9s of every 2.4s, and each node swells 1.5x as it passes
const SWELL = 0.14 * LOGO_CYCLE; // how long a node takes to shrink back
const PULSE = 0.03; // half the pulse's length, a dash of 6 on a route of pathLength 100
const SPIN = (Math.PI * 2) / (LOGO_CYCLE * 4); // node dots turn once every four runs

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

function disc(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  c.arc(x, y, r, 0, 7);
  c.fill();
}

const logo: Shape = {
  w: 143,
  h: 102,
  draw(c) {
    c.translate(PAD, PAD);
    c.fillStyle = INK;
    c.fill(new Path2D(LOGO_INK));
    c.fillStyle = ACCENT;
    c.fill(new Path2D(LOGO_ACCENT));
    // The route is cut out of the hooks, like the header logo
    c.globalCompositeOperation = "destination-out";
    c.lineWidth = 4;
    c.lineCap = c.lineJoin = "round";
    c.stroke(new Path2D(LOGO_ROUTE));
    for (const [x, y, r] of LOGO_NODES) disc(c, x, y, r);
  },
};

const gamepad: Shape = {
  w: 220,
  h: 130,
  draw(c) {
    c.fillStyle = ACCENT;
    c.fill(
      new Path2D(
        "M60 16H160C200 16 215 48 218 88C221 120 196 132 178 112L160 92H60L42 112C24 132 -1 120 2 88C5 48 20 16 60 16Z",
      ),
    );
    const pad = (r: number) => {
      c.fillRect(42 - r, 34 - r, 16 + 2 * r, 48 + 2 * r);
      c.fillRect(26 - r, 50 - r, 48 + 2 * r, 16 + 2 * r);
      for (const [x, y] of [
        [168, 38],
        [186, 58],
        [150, 58],
        [168, 78],
      ])
        disc(c, x, y, 9.5 + r);
      c.fillRect(94 - r, 54 - r, 12 + 2 * r, 5 + 2 * r);
      c.fillRect(114 - r, 54 - r, 12 + 2 * r, 5 + 2 * r);
    };
    c.globalCompositeOperation = "destination-out";
    pad(3);
    c.globalCompositeOperation = "source-over";
    c.fillStyle = INK;
    pad(0);
  },
};

const monitor: Shape = {
  w: 200,
  h: 156,
  draw(c) {
    c.fillStyle = INK;
    c.beginPath();
    c.roundRect(0, 0, 200, 128, 10);
    c.fill();
    c.fillRect(88, 128, 24, 18);
    c.beginPath();
    c.roundRect(56, 144, 88, 10, 5);
    c.fill();
    c.globalCompositeOperation = "destination-out";
    c.fillRect(10, 10, 180, 108);
    c.globalCompositeOperation = "source-over";
    // A prompt and a few lines of code on the screen
    c.strokeStyle = c.fillStyle = ACCENT;
    c.lineWidth = 6;
    c.lineCap = c.lineJoin = "round";
    c.beginPath();
    c.moveTo(26, 28);
    c.lineTo(40, 40);
    c.lineTo(26, 52);
    c.stroke();
    c.fillRect(48, 48, 18, 6);
    c.fillRect(26, 68, 96, 6);
    c.fillRect(40, 82, 120, 6);
    c.fillRect(40, 96, 70, 6);
  },
};

const braces: Shape = {
  w: 240,
  h: 160,
  draw(c) {
    c.fillStyle = ACCENT;
    c.font = `800 170px ${getComputedStyle(document.body).fontFamily}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("{", 34, 74);
    c.fillText("}", 206, 74);
    c.fillStyle = INK;
    c.fillRect(78, 50, 70, 9);
    c.fillRect(92, 72, 70, 9);
    c.fillRect(92, 94, 44, 9);
    c.fillRect(78, 116, 30, 9);
  },
};

const NODES = [
  [16, 80],
  [74, 26],
  [74, 134],
  [124, 80],
  [176, 26],
  [176, 134],
  [226, 80],
];
const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [1, 4],
  [2, 5],
];

const agents: Shape = {
  w: 242,
  h: 160,
  draw(c) {
    c.strokeStyle = INK;
    c.lineWidth = 3;
    for (const [a, b] of EDGES) {
      c.beginPath();
      c.moveTo(NODES[a][0], NODES[a][1]);
      c.lineTo(NODES[b][0], NODES[b][1]);
      c.stroke();
    }
    c.fillStyle = ACCENT;
    for (const [x, y] of NODES) disc(c, x, y, 15);
    c.globalCompositeOperation = "destination-out";
    for (const [x, y] of NODES) disc(c, x, y, 6);
  },
};

// One shape per chapter, in page order: start, play, code, ship, agents, handoff
const SHAPES = [logo, gamepad, monitor, braces, agents, logo];

type Box = { x: number; y: number; w: number; h: number };

// Where a chapter's shape sits: the logo big and centred, the others beside the text, above it on phones.
function boxFor(stage: number, w: number, h: number): Box {
  if (w < NARROW) return { x: 20, y: h * 0.05, w: w - 40, h: h * 0.38 };
  if (stage === 0 || stage === SHAPES.length - 1)
    return { x: w * 0.04, y: h * 0.03, w: w * 0.92, h: h * 0.54 };
  // Right half, clear of the chapter rail
  return { x: w * 0.5, y: h * 0.16, w: w * 0.5 - 170, h: h * 0.68 };
}

// Scale a shape to fit the box, centred in it
function fit(shape: Shape, box: Box) {
  const scale = Math.min(box.w / shape.w, box.h / shape.h);
  const cw = Math.ceil(shape.w * scale);
  const ch = Math.ceil(shape.h * scale);
  const left = box.x + (box.w - cw) / 2;
  const top = box.y + (box.h - ch) / 2;
  return { scale, cw, ch, left, top };
}

// Sample n points (x, y, isAccent) out of a shape drawn to fit the box.
function sample(shape: Shape, box: Box, n: number) {
  const { scale, cw, ch, left, top } = fit(shape, box);
  const off = document.createElement("canvas");
  off.width = cw;
  off.height = ch;
  const c = off.getContext("2d", { willReadFrequently: true })!;
  c.scale(scale, scale);
  shape.draw(c);
  const data = c.getImageData(0, 0, cw, ch).data;
  const hits: number[] = [];
  const step = Math.max(1, Math.floor(Math.sqrt((cw * ch) / (n * 4))));
  for (let y = 0; y < ch; y += step)
    for (let x = 0; x < cw; x += step) {
      const i = (y * cw + x) * 4;
      if (data[i + 3] > 128) hits.push(x, y, data[i + 1] > data[i] ? 1 : 0);
    }
  const out = new Float32Array(n * 3);
  const count = hits.length / 3;
  if (!count) hits.push(cw / 2, ch / 2, 1);
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * Math.max(1, count)) * 3;
    out[i * 3] = left + hits[k] + (Math.random() - 0.5) * step;
    out[i * 3 + 1] = top + hits[k + 1] + (Math.random() - 0.5) * step;
    out[i * 3 + 2] = hits[k + 2];
  }
  return out;
}

// The logo's dots: the hooks as sampled, then the nodes and the route drawn in the other hook's colour.
// rest is where each dot sits, laid out like sample(); off is how the run moves it from there, per kind of dot.
function logoDots(box: Box, n: number) {
  const { scale, left, top } = fit(logo, box);
  const nodeStart = Math.round(n * 0.67);
  const routeStart = Math.round(n * 0.85);
  const rest = new Float32Array(n * 3);
  rest.set(sample(logo, box, nodeStart));
  const offX = new Float32Array(n);
  const offY = new Float32Array(n);
  const owner = new Uint8Array(n); // the node a hook or node dot moves with
  const at = new Float32Array(n); // when the pulse passes a route dot
  const ink = new Path2D(LOGO_INK);
  const probe = document.createElement("canvas").getContext("2d")!;
  const put = (i: number, x: number, y: number) => {
    rest[i * 3] = left + (x + PAD) * scale;
    rest[i * 3 + 1] = top + (y + PAD) * scale;
    rest[i * 3 + 2] = probe.isPointInPath(ink, x, y) ? 1 : 0;
  };
  // Hook dots: the nearest node pushes them out as it swells, 1.5x at its rim fading to nothing 4 units away
  for (let i = 0; i < nodeStart; i++) {
    const x = (rest[i * 3] - left) / scale - PAD;
    const y = (rest[i * 3 + 1] - top) / scale - PAD;
    let gap = Infinity;
    LOGO_NODES.forEach(([nx, ny, r], k) => {
      const d = Math.hypot(x - nx, y - ny);
      if (d - r >= gap) return;
      gap = d - r;
      owner[i] = k;
      const push = (Math.max(0, 1 - gap / 4) * r * 0.5 * scale) / d;
      offX[i] = (x - nx) * push;
      offY[i] = (y - ny) * push;
    });
  }
  // Node dots: a ring and a core around each node, shared out by radius and spaced by the golden angle (2.4 rad)
  const radii = LOGO_NODES.reduce((sum, [, , r]) => sum + r, 0);
  let k = 0;
  let filled = LOGO_NODES[0][2];
  for (let i = nodeStart; i < routeStart; i++) {
    const j = i - nodeStart;
    while (((j + 0.5) / (routeStart - nodeStart)) * radii > filled)
      filled += LOGO_NODES[++k][2];
    const [nx, ny, r] = LOGO_NODES[k];
    const radius = r * (j % 4 ? 0.6 + Math.random() * 0.1 : Math.random() / 4);
    put(i, nx, ny);
    owner[i] = k;
    offX[i] = Math.cos(j * 2.4) * radius * scale;
    offY[i] = Math.sin(j * 2.4) * radius * scale;
  }
  // Route dots: three lanes along the runs, spaced evenly by length
  const total = LOGO_RUNS.reduce((sum, run) => sum + run.length, 0);
  for (let i = routeStart; i < n; i++) {
    let d = ((i - routeStart + 0.5) / (n - routeStart)) * total;
    let r = 0;
    while (d > LOGO_RUNS[r].length && r < LOGO_RUNS.length - 1)
      d -= LOGO_RUNS[r++].length;
    const { from, to, points, length } = LOGO_RUNS[r];
    const [x, y, nx, ny] = along(points, d);
    const lane = ((i % 3) - 1) * 0.34;
    put(i, x, y);
    offX[i] = nx * lane * scale;
    offY[i] = ny * lane * scale;
    at[i] = from + ((to - from) * d) / length;
  }
  return { rest, offX, offY, owner, at, nodeStart, routeStart };
}

// Scroll position to the chapter we are leaving and how far into the next one, holding still around each chapter's middle.
export function chapter(centres: number[], viewportMiddle: number) {
  const last = centres.length - 1;
  if (viewportMiddle <= centres[0]) return { from: 0, t: 0 };
  if (viewportMiddle >= centres[last]) return { from: last - 1, t: 1 };
  let from = 0;
  while (viewportMiddle > centres[from + 1]) from++;
  const raw =
    (viewportMiddle - centres[from]) / (centres[from + 1] - centres[from]);
  return { from, t: Math.min(1, Math.max(0, (raw - 0.25) / 0.5)) };
}

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function StoryParticles({
  onChapter,
}: {
  onChapter: (i: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const steps = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let still = motion.matches;

    let width = 0;
    let height = 0;
    let n = 0;
    let targets: Float32Array[] = [];
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let z = new Float32Array(0); // depth for mouse parallax, -1..1
    let delay = new Float32Array(0); // when a dot leaves its shape, 0..1
    let fly = new Float32Array(0); // burst direction and distance, x then y
    let rig: ReturnType<typeof logoDots> | null = null;
    let live = new Float32Array(0); // where the logo's dots head this frame, for both logo chapters
    let glow = new Float32Array(0); // how much each logo dot lights up this frame, 0..1
    const fire = new Float32Array(LOGO_NODES.length); // how swollen each node is, 0..1
    const spinX = new Float32Array(LOGO_NODES.length); // each node's turn and swell, as cos and sin
    const spinY = new Float32Array(LOGO_NODES.length);
    let mouse: { x: number; y: number } | null = null;
    const tilt = { x: 0, y: 0 };
    let frame = 0;
    let onScreen = true;
    let current = -1;
    let colours = ["", ""]; // ink, accent; read again when the theme changes
    function readColours() {
      const style = getComputedStyle(canvas!);
      colours = [style.borderTopColor, style.color];
    }

    function layout() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      if (!width) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const next = width < 700 ? 2600 : width < NARROW ? 4200 : 6400;
      if (next !== n) {
        // New cloud: every dot starts somewhere random and flies home, which is the intro
        n = next;
        x = new Float32Array(n);
        y = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        z = new Float32Array(n);
        delay = new Float32Array(n);
        fly = new Float32Array(n * 2);
        for (let i = 0; i < n; i++) {
          x[i] = Math.random() * width;
          y[i] = Math.random() * height;
          z[i] = Math.random() * 2 - 1;
          delay[i] = Math.random();
          const angle = Math.random() * Math.PI * 2;
          const far = (0.2 + Math.random() * 0.8) * BURST;
          fly[i * 2] = Math.cos(angle) * far;
          fly[i * 2 + 1] = Math.sin(angle) * far;
        }
      }
      rig = logoDots(boxFor(0, width, height), n);
      live = rig.rest.slice();
      glow = new Float32Array(n);
      runLogo(LOGO_CYCLE - 1); // a quiet moment, the pulse gone and no node swelling: what still mode shows
      targets = SHAPES.map((shape, i) =>
        shape === logo ? live : sample(shape, boxFor(i, width, height), n),
      );
      if (still) {
        const home = targets[0];
        for (let i = 0; i < n; i++) {
          x[i] = home[i * 3];
          y[i] = home[i * 3 + 1];
        }
      }
    }

    // Play the header logo's run on the logo's dots: move where they head and let the springs carry them there
    function runLogo(now: number) {
      if (!rig) return;
      const { rest, offX, offY, owner, at, nodeStart, routeStart } = rig;
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

    function progress() {
      const centres = steps.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      return chapter(centres, window.innerHeight / 2);
    }

    function draw() {
      if (!n || !targets.length) return;
      let { from, t } = progress();
      if (still) {
        // No flight: show whichever chapter is nearer
        from = t < 0.5 ? from : from + 1;
        t = 0;
      }
      const near = t < 0.5 ? from : from + 1;
      if (near !== current) onChapter((current = near));
      const last = SHAPES.length - 1;
      const to = Math.min(from + 1, last);
      if (!still && (from === 0 || to === last)) runLogo(performance.now());
      const logoFrom = from === 0 ? 1 : 0;
      const logoTo = to === last ? 1 : 0;
      const a = targets[from];
      const b = targets[to];
      const span = Math.min(width, height);
      tilt.x += ((mouse ? mouse.x / width - 0.5 : 0) - tilt.x) * 0.05;
      tilt.y += ((mouse ? mouse.y / height - 0.5 : 0) - tilt.y) * 0.05;
      ctx!.clearRect(0, 0, width, height);

      for (let pass = 0; pass < 2; pass++) {
        ctx!.fillStyle = colours[pass];
        for (let i = 0; i < n; i++) {
          // Each dot leaves on its own beat, flies out, and lands in the next shape
          const own = Math.min(1, Math.max(0, (t - delay[i] * 0.4) / 0.6));
          const e = ease(own);
          const accent = (e < 0.5 ? a : b)[i * 3 + 2];
          if (accent !== pass) continue;
          const burst = Math.sin(own * Math.PI) * span;
          let hx = a[i * 3] + (b[i * 3] - a[i * 3]) * e + fly[i * 2] * burst;
          let hy =
            a[i * 3 + 1] +
            (b[i * 3 + 1] - a[i * 3 + 1]) * e +
            fly[i * 2 + 1] * burst;
          if (still) {
            x[i] = hx;
            y[i] = hy;
          } else {
            hx += tilt.x * z[i] * 28;
            hy += tilt.y * z[i] * 28;
            vx[i] += (hx - x[i]) * SPRING;
            vy[i] += (hy - y[i]) * SPRING;
            if (mouse) {
              const dx = x[i] - mouse.x;
              const dy = y[i] - mouse.y;
              const dist = Math.hypot(dx, dy) || 1;
              if (dist < RADIUS) {
                const force = (1 - dist / RADIUS) * 3;
                vx[i] += (dx / dist) * force;
                vy[i] += (dy / dist) * force;
              }
            }
            vx[i] *= DAMPING;
            vy[i] *= DAMPING;
            x[i] += vx[i];
            y[i] += vy[i];
          }
          // In flight dots swell, brighten and leave a short trail, as do the logo's nodes and route on its run
          const lit = glow[i] * (logoFrom + (logoTo - logoFrom) * e);
          const lift = Math.max(Math.sin(own * Math.PI), lit);
          const size = (1.4 + (z[i] + 1) * 0.45) * (1 + 1.8 * lift);
          const alpha = (pass ? 0.55 : 0.7) + (z[i] + 1) * 0.15;
          ctx!.globalAlpha = alpha + (1 - alpha) * lift;
          ctx!.fillRect(x[i] - size / 2, y[i] - size / 2, size, size);
          if (lift > 0.1 && !still) {
            ctx!.globalAlpha *= 0.4;
            ctx!.fillRect(
              x[i] - vx[i] * 2.5 - size / 4,
              y[i] - vy[i] * 2.5 - size / 4,
              size / 2,
              size / 2,
            );
          }
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop() {
      draw();
      frame = requestAnimationFrame(loop);
    }

    function update() {
      const run = !still && onScreen && !document.hidden && width > 0;
      if (run && !frame) frame = requestAnimationFrame(loop);
      if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (still) draw();
    }

    // Reduced motion can change while the page is open: stop or start the loop, and rest the logo for still mode
    function onMotion() {
      still = motion.matches;
      if (still) runLogo(LOGO_CYCLE - 1);
      update();
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const box = canvas!.getBoundingClientRect();
      mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    function onLeave() {
      mouse = null;
    }
    // Click or tap anywhere that is not a control: a shockwave throws nearby dots outwards
    let down: { x: number; y: number } | null = null;
    function onDown(event: PointerEvent) {
      down = { x: event.clientX, y: event.clientY };
    }
    function onUp(event: PointerEvent) {
      const tap =
        down && Math.hypot(event.clientX - down.x, event.clientY - down.y) < 10;
      down = null;
      if (!tap || still || (event.target as Element).closest("a, button"))
        return;
      const box = canvas!.getBoundingClientRect();
      const cx = event.clientX - box.left;
      const cy = event.clientY - box.top;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - cx;
        const dy = y[i] - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < SHOCK) {
          const force = (1 - dist / SHOCK) * (18 + Math.random() * 14);
          vx[i] += (dx / dist) * force;
          vy[i] += (dy / dist) * force;
        }
      }
    }
    // Still mode has no loop: repaint when scrolling picks another chapter
    function onScroll() {
      if (still) draw();
    }

    // Resampling reshuffles the dots, so skip the small height changes of a phone's URL bar and settle first
    let resizing = 0;
    let cancelled = false;
    const resizer = new ResizeObserver(() => {
      const sameWidth = canvas.clientWidth === width;
      if (sameWidth && Math.abs(canvas.clientHeight - height) < 120) return;
      clearTimeout(resizing);
      resizing = window.setTimeout(
        () => {
          layout();
          update();
        },
        width ? 150 : 0,
      );
    });
    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    const recolour = () => {
      readColours();
      update();
    };
    const theme = new MutationObserver(recolour);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    resizer.observe(canvas);
    watcher.observe(canvas);
    theme.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
    });
    scheme.addEventListener("change", recolour);
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    // The braces are type: sample again once the display face has loaded
    readColours();
    document.fonts.ready.then(() => {
      if (cancelled) return;
      layout();
      update();
    });
    return () => {
      cancelled = true;
      clearTimeout(resizing);
      resizer.disconnect();
      watcher.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", recolour);
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      frame = 0;
    };
  }, [onChapter]);

  return <canvas ref={ref} className="ab-canvas" aria-hidden="true" />;
}
