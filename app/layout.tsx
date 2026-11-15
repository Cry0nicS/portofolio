import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Konami, ThemeToggle } from "./controls";
import { PenTrail, PenTrailToggle } from "./pen-trail";
import {
  LOGO_ACCENT,
  LOGO_INK,
  LOGO_NODES,
  LOGO_ROUTE,
  LOGO_ROUTE_MAIN,
} from "./logo";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from this domain: no Google requests at runtime.
// opsz keeps Bricolage's optical sizes (tighter text cuts, characterful display cuts); latin-ext covers German.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});
// Plex Mono is not variable: load only the weights the CSS uses for mono text (400, 500, 600), no italics.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const description =
  "Adrian Popescu: Technical Product Owner in Berlin. Ten years building esports platforms and running tournaments, now AI-first work that enables teams and improves products.";

export const metadata: Metadata = {
  metadataBase: new URL("https://adrianpopescu.dev"),
  title: {
    default: "Adrian Popescu · Builder first.",
    template: "%s · Adrian Popescu",
  },
  description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Adrian Popescu",
    title: "Adrian Popescu · Builder first.",
    description,
    locale: "en_US",
  },
};

// Runs before first paint so a saved theme never flashes and the trail switch starts in its saved state.
const restorePrefs = `try{var d=document.documentElement.dataset,t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.theme=t;if(localStorage.getItem("trail")==="off")d.trail="off"}catch(e){}`;

const links = [
  ["/#esports", "esports"],
  ["/#work", "work"],
  ["/#after-hours", "after hours"],
  ["/#contact", "contact"],
];

const contact = [
  [
    "LinkedIn",
    "https://www.linkedin.com/in/adrian-popescu",
    "in/adrian-popescu",
  ],
  ["GitHub", "https://github.com/Cry0nicS", "Cry0nicS"],
  ["Email", "mailto:contact@adrianpopescu.dev", "contact@adrianpopescu.dev"],
];

function Logo() {
  return (
    // Workflow Handoff: two interlocking hooks carrying one n8n-style run, trigger → handoff → agent → output.
    <svg className="logo" viewBox="-3 -3 143 102" aria-hidden="true">
      <path className="logo-ink" d={LOGO_INK} />
      <path className="logo-accent" d={LOGO_ACCENT} />
      <g className="logo-route">
        <path pathLength="100" d={LOGO_ROUTE} />
        <path className="logo-pulse" pathLength="100" d={LOGO_ROUTE_MAIN} />
        {LOGO_NODES.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: restorePrefs }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="wrap header">
          <Link className="brand" href="/" aria-label="Adrian Popescu, home">
            <Logo />
            <span>Adrian Popescu</span>
          </Link>
          <nav className="nav mono" aria-label="Sections">
            {links.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="tools">
            <PenTrailToggle />
            <ThemeToggle />
          </div>
        </header>

        <main id="main">{children}</main>

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

        <Konami />
        <PenTrail />
      </body>
    </html>
  );
}
