"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const ACCENTS = [
  "spree",
  "tiergarten",
  "ostsee",
  "plum",
  "indigo",
  "mustard",
] as const;
const KONAMI =
  "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a".split(
    " ",
  );

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage blocked: the choice just lasts for this page view
  }
}

function setAccent(accent: string) {
  document.documentElement.dataset.accent = accent;
  save("accent", accent);
  window.dispatchEvent(new Event("accentchange"));
}

function subscribe(onChange: () => void) {
  window.addEventListener("accentchange", onChange);
  return () => window.removeEventListener("accentchange", onChange);
}

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    save("theme", root.dataset.theme);
  }
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M10 2.5a7.5 7.5 0 0 0 0 15z" fill="currentColor" />
      </svg>
    </button>
  );
}

export function AccentPicker() {
  const current = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.accent ?? ACCENTS[0],
    () => ACCENTS[0],
  );
  const [gg, setGg] = useState(false);

  // Easter egg: the Konami code jumps to the next accent. Listens only, never blocks a key.
  useEffect(() => {
    let step = 0;
    let timer: ReturnType<typeof setTimeout>;
    function onKey(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      // A third ArrowUp keeps the two already entered instead of starting over.
      const restart = key !== KONAMI[0] ? 0 : step === 2 ? 2 : 1;
      step = key === KONAMI[step] ? step + 1 : restart;
      if (step < KONAMI.length) return;
      step = 0;
      const now = document.documentElement.dataset.accent ?? ACCENTS[0];
      setAccent(
        ACCENTS[
          (ACCENTS.indexOf(now as (typeof ACCENTS)[number]) + 1) %
            ACCENTS.length
        ],
      );
      setGg(true);
      clearTimeout(timer);
      timer = setTimeout(() => setGg(false), 2500);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <details
        className="picker"
        onBlur={(event) => {
          // No relatedTarget means a mouse press (Safari), not focus moving on: stay open.
          if (
            event.relatedTarget &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            event.currentTarget.open = false;
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }}
      >
        <summary className="icon-btn" aria-label="Accent colour" />
        <ul>
          {ACCENTS.map((accent) => (
            <li key={accent}>
              <button
                type="button"
                className="swatch"
                data-accent={accent}
                aria-pressed={current === accent}
                onClick={() => setAccent(accent)}
              >
                {accent}
              </button>
            </li>
          ))}
        </ul>
      </details>
      <p className="toast" role="status" hidden={!gg}>
        🕹️ gg wp. cheat code accepted.
      </p>
    </>
  );
}
