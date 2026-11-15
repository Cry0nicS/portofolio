"use client";

// The sticky particle stage and the chapter rail; the chapters themselves scroll past in the page.
import { useState, type CSSProperties } from "react";
import { StoryParticles } from "./story-particles";

// Section ids in page order, also the rail labels
const chapters = ["start", "play", "code", "ship", "agents", "handoff"];

export function Story() {
  const [active, setActive] = useState(0);

  return (
    <div className="ab-stage">
      <StoryParticles onChapter={setActive} />
      <nav className="ab-rail mono" aria-label="Chapters">
        <ol style={{ "--at": active / (chapters.length - 1) } as CSSProperties}>
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
  );
}
