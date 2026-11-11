"use client";

import { useEffect, useState } from "react";

// href, version tag, name, years, short name for the bottom bar on small screens
const index = [
  ["#v3", "v3.0", "ai-first", "2022 – now", "ai-first"],
  ["#berlin", "v2.0", "berlin", "2020 – 2022", "berlin"],
  ["#esports", "v1.0", "esports", "2012 – 2022", "esports"],
  ["#after-hours", "ext", "side quests", "after hours", "quests"],
  ["#experience", "log", "version history", "2013 – now", "history"],
];

export function ReleaseIndex() {
  const [current, setCurrent] = useState(index[0][0]);

  // Mark the release being read: the one crossing a line 40% down the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setCurrent(`#${hit.target.id}`);
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    for (const [href] of index) {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Releases">
      <ol className="cl-index">
        {index.map(([href, version, name, years, short]) => (
          <li key={href}>
            <a href={href} aria-current={current === href ? "true" : undefined}>
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
