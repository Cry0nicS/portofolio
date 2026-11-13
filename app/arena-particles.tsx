"use client";

// An esports arena in dots between the berlin and esports releases: light rig, big screen, two team booths, crowd.
import { useEffect, useRef } from "react";
import { runParticles, type Point } from "./particles";

const BEAMS = [0.07, 0.22, 0.36, 0.64, 0.78, 0.93]; // light positions along the truss, as a share of the width
const HEAD_GAP = 22; // px between crowd heads
const DENSITY = 0.42; // share of the shape counts below drawn at full width; keeps the total near 2,500

export function arena(w: number, h: number) {
  const out: Point[] = [];
  const r = Math.random;
  const k = DENSITY * Math.min(1, w / 700); // fewer dots on narrow screens
  const add = (
    n: number,
    a: number,
    at: (t: number) => [number, number],
    f?: number,
  ) => {
    // t steps evenly through 0..1 with a little jitter, so lines read as lines with few dots
    const count = Math.round(n * k);
    for (let i = 0; i < count; i++)
      out.push([...at((i + 0.3 + r() * 0.4) / count), a, f]);
  };
  // Shapes in shares of the width (u) and height (v)
  const between = (a: number, b: number) => a + r() * (b - a);
  const line = (
    n: number,
    a: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
  ) => add(n, a, (t) => [(u0 + (u1 - u0) * t) * w, (v0 + (v1 - v0) * t) * h]);
  const fill = (
    n: number,
    a: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
  ) => add(n, a, () => [between(u0, u1) * w, between(v0, v1) * h]);
  const frame = (
    n: number,
    a: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
  ) => {
    line(n, a, u0, v0, u1, v0);
    line(n, a, u0, v1, u1, v1);
    line(n / 3, a, u0, v0, u0, v1);
    line(n / 3, a, u1, v0, u1, v1);
  };

  // Dots spread over an ellipse around a centre in px (heads, shoulders); not scaled by k
  const blob = (
    n: number,
    a: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
  ) => {
    for (let i = 0; i < n; i++) {
      const angle = r() * 6.3;
      const d = Math.sqrt(r());
      out.push([
        cx + Math.cos(angle) * d * rx,
        cy + Math.sin(angle) * d * ry,
        a,
      ]);
    }
  };

  // Truss: two chords with a zigzag between them
  line(220, 0.8, 0.03, 0.03, 0.97, 0.03);
  line(220, 0.8, 0.03, 0.09, 0.97, 0.09);
  for (let u = 0.03; u < 0.96; u += 0.04) line(8, 0.5, u, 0.03, u + 0.02, 0.09);

  // Light beams fanning down to the stage, each flickering on its own
  BEAMS.forEach((u, i) => {
    const tilt = (0.5 - u) * 0.35 + (i % 2 ? 0.05 : -0.05);
    add(
      140,
      0.5,
      () => {
        const t = r();
        const spread = (r() * 2 - 1) * (0.008 + 0.05 * t);
        return [(u + tilt * t + spread) * w, (0.1 + 0.6 * t) * h];
      },
      i * 1.7,
    );
  });

  // Big screen hanging from the truss, a scoreboard bar on top and a split down the middle
  line(14, 0.6, 0.42, 0.09, 0.42, 0.14);
  line(14, 0.6, 0.58, 0.09, 0.58, 0.14);
  frame(150, 0.95, 0.38, 0.14, 0.62, 0.52);
  fill(60, 0.22, 0.385, 0.16, 0.615, 0.5);
  fill(90, 0.85, 0.43, 0.18, 0.57, 0.24);
  line(20, 0.5, 0.5, 0.26, 0.5, 0.5);

  // Two team booths: glass box, desk, five players with monitors
  for (const [u0, u1] of [
    [0.1, 0.34],
    [0.66, 0.9],
  ]) {
    frame(70, 0.35, u0, 0.36, u1, 0.7);
    fill(90, 0.55, u0 + 0.01, 0.6, u1 - 0.01, 0.7);
    line(40, 0.9, u0 + 0.01, 0.6, u1 - 0.01, 0.6);
    for (let p = 0; p < 5; p++) {
      const c = u0 + ((p + 0.5) / 5) * (u1 - u0);
      blob(
        16,
        0.95,
        c * w,
        0.49 * h,
        Math.max(2.4, h * 0.03),
        Math.max(2.4, h * 0.03),
      );
      fill(10, 0.7, c - 0.012, 0.53, c + 0.012, 0.6); // shoulders
      fill(6, 0.45, c - 0.006, 0.55, c + 0.006, 0.585); // monitor glow
    }
  }

  // Stage deck and its front face
  line(260, 0.9, 0.04, 0.7, 0.96, 0.7);
  fill(200, 0.4, 0.05, 0.705, 0.95, 0.76);

  // Crowd: rows of heads and shoulders, nearer rows bigger and brighter, the odd raised arm
  const rows = w < 560 ? 2 : 3;
  for (let row = 0; row < rows; row++) {
    const near = (row + 1) / rows;
    const y = h * (0.82 + 0.12 * (row / Math.max(1, rows - 1)));
    const size = 2 + near * 1.2;
    const a = 0.4 + near * 0.45;
    for (let x = (row % 2) * (HEAD_GAP / 2) + 4; x < w - 3; x += HEAD_GAP) {
      const cx = x + (r() - 0.5) * 3;
      const cy = y + (r() - 0.5) * 2;
      blob(6, a, cx, cy, size, size);
      blob(3, a * 0.5, cx, cy + size * 2.4, size * 1.8, size * 0.6);
      if (r() < 0.06)
        for (let i = 1; i <= 4; i++)
          out.push([cx + size + i * 0.6, cy - i * 2.2, a]);
    }
  }
  return out;
}

export function ArenaParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return runParticles(ref.current, arena);
  }, []);

  return <canvas ref={ref} className="cl-arena" aria-hidden="true" />;
}
