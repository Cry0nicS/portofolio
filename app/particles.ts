// Shared engine for the particle drawings: dots scatter from the mouse and spring back home.
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

// Draws the canvas in its computed `color`; `place` lays out home points for the canvas size. Returns the cleanup.
export function runParticles(
  canvas: HTMLCanvasElement,
  place: (width: number, height: number) => Point[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dots: Dot[] = [];
  let width = 0;
  let height = 0;
  let mouse: { x: number; y: number } | null = null;
  let onScreen = false;
  let frame = 0;

  function layout() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots =
      width > 0
        ? place(width, height).map(([hx, hy, a, f]) => ({
            hx,
            hy,
            x: hx,
            y: hy,
            vx: 0,
            vy: 0,
            a,
            p: Math.random() * 6.3,
            f,
          }))
        : [];
  }

  function draw(now: number) {
    ctx!.clearRect(0, 0, width, height);
    ctx!.fillStyle = getComputedStyle(canvas).color;
    for (const d of dots) {
      let a = d.a;
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
        if (d.f !== undefined)
          a *=
            0.7 +
            0.3 * Math.sin(now / 700 + d.f) * Math.sin(now / 1900 + d.f * 2);
      }
      ctx!.globalAlpha = a;
      ctx!.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4);
    }
  }

  function loop(now: number) {
    draw(now);
    frame = requestAnimationFrame(loop);
  }

  // Runs only while the canvas is shown (not display:none), on screen and the tab is visible.
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
    const box = canvas.getBoundingClientRect();
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
  theme.observe(document.documentElement, { attributeFilter: ["data-theme"] });
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
}
