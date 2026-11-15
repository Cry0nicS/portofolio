// Workflow Handoff mark, shared by the header logo (layout.tsx) and the /about particle logo; no browser APIs, so the server can import it.
export const LOGO_INK =
  "M0 62L17 14C21 5 28 0 40 0H117Q121 0 121 4V25Q121 29 117 29H60C54 29 51 31 48 37L37 62Z";
export const LOGO_ACCENT =
  "M88 59L97 38Q99 34 103 34H120L129 19Q131 16 134.5 16Q138 16 137 20L122 74C117 89 106 96 90 96H22Q14 96 14 88V75Q14 67 22 67H76C82 67 85 65 88 59Z";
export const LOGO_ROUTE_MAIN =
  "M23 48L28.5 32Q33 17 50 17H113V48L107.5 64Q103 79 86 79H23";
export const LOGO_ROUTE = `${LOGO_ROUTE_MAIN}M58 79V90`; // the main line plus the branch to the output
// Each node: x, y, radius, and when the header pulse reaches it (--at in globals.css)
type LogoNode = readonly [x: number, y: number, r: number, at: number];
export const LOGO_NODES: readonly LogoNode[] = [
  [23, 48, 5.5, 0],
  [50, 17, 5.5, 0.17],
  [113, 17, 5.5, 0.43],
  [113, 48, 5.5, 0.57],
  [86, 79, 5.5, 0.74],
  [58, 79, 5.5, 0.85],
  [58, 90, 3.5, 0.92],
  [23, 79, 5.5, 1],
];
// The header's run (globals.css): the pulse crosses the route in CROSS ms of every CYCLE ms
export const LOGO_CYCLE = 2400;
export const LOGO_CROSS = 1900;
