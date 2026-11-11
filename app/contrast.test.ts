import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

// WCAG 2.1 AA guard: every text and accent colour must reach 4.5:1 on both surfaces, in both themes.
const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

function pairs(name: string) {
  const found = [
    ...css.matchAll(
      new RegExp(`--${name}: light-dark\\((#\\w{6}), (#\\w{6})\\)`, "g"),
    ),
  ];
  return found.map((match) => [match[1], match[2]] as const);
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("text and accent colours meet 4.5:1 on bg and card in both themes", () => {
  const surfaces = [...pairs("bg"), ...pairs("card")];
  const inks = [...pairs("text"), ...pairs("muted"), ...pairs("accent")];
  expect(surfaces).toHaveLength(2);
  expect(inks.length).toBe(9); // text, muted, default accent + 6 named palettes
  for (const ink of inks)
    for (const surface of surfaces)
      for (const theme of [0, 1] as const)
        expect(
          contrast(ink[theme], surface[theme]),
          `${ink[theme]} on ${surface[theme]}`,
        ).toBeGreaterThanOrEqual(4.5);
});
