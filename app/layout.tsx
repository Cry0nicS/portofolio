import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Konami, ThemeToggle } from "./controls";
import { PenTrail, PenTrailToggle } from "./pen-trail";
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
      <path
        className="logo-ink"
        d="M0 62L17 14C21 5 28 0 40 0H117Q121 0 121 4V25Q121 29 117 29H60C54 29 51 31 48 37L37 62Z"
      />
      <path
        className="logo-accent"
        d="M88 59L97 38Q99 34 103 34H120L129 19Q131 16 134.5 16Q138 16 137 20L122 74C117 89 106 96 90 96H22Q14 96 14 88V75Q14 67 22 67H76C82 67 85 65 88 59Z"
      />
      <g className="logo-route">
        <path
          pathLength="100"
          d="M23 48L28.5 32Q33 17 50 17H113V48L107.5 64Q103 79 86 79H23M58 79V90"
        />
        <path
          className="logo-pulse"
          pathLength="100"
          d="M23 48L28.5 32Q33 17 50 17H113V48L107.5 64Q103 79 86 79H23"
        />
        <circle cx="23" cy="48" r="5.5" />
        <circle cx="50" cy="17" r="5.5" />
        <circle cx="113" cy="17" r="5.5" />
        <circle cx="113" cy="48" r="5.5" />
        <circle cx="86" cy="79" r="5.5" />
        <circle cx="58" cy="79" r="5.5" />
        <circle cx="58" cy="90" r="3.5" />
        <circle cx="23" cy="79" r="5.5" />
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
