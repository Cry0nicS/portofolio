import type { MetadataRoute } from "next";
import { navPages, site } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navPages.map(({ path }) => ({
    url: site.origin + (path === "/" ? "" : path),
  }));
}
