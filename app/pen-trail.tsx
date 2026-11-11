"use client";

// The mouse leaves a thin ink stroke in the accent colour that tapers and fades out.
import { useEffect, useRef } from "react";

const LIFE = 900; // ms a point stays visible

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
      canvas!.width = window.innerWidth * ratio;
      canvas!.height = window.innerHeight * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      const now = performance.now();
      points = points.filter((point) => now - point.t < LIFE);
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
      if (event.pointerType !== "mouse") return;
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
