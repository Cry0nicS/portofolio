import Link from "next/link";
import { ThemeToggle } from "./controls";
import {
  LOGO_ACCENT,
  LOGO_INK,
  LOGO_NODES,
  LOGO_ROUTE,
  LOGO_ROUTE_MAIN,
} from "./logo";
import { PenTrailToggle } from "./pen-trail";
import { SiteNav } from "./site-nav";

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

export function SiteHeader() {
  return (
    <header className="wrap header">
      <Link className="brand" href="/" aria-label="Adrian Popescu, home">
        <Logo />
        <span>Adrian Popescu</span>
      </Link>
      <SiteNav />
      <div className="tools">
        <PenTrailToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
