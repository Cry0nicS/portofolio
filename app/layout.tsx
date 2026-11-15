import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { Konami } from "./controls";
import { PenTrail } from "./pen-trail";
import { og, site } from "./site";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    default: "Adrian Popescu · Builder first.",
    template: "%s · Adrian Popescu",
  },
  description: og.description,
  openGraph: { ...og, url: "/", title: "Adrian Popescu · Builder first." },
};

// Runs before first paint so a saved theme never flashes and the trail switch starts in its saved state.
const restorePrefs = `try{var d=document.documentElement.dataset,t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.theme=t;if(localStorage.getItem("trail")==="off")d.trail="off"}catch(e){}`;

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
        <SiteHeader />

        <main id="main">{children}</main>

        <SiteFooter />

        <Konami />
        <PenTrail />
      </body>
    </html>
  );
}
