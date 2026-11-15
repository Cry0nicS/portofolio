"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "./site";

// Page links only, minus the current page; each page's rail or dock navigates its sections
const links = site.pages;

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="nav mono" aria-label="Site">
      {links
        .filter(([href]) => href !== pathname)
        .map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
    </nav>
  );
}
