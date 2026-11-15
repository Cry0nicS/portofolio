import type { MetadataRoute } from "next";
import { site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return site.pages.map(([path]) => ({
    url: site.origin + (path === "/" ? "" : path),
  }));
}
