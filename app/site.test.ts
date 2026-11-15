import { expect, test } from "bun:test";
import robots from "./robots";
import { site } from "./site";
import sitemap from "./sitemap";

test("sitemap lists the page list as absolute URLs, home without a trailing slash", () => {
  expect(sitemap().map((e) => e.url)).toEqual(
    site.pages.map(([path]) => site.origin + (path === "/" ? "" : path)),
  );
});

test("robots points at the sitemap on the origin", () => {
  expect(robots().sitemap).toStartWith(site.origin);
});
