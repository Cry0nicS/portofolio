import Link from "next/link";
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
          <Link href="/impressum">Impressum</Link> ·{" "}
          <Link href="/datenschutz">Datenschutz</Link>
        </p>
      </div>
    </footer>
  );
}
