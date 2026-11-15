"use client";

// The chapter rail and the sticky particle stage; the chapters themselves scroll past in the page.
import { useState, type CSSProperties } from "react";
import { StoryParticles } from "./story-particles";
import { smoothScrollClick } from "../smooth-scroll";

// Section ids in page order, also the rail labels
const chapters = ["start", "play", "code", "ship", "agents", "handoff"];

export function Story() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Outside the stage so it can sit above the chapters' text veil on phones */}
      <nav
        className="ab-rail mono"
        aria-label="Chapters"
        // Settle on every chapter passed so each shape forms on the way
        onClick={(event) => smoothScrollClick(event, "[data-chapter]")}
      >
        <p className="ab-rail-now" aria-hidden="true">
          {chapters[active]}
        </p>
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
      <div className="ab-stage">
        <StoryParticles onChapter={setActive} />
      </div>
    </>
  );
}
