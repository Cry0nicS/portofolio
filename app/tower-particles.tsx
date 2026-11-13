"use client";

// The Berlin TV tower as a cloud of accent-coloured dots that scatter from the mouse and settle back.
import { useEffect, useRef } from "react";
import { runParticles } from "./particles";

const TOWER_M = 368; // real height in metres; the shape below is drawn in metres

// Home points in metres: x centred on the axis, y up from the ground; a is the dot's opacity.
function silhouette() {
  const out: [number, number, number][] = [];
  const add = (n: number, a: number, at: () => [number, number] | null) => {
    while (n > 0) {
      const point = at();
      if (!point) continue;
      out.push([...point, a]);
      n--;
    }
  };
  const r = Math.random;
  const span = (half: number) => (r() * 2 - 1) * half;
  const SPHERE_Y = 213; // sphere centre, a little under 2/3 of the height
  const SPHERE_R = 20; // a touch larger than life so it reads at sidebar size

  add(130, 0.7, () => [span(42 - r() * 14), r() * 9]); // pavilion base
  add(320, 0.6, () => {
    const t = r();
    return [span(14 - 9.5 * t), 9 + t * (SPHERE_Y - 9)]; // shaft tapering upwards
  });
  add(480, 0.9, () => {
    const [x, y] = [span(SPHERE_R), span(SPHERE_R)];
    return x * x + y * y <= SPHERE_R * SPHERE_R ? [x, SPHERE_Y + y] : null;
  });
  add(130, 1, () => [span(SPHERE_R + 3), SPHERE_Y + 1 + r() * 4]); // observation deck band
  add(50, 0.8, () => [span(4), SPHERE_Y + SPHERE_R + r() * 18]); // neck above the sphere
  add(170, 0.85, () => {
    const t = r();
    return [span(2.6 - 2 * t), 251 + t * (TOWER_M - 251)]; // antenna spire
  });
  return out;
}

export function TowerParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const shape = silhouette();
    return runParticles(ref.current, (width, height) => {
      const scale = Math.min((height - 8) / TOWER_M, (width - 8) / 84);
      return shape.map(([mx, my, a]) => [
        width / 2 + mx * scale,
        height - 4 - my * scale,
        a,
      ]);
    });
  }, []);

  return <canvas ref={ref} className="cl-tower" aria-hidden="true" />;
}
