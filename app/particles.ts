// Shared engine for the Drawings: the canvas lifecycle, and dots that scatter from the mouse and spring back home.
const RADIUS = 34; // px around the pointer that pushes dots away
const PUSH = 1.6; // push strength at the pointer
const SPRING = 0.05; // pull back towards home each frame
const DAMPING = 0.86; // velocity kept each frame

// Home in canvas px, opacity, and an optional flicker phase (dots without one stay steady)
export type Point = [x: number, y: number, a: number, flicker?: number];

type Dot = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  p: number;
  f?: number;
};

export type Frame = {
  now: number;
  still: boolean; // reduced motion: paint the resting picture, no physics
  mouse: { x: number; y: number } | null;
  ink: string;
  accent: string;
};

// The canvas lifecycle every Drawing shares: sizing, pausing, reduced motion, theme colours, mouse and the frame loop.
// layout() gets the CSS size once the bitmap is sized (only when width > 0); draw() gets a cleared canvas.
// Colours come from the canvas's computed style: border-top-color is the ink, color the accent.
export function runCanvas(
  canvas: HTMLCanvasElement,
  drawing: {
    layout(width: number, height: number): void;
    draw(ctx: CanvasRenderingContext2D, frame: Frame): void;
  },
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  let still = motion.matches;
  let width = 0;
  let height = 0;
  let mouse: Frame["mouse"] = null;
  let onScreen = false;
  let frame = 0;
  let resizing = 0;
  let ink = "";
  let accent = "";

  function readColours() {
    const style = getComputedStyle(canvas);
    ink = style.borderTopColor;
    accent = style.color;
  }

  function layout() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawing.layout(width, height);
  }

  function render(now: number) {
    ctx!.clearRect(0, 0, width, height);
    drawing.draw(ctx!, { now, still, mouse, ink, accent });
  }

  function loop(now: number) {
    render(now);
    frame = requestAnimationFrame(loop);
  }

  // Still mode has no loop, so it paints once whenever something changes
  function paint() {
    if (still && width > 0) render(performance.now());
  }

  // Runs only while the canvas is shown (not display:none), on screen and the tab is visible.
  function update() {
    const run = !still && onScreen && !document.hidden && width > 0;
    if (run && !frame) frame = requestAnimationFrame(loop);
    if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    paint();
  }

  function onMotion() {
    still = motion.matches;
    update();
  }
  function recolour() {
    readColours();
    paint();
  }
  function onMove(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    const box = canvas.getBoundingClientRect();
    mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
  }
  function onLeave() {
    mouse = null;
  }

  // Layout can reshuffle a Drawing, so wait for a window drag to settle; the first size lands at once
  const resizer = new ResizeObserver(() => {
    window.clearTimeout(resizing);
    const settle = () => {
      layout();
      update();
    };
    if (width) resizing = window.setTimeout(settle, 150);
    else settle();
  });
  const watcher = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  const theme = new MutationObserver(recolour);
  readColours();
  resizer.observe(canvas);
  watcher.observe(canvas);
  theme.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  scheme.addEventListener("change", recolour);
  motion.addEventListener("change", onMotion);
  document.addEventListener("visibilitychange", update);
  window.addEventListener("pointermove", onMove);
  document.documentElement.addEventListener("pointerleave", onLeave);
  return {
    paint,
    stop() {
      window.clearTimeout(resizing);
      resizer.disconnect();
      watcher.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", recolour);
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

// Dots in the canvas's `color`; `place` lays out home points for the canvas size. Returns the cleanup.
export function runParticles(
  canvas: HTMLCanvasElement,
  place: (width: number, height: number) => Point[],
) {
  let dots: Dot[] = [];
  return runCanvas(canvas, {
    layout(width, height) {
      dots = place(width, height).map(([hx, hy, a, f]) => ({
        hx,
        hy,
        x: hx,
        y: hy,
        vx: 0,
        vy: 0,
        a,
        p: Math.random() * 6.3,
        f,
      }));
    },
    draw(ctx, { now, still, mouse, accent }) {
      ctx.fillStyle = accent;
      for (const d of dots) {
        let a = d.a;
        if (still) {
          // Settle home so the still picture is the shape, and motion restarts from rest
          d.x = d.hx;
          d.y = d.hy;
          d.vx = d.vy = 0;
        } else {
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
          if (d.f !== undefined)
            a *=
              0.7 +
              0.3 * Math.sin(now / 700 + d.f) * Math.sin(now / 1900 + d.f * 2);
        }
        ctx.globalAlpha = a;
        ctx.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4);
      }
    },
  })?.stop;
}
