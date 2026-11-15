// Paced scrolling for in-page links, slow enough to watch what scrolling drives on the way (the /about morphs).
import type { MouseEvent } from "react";

const PER_VIEWPORT = 800;
const MIN = 350;
const MAX = 1800;

export function scrollDuration(distance: number, viewport: number) {
  const ms = (Math.abs(distance) / viewport) * PER_VIEWPORT;
  return Math.round(Math.min(MAX, Math.max(MIN, ms)));
}

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

// Where the scroll is `elapsed` ms in, easing each leg between consecutive points on its own
export function scrollAt(points: number[], elapsed: number, viewport: number) {
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1], points[i]];
    const leg = scrollDuration(b - a, viewport);
    if (elapsed < leg)
      return { top: a + (b - a) * ease(elapsed / leg), done: false };
    elapsed -= leg;
  }
  return { top: points[points.length - 1], done: true };
}

// Where a native anchor jump would land: the scroller's scroll-padding plus the target's scroll-margin
function landing(target: Element) {
  const pad = parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop);
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    (pad || 0) -
    (margin || 0);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(max, Math.max(0, top));
}

let stop: (() => void) | null = null;

/**
 * onClick for an in-page `#hash` link, or for any element holding them (a nav): animates the scroll,
 * then sets the hash and moves focus as the native jump would. `stops` selects elements passed on the
 * way that the scroll should settle on for a moment, as /about does for each chapter.
 */
export function smoothScrollClick(event: MouseEvent, stops?: string) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    'a[href^="#"]',
  );
  const hash = link?.getAttribute("href") ?? "";
  const target = hash.length > 1 && document.getElementById(hash.slice(1));
  if (!target) return;
  event.preventDefault();
  stop?.();

  const arrive = () => {
    stop = null;
    if (location.hash !== hash) history.pushState(null, "", hash);
    if (!target.matches("a[href], button, input, select, textarea, [tabindex]"))
      target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const from = window.scrollY;
  const to = landing(target);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: to, behavior: "instant" });
    return arrive();
  }
  const between = (y: number) => (y - from) * (y - to) < 0;
  const passed = stops
    ? [...document.querySelectorAll(stops)].map(landing).filter(between)
    : [];
  const points = [from, ...(to > from ? passed : passed.reverse()), to];

  // Any scrolling input of the reader's own ends the animation where it is
  const abort = new AbortController();
  const cancel = () => {
    cancelAnimationFrame(frame);
    abort.abort();
    stop = null;
  };
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
    window.addEventListener(type, cancel, {
      passive: true,
      signal: abort.signal,
    });

  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const { top, done } = scrollAt(points, now - start, window.innerHeight);
    window.scrollTo({ top, behavior: "instant" });
    if (!done) frame = requestAnimationFrame(step);
    else {
      abort.abort();
      arrive();
    }
  });
  stop = cancel;
}
