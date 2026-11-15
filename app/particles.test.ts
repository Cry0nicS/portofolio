import { afterEach, beforeEach, expect, test } from "bun:test";
import { runCanvas, type Frame } from "./particles";

// Fake browser globals: just enough of the DOM for runCanvas, with handles to drive it
type Fn = (arg?: unknown) => void;
class Target {
  on = new Map<string, Set<Fn>>();
  addEventListener(type: string, fn: Fn) {
    this.on.set(type, (this.on.get(type) ?? new Set()).add(fn));
  }
  removeEventListener(type: string, fn: Fn) {
    this.on.get(type)?.delete(fn);
  }
  emit(type: string) {
    for (const fn of this.on.get(type) ?? []) fn();
  }
}
class Query extends Target {
  matches = false;
}

let targets: Target[];
let media: Record<string, Query>;
let observers: Record<string, { fire: Fn; live: boolean }>;
let timers: Map<number, { fn: Fn; ms: number }>;
let frames: Map<number, Fn>;
let style: { color: string; borderTopColor: string };
let styleReads: number;
let doc: Target & { hidden: boolean; documentElement: Target };
let canvas: { clientWidth: number; clientHeight: number } & Record<
  string,
  unknown
>;
let draws: Frame[];
let layouts: number[];

const fakeObserver = (kind: string) =>
  class {
    constructor(cb: (entries: unknown[]) => void) {
      observers[kind] = {
        fire: (entry) => cb([entry]),
        live: true,
      };
    }
    observe() {}
    disconnect() {
      observers[kind].live = false;
    }
  };

const names = [
  "window",
  "document",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "ResizeObserver",
  "IntersectionObserver",
  "MutationObserver",
] as const;
const saved = names.map((n) => Object.getOwnPropertyDescriptor(globalThis, n));

beforeEach(() => {
  media = {};
  observers = {};
  timers = new Map();
  frames = new Map();
  style = { color: "accent", borderTopColor: "ink" };
  styleReads = 0;
  draws = [];
  layouts = [];
  let id = 0;
  const win = Object.assign(new Target(), {
    devicePixelRatio: 3,
    matchMedia: (q: string) => (media[q] ??= new Query()),
    setTimeout: (fn: Fn, ms: number) => (timers.set(++id, { fn, ms }), id),
    clearTimeout: (t: number) => timers.delete(t),
  });
  doc = Object.assign(new Target(), {
    hidden: false,
    documentElement: new Target(),
  });
  targets = [win, doc, doc.documentElement];
  Object.assign(globalThis, {
    window: win,
    document: doc,
    getComputedStyle: () => (styleReads++, { ...style }),
    requestAnimationFrame: (fn: Fn) => (frames.set(++id, fn), id),
    cancelAnimationFrame: (f: number) => frames.delete(f),
    ResizeObserver: fakeObserver("resize"),
    IntersectionObserver: fakeObserver("intersect"),
    MutationObserver: fakeObserver("theme"),
  });
  const ctx = { setTransform() {}, clearRect() {} };
  canvas = { clientWidth: 0, clientHeight: 100, getContext: () => ctx };
});

afterEach(() => {
  names.forEach((n, i) => {
    if (saved[i]) Object.defineProperty(globalThis, n, saved[i]);
    else delete (globalThis as Record<string, unknown>)[n];
  });
});

function start({ width = 300, onScreen = true } = {}) {
  const run = runCanvas(canvas as unknown as HTMLCanvasElement, {
    layout: (w) => layouts.push(w),
    draw: (_, frame) => draws.push(frame),
  })!;
  resize(width);
  observers.intersect.fire({ isIntersecting: onScreen });
  return run;
}
function resize(width: number) {
  canvas.clientWidth = width;
  observers.resize.fire();
}
const running = () => frames.size > 0;
function tick() {
  const due = [...frames.values()];
  frames.clear();
  due.forEach((fn) => fn(16));
}
const flush = () => [...timers.values()].forEach(({ fn }) => fn());
const reducedMotion = "(prefers-reduced-motion: reduce)";

test("loop runs only when visible, unhidden, motion allowed and width > 0", () => {
  start({ onScreen: false });
  expect(running()).toBe(false);
  observers.intersect.fire({ isIntersecting: true });
  expect(running()).toBe(true);
  doc.hidden = true;
  doc.emit("visibilitychange");
  expect(running()).toBe(false);
  doc.hidden = false;
  doc.emit("visibilitychange");
  expect(running()).toBe(true);
  resize(0);
  flush();
  expect(running()).toBe(false);
  resize(300);
  expect(running()).toBe(true);
  // Colours are cached, never read per frame
  const reads = styleReads;
  tick();
  tick();
  expect(draws.length).toBe(2);
  expect(styleReads).toBe(reads);
});

test("resizing settles 150ms after the last change, sized for a 2x pixel cap", () => {
  start();
  expect(layouts).toEqual([300]);
  resize(400);
  resize(500);
  expect(layouts).toEqual([300]);
  expect([...timers.values()].map((t) => t.ms)).toEqual([150]);
  flush();
  expect(layouts).toEqual([300, 500]);
  expect(canvas.width).toBe(1000);
});

test("a motion change cancels the loop and paints once still", () => {
  start();
  expect(running()).toBe(true);
  media[reducedMotion].matches = true;
  media[reducedMotion].emit("change");
  expect(running()).toBe(false);
  expect(draws.map((f) => f.still)).toEqual([true]);
});

test("a theme change re-reads colours and repaints while still", () => {
  (media[reducedMotion] = new Query()).matches = true;
  start();
  expect(draws.at(-1)?.accent).toBe("accent");
  style = { color: "red", borderTopColor: "black" };
  observers.theme.fire();
  expect(draws.at(-1)).toMatchObject({ accent: "red", ink: "black" });
  style.color = "blue";
  media["(prefers-color-scheme: dark)"].emit("change");
  expect(draws.at(-1)?.accent).toBe("blue");
});

test("stop() removes every listener, observer, frame and pending timer", () => {
  const run = start();
  resize(400);
  run.stop();
  const live = [...targets, ...Object.values(media)].flatMap((t) =>
    [...t.on.values()].flatMap((set) => [...set]),
  );
  expect(live).toEqual([]);
  expect(Object.values(observers).every((o) => !o.live)).toBe(true);
  expect(timers.size + frames.size).toBe(0);
});
