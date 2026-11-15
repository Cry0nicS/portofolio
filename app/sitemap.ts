import type { MetadataRoute } from "next";
import { site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return site.pages
    .filter((p) => !("legal" in p))
    .map(({ path }) => ({ url: site.origin + (path === "/" ? "" : path) }));
}
