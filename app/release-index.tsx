"use client";

import { useEffect, useState } from "react";
import { releases } from "./content";
import { smoothScrollClick } from "./smooth-scroll";

// Contact is the footer, not a Release: it stays the fixed last entry.
const index = [
  ...releases.map((r) => ({ ...r, href: `#${r.id}` })),
  {
    href: "#contact",
    version: "msg",
    name: "contact",
    years: "get in touch",
    short: "contact",
  },
];

export function ReleaseIndex() {
  const [current, setCurrent] = useState<string>(index[0].href);

  // Mark the release being read: the one crossing a line 40% down the viewport.
  useEffect(() => {
    // The footer is short: on tall screens it never reaches the line, so the page end counts as contact.
    const atEnd = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    const last = index[index.length - 1].href;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setCurrent(atEnd() ? last : `#${hit.target.id}`);
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    for (const { href } of index) {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    }
    const onScroll = () => {
      if (atEnd()) setCurrent(last);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className="dock" aria-label="Releases" onClick={smoothScrollClick}>
      <ol className="cl-index rail">
        {index.map(({ href, version, name, years, short }) => (
          <li key={href}>
            <a href={href} aria-current={current === href ? "step" : undefined}>
              <span className="cl-index-ver">{version}</span>
              <span className="cl-index-name">{name}</span>
              <span className="cl-index-short">{short}</span>
              <span className="cl-index-years">{years}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
