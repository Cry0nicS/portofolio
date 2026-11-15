// The /about Chapters in page order: each section id (also the rail label) and the shape the dots form.
// Plain module, no "use client": the server page, the rail and the canvas all import it.
export const CHAPTERS = [
  { id: "start", shape: "logo" },
  { id: "play", shape: "gamepad" },
  { id: "code", shape: "monitor" },
  { id: "ship", shape: "braces" },
  { id: "agents", shape: "agents" },
  { id: "handoff", shape: "logo" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
export type ShapeName = (typeof CHAPTERS)[number]["shape"];

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

// chapter() for the page's [data-chapter] elements at the middle of the viewport
export function chapterOf(steps: HTMLElement[]) {
  const centres = steps.map((el) => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });
  return chapter(centres, window.innerHeight / 2);
}
