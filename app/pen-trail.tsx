"use client";

// The mouse leaves a thin ink stroke in the accent colour that tapers and fades out.
import { useEffect, useRef, useSyncExternalStore } from "react";

const LIFE = 900; // ms a point stays visible

// The choice lives on <html data-trail>, like the theme, so the layout script restores it before paint.
function isOn() {
  return document.documentElement.dataset.trail !== "off";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-trail"],
  });
  return () => observer.disconnect();
}

export function PenTrailToggle() {
  const on = useSyncExternalStore(subscribe, isOn, () => true);

  function toggle() {
    const next = on ? "off" : "on";
    document.documentElement.dataset.trail = next;
    try {
      localStorage.setItem("trail", next);
    } catch {
      // storage blocked: the choice just lasts for this page view
    }
  }

  return (
    <button
      type="button"
      className="icon-btn trail-toggle"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Mouse trail effect"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M2.5 13.5c1.5-7 4.5-8.5 5.5-5s-1.5 6 .5 6 2.5-6 5-6 1.5 3.5 4 3" />
        {/* Shown by CSS from <html data-trail>, so a saved "off" is right before hydration */}
        <path className="trail-off" d="M3.5 16.5l13-13" />
      </svg>
    </button>
  );
}

export function PenTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let points: { x: number; y: number; t: number }[] = [];
    let frame = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      // Size from the element, not the window: its box excludes a classic scrollbar.
      canvas!.width = canvas!.clientWidth * ratio;
      canvas!.height = canvas!.clientHeight * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      const now = performance.now();
      points = points.filter((point) => now - point.t < LIFE);
      ctx!.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight);
      ctx!.strokeStyle = getComputedStyle(canvas!).color;
      ctx!.lineCap = "round";
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        if (b.t - a.t > 120) continue; // the pen was lifted
        const life = 1 - (now - b.t) / LIFE;
        ctx!.globalAlpha = life * 0.85;
        ctx!.lineWidth = 0.6 + life * 2.4;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }
      frame = points.length ? requestAnimationFrame(draw) : 0;
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !isOn()) return;
      points.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} className="pen-trail" aria-hidden="true" />;
}
