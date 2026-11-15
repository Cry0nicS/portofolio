// Paced scrolling for in-page links, slow enough to watch what scrolling drives on the way (the /about morphs).
import type { MouseEvent } from "react";

const PER_VIEWPORT = 300;
const MIN = 400;
const MAX = 900;
const PER_STOP = 450;
const CAP = 2500;
// Speed through a passed point, as a share of the leg's average: slows, never stops
const SLOW = 0.2;

// Total time for a scroll: paced by distance, plus a beat for each waypoint passed, within bounds
export function scrollDuration(distance: number, viewport: number, stops = 0) {
  const ms = (Math.abs(distance) / viewport) * PER_VIEWPORT + 300;
  return Math.round(
    Math.min(CAP, Math.min(MAX, Math.max(MIN, ms)) + stops * PER_STOP),
  );
}

/**
 * Where the scroll is `elapsed` ms into `duration`, sharing the time equally between the legs from
 * point to point. It leaves at twice a leg's average speed so the first frame already moves, slows
 * through each inner point so what it drives there gets a moment to form, and comes to rest at the end.
 */
export function scrollAt(points: number[], elapsed: number, duration: number) {
  const legs = points.length - 1;
  const s = Math.min(1, Math.max(0, elapsed / duration)) * legs;
  const i = Math.min(Math.floor(s), legs - 1);
  const u = s - i;
  const start = i === 0 ? 2 : SLOW;
  const end = i === legs - 1 ? 0 : SLOW;
  // Speed 1 + a·cos(πu) + b·cos(2πu) runs from `start` to `end` and covers the leg exactly
  const [a, b] = [(start - end) / 2, (start + end) / 2 - 1];
  const w =
    u +
    (a * Math.sin(Math.PI * u)) / Math.PI +
    (b * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
  const [from, to] = [points[i], points[i + 1]];
  return { top: from + (to - from) * w, done: s >= legs };
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
 * way that the scroll should slow through, as /about does for each chapter.
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
  // Skip a stop the reader is already looking at: it is near where the scroll starts
  const between = (y: number) =>
    (y - from) * (y - to) < 0 && Math.abs(y - from) > window.innerHeight / 2;
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

  const duration = scrollDuration(to - from, window.innerHeight, passed.length);
  // Count from a frame before the click so the very first frame already moves
  const start = performance.now() - 16;
  let frame = requestAnimationFrame(function step(now) {
    const { top, done } = scrollAt(points, now - start, duration);
    window.scrollTo({ top, behavior: "instant" });
    if (!done) frame = requestAnimationFrame(step);
    else {
      abort.abort();
      arrive();
    }
  });
  stop = cancel;
}
