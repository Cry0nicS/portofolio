"use client";

// The Berlin TV tower as a cloud of accent-coloured dots that scatter from the mouse and settle back.
import { useEffect, useRef } from "react";

const TOWER_M = 368; // real height in metres; the shape below is drawn in metres
const RADIUS = 34; // px around the pointer that pushes dots away
const PUSH = 1.6; // push strength at the pointer
const SPRING = 0.05; // pull back towards home each frame
const DAMPING = 0.86; // velocity kept each frame

type Dot = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  p: number;
};

// Home points in metres: x centred on the axis, y up from the ground; a is the dot's opacity.
function silhouette() {
  const out: [number, number, number][] = [];
  const add = (n: number, a: number, at: () => [number, number] | null) => {
    while (n > 0) {
      const point = at();
      if (!point) continue;
      out.push([...point, a]);
      n--;
    }
  };
  const r = Math.random;
  const span = (half: number) => (r() * 2 - 1) * half;
  const SPHERE_Y = 213; // sphere centre, a little under 2/3 of the height
  const SPHERE_R = 20; // a touch larger than life so it reads at sidebar size

  add(130, 0.7, () => [span(42 - r() * 14), r() * 9]); // pavilion base
  add(320, 0.6, () => {
    const t = r();
    return [span(14 - 9.5 * t), 9 + t * (SPHERE_Y - 9)]; // shaft tapering upwards
  });
  add(480, 0.9, () => {
    const [x, y] = [span(SPHERE_R), span(SPHERE_R)];
    return x * x + y * y <= SPHERE_R * SPHERE_R ? [x, SPHERE_Y + y] : null;
  });
  add(130, 1, () => [span(SPHERE_R + 3), SPHERE_Y + 1 + r() * 4]); // observation deck band
  add(50, 0.8, () => [span(4), SPHERE_Y + SPHERE_R + r() * 18]); // neck above the sphere
  add(170, 0.85, () => {
    const t = r();
    return [span(2.6 - 2 * t), 251 + t * (TOWER_M - 251)]; // antenna spire
  });
  return out;
}

export function TowerParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shape = silhouette();
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let mouse: { x: number; y: number } | null = null;
    let onScreen = false;
    let frame = 0;

    function layout() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const scale = Math.min((height - 8) / TOWER_M, (width - 8) / 84);
      const left = width / 2;
      const bottom = height - 4;
      dots = shape.map(([mx, my, a]) => {
        const [hx, hy] = [left + mx * scale, bottom - my * scale];
        return {
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          a,
          p: Math.random() * 6.3,
        };
      });
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = getComputedStyle(canvas!).color;
      for (const d of dots) {
        if (!still) {
          // Idle shimmer: home sways a fraction of a pixel
          const tx = d.hx + Math.sin(now / 900 + d.p) * 0.5;
          const ty = d.hy + Math.cos(now / 1100 + d.p) * 0.5;
          d.vx += (tx - d.x) * SPRING;
          d.vy += (ty - d.y) * SPRING;
          if (mouse) {
            const dx = d.x - mouse.x;
            const dy = d.y - mouse.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < RADIUS) {
              const force = (1 - dist / RADIUS) * PUSH;
              d.vx += (dx / dist) * force;
              d.vy += (dy / dist) * force;
            }
          }
          d.vx *= DAMPING;
          d.vy *= DAMPING;
          d.x += d.vx;
          d.y += d.vy;
        }
        ctx!.globalAlpha = d.a;
        ctx!.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4);
      }
    }

    function loop(now: number) {
      draw(now);
      frame = requestAnimationFrame(loop);
    }

    // Runs only while the canvas is shown (not display:none on small screens), on screen and the tab is visible.
    function update() {
      const run = !still && onScreen && !document.hidden && width > 0;
      if (run && !frame) frame = requestAnimationFrame(loop);
      if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (still && width > 0) draw(0);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const box = canvas!.getBoundingClientRect();
      mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    function onLeave() {
      mouse = null;
    }

    const resizer = new ResizeObserver(() => {
      layout();
      update();
    });
    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    // Still mode paints once, so repaint when the theme flips
    const theme = new MutationObserver(update);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    resizer.observe(canvas);
    watcher.observe(canvas);
    theme.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
    });
    scheme.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    if (!still) {
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      resizer.disconnect();
      watcher.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} className="cl-tower" aria-hidden="true" />;
}
