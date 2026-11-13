import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
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
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M9 2.5h14a2 2 0 0 1 2 2V23a6.5 6.5 0 0 1-6.5 6.5H9a2 2 0 0 1-2-2v-23a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        className="logo-screen"
        x="10.5"
        y="6"
        width="11"
        height="8.5"
        rx="1.2"
      />
      <path
        d="M13.5 18.5v5M11 21h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="19.2" cy="23" r="1.4" fill="currentColor" />
      <circle cx="22.2" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geistMono.variable}`}
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
