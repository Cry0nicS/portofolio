"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "./site";

// Page links only, minus the current page; each page's rail or dock navigates its sections
const links = site.pages.filter((p) => !("legal" in p));

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="nav mono" aria-label="Site">
      {links
        .filter(({ path }) => path !== pathname)
        .map(({ path, label }) => (
          <Link key={path} href={path}>
            {label}
          </Link>
        ))}
    </nav>
  );
}
