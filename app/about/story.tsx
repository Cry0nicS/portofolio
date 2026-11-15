"use client";

// The chapter rail and the sticky particle stage; the chapters themselves scroll past in the page.
import { useEffect, useState, type CSSProperties } from "react";
import { chapter, StoryParticles } from "./story-particles";
import { smoothScrollClick } from "../smooth-scroll";

// Section ids in page order, also the rail labels
export const chapters = ["start", "play", "code", "ship", "agents", "handoff"];

export function Story() {
  const [active, setActive] = useState(0);

  // Tracked here, not by the canvas, so the rail works before fonts load or without a canvas
  useEffect(() => {
    const steps = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    function track() {
      const centres = steps.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const { from, t } = chapter(centres, window.innerHeight / 2);
      setActive(t < 0.5 ? from : from + 1);
    }
    track();
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    return () => {
      window.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
    };
  }, []);

  return (
    <>
      {/* Outside the stage so it can sit above the chapters' text veil; below 900px the nav is the page dock */}
      <div className="ab-rail">
        <nav
          className="dock mono"
          aria-label="Chapters"
          // Slow through every chapter passed so each shape forms on the way
          onClick={(event) => smoothScrollClick(event, "[data-chapter]")}
        >
          <ol
            className="rail rail-end"
            style={{ "--at": active / (chapters.length - 1) } as CSSProperties}
          >
            {chapters.map((id, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  {id}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="ab-stage">
        <StoryParticles />
      </div>
    </>
  );
}
