"use client";

import { useEffect, useState } from "react";

const KONAMI =
  "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a".split(
    " ",
  );

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {
      // storage blocked: the choice just lasts for this page view
    }
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

// Easter egg: the Konami code shows a short note. Listens only, never blocks a key.
export function Konami() {
  const [gg, setGg] = useState(false);

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
    <p className="toast" role="status" hidden={!gg}>
      🕹️ gg wp. cheat code accepted.
    </p>
  );
}
