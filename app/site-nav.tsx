"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// On phones the only links left are the page links (home, about), minus the one for the current page
const links = [
  ["/", "home"],
  ["/about", "about"],
  ["/#esports", "esports"],
  ["/#work", "work"],
  ["/#after-hours", "after hours"],
  ["/#contact", "contact"],
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="nav mono" aria-label="Site">
      {links
        .filter(([href]) => href !== "/" || pathname !== "/")
        .map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
    </nav>
  );
}
