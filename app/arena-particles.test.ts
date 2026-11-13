import { expect, test } from "bun:test";
import { arena } from "./arena-particles";

// The arena keeps to its dot budget on desktop and phone widths.
test("arena stays within 2,500 dots", () => {
  for (const [w, h] of [
    [704, 168],
    [350, 109],
  ])
    expect(arena(w, h).length).toBeLessThanOrEqual(2500);
});
