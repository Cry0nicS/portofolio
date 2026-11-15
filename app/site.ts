import type { Metadata } from "next";

export const name = "Adrian Popescu";
export const tagline = `${name} · Builder first.`;
export const titleTemplate = `%s · ${name}`;

// Open Graph fields every page shares; Next replaces openGraph wholesale per page, so pageMetadata spreads this.
export const og = {
  type: "website",
  siteName: name,
  locale: "en_US",
  description:
    "Adrian Popescu: Technical Product Owner in Berlin. Ten years building esports platforms and running tournaments, now AI-first work that enables teams and improves products.",
} as const;

export const site = {
  origin: "https://adrianpopescu.dev",
  email: "contact@adrianpopescu.dev",
  // Every page, in nav order; legal pages stay out of nav and sitemap and are noindex
  pages: [
    { path: "/", label: "home" },
    { path: "/about", label: "about", title: "About" },
    { path: "/impressum", label: "Impressum", legal: true },
    { path: "/datenschutz", label: "Datenschutz", legal: true },
  ],
} as const;

type Page = (typeof site.pages)[number];

// A page's metadata from its path; the layout's title templates add the site name.
export function pageMetadata(path: Page["path"]): Metadata {
  const page = site.pages.find((p) => p.path === path)!;
  const title = "title" in page ? page.title : page.label;
  return {
    title,
    alternates: { canonical: path },
    openGraph: { ...og, url: path, title },
    ...("legal" in page && { robots: { index: false } }),
  };
}
