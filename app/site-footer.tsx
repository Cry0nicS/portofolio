import Link from "next/link";
import { Fragment } from "react";
import { site } from "./site";

const contact = [
  [
    "LinkedIn",
    "https://www.linkedin.com/in/adrian-popescu",
    "in/adrian-popescu",
  ],
  ["GitHub", "https://github.com/Cry0nicS", "Cry0nicS"],
  ["Email", `mailto:${site.email}`, site.email],
];

const legal = site.pages.filter((p) => "legal" in p);

export function SiteFooter() {
  return (
    <footer className="wrap footer" id="contact">
      <h2>Adrian Popescu</h2>
      <p className="muted" style={{ marginTop: "0.75rem" }}>
        Technical Product Owner · Website, AI &amp; Automation · Berlin
      </p>
      <ul className="contact">
        {contact.map(([name, href, handle]) => (
          <li key={name}>
            <a href={href}>
              {name}
              <span className="mono">{handle}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="colophon mono">
        <p>Built in Berlin, 2026. GG.</p>
        <p>
          {legal.map(({ path, label }, i) => (
            <Fragment key={path}>
              {i > 0 && " · "}
              <Link href={path}>{label}</Link>
            </Fragment>
          ))}
        </p>
      </div>
    </footer>
  );
}
