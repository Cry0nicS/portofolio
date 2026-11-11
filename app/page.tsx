import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const now = [
  "Leading website, AI & automation at mkk meine-krankenkasse",
  "Based in Berlin, working remote",
  "Open to interesting conversations",
];

const esportsStats = [
  ["The International 2017", "admin / referee"],
  ["Kiev Major 2017 · Boston Major 2016", "admin / referee"],
  [
    "Millions of users monthly",
    "a core GosuGamers module I designed and built",
  ],
  [
    "Founded Esports Addicts",
    "events across multiple Romanian cities (2015 – 2018)",
  ],
];

const esportsTimeline = [
  [
    "2012 – 2014",
    "Dota 2 Romania",
    "developer, live commentator, tournament admin",
  ],
  ["2013 – 2015", "PGL", "first Dota 2 events in Romania, DreamHack Bucharest"],
  [
    "2014",
    "IeSF",
    "hosted the Dota 2 regional qualifiers for the e-Sports World Championship",
  ],
  [
    "2014 – 2016",
    "Esports journalist",
    "live coverage and interviews in Romanian and English",
  ],
  [
    "",
    "joinDOTA League",
    "tournament admin, then trained a team of junior admins",
  ],
  ["2015 – 2018", "Founder, Esports Addicts", ""],
  [
    "2015 – 2022",
    "Software Engineer, GosuGamers",
    "back end to full stack; admin panel used daily around the globe",
  ],
  [
    "2016 – 2018",
    "The big stages",
    "The International, Kiev and Boston Majors, PUBG and Fortnite championships",
  ],
];

const tools = ["Claude Code", "MCP", "n8n", "AWS Bedrock", "OpenRouter"];

const projects = [
  [
    "RAG in production",
    "AI search and “Ask AI” for a health insurer",
    "Built Algolia AI search and set up an Ask AI answer agent on the public website: configuration, prompts, guardrails, model selection and widget.",
  ],
  [
    "LLM-as-a-judge",
    "Testing an AI that answers health questions",
    "A self-built evaluation and regression-testing tool for the answer agent (TypeScript, GitLab CI, Algolia API), so model and prompt changes are decided on evidence, not gut feeling.",
  ],
  [
    "200+ submissions in month one",
    "User feedback, triaged by AI",
    "Built alone from idea to delivery: on-page feedback, n8n, AWS Bedrock classification and fix proposals, a human reviewer, routing to Slack and Jira.",
  ],
];

const sideProjects = [
  [
    "Chaptify",
    "Splits audiobooks into per-chapter files. Solo full stack: Nuxt, SQLite job queue, FFmpeg worker, Docker, CI.",
    "Tool",
    "https://chaptify.app",
    "chaptify.app",
  ],
  [
    "Cafe Prana",
    "Bilingual website for a vegan cafe in Prenzlauer Berg; the owner, Sarah, edits content herself via Nuxt Studio, no developer needed.",
    "Client site",
    "https://www.cafeprana.de",
    "cafeprana.de",
  ],
  [
    "Cancer Type Classifier",
    "Open-source Nuxt front end for a classifier based on DNA methylation profiles, built with two researchers who own the model.",
    "Open source · discontinued",
    "https://github.com/Cry0nicS/cancer-classifier-frontend",
    "github.com",
  ],
];

const experience = [
  [
    "2024 — Now",
    "mkk meine-krankenkasse",
    "Technical Product Owner, Website, AI & Automation",
  ],
  ["2022 — 2024", "mkk meine-krankenkasse", "Senior Software Developer"],
  ["2015 — 2022", "GosuGamers", "Software Engineer"],
  ["2015 — 2018", "Esports Addicts", "Founder & Project Manager"],
  ["2013 — 2015", "CGM Clinical Österreich", "Software Engineer"],
];

function Scribble({ d, viewBox }: { d: string; viewBox: string }) {
  return (
    <svg
      className="scribble"
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Rule() {
  return (
    <svg
      className="rule wrap"
      viewBox="0 0 600 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M2 6C60 2 110 9 170 5s120-3 180 1 110 3 160-1 60 1 86 1" />
    </svg>
  );
}

function Chapter({
  id,
  version,
  years,
  children,
}: {
  id: string;
  version: string;
  years: string;
  children: ReactNode;
}) {
  return (
    <section className="wrap chapter" id={id}>
      <p className="marker">
        <span className="tag">{version}</span>
        <span className="muted">{years}</span>
      </p>
      <div className="chapter-body">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="wrap hero">
        <p className="tag">Patch notes, v3 · 2026 · Berlin</p>
        <h1>
          <span className="underlined">
            Builder
            <Scribble
              viewBox="0 0 300 14"
              d="M3 9C50 3 96 12 150 6s98-3 147 2"
            />
          </span>{" "}
          first.
        </h1>
        <div className="hero-grid">
          <p className="lead">
            Technical Product Owner at mkk meine-krankenkasse, leading the
            public website and applied AI adoption in the digital department.
            Previously nearly a decade in esports, as an engineer at GosuGamers
            and as an admin and referee at Dota 2 Majors and The International.
          </p>
          <blockquote className="manifesto">
            <p>
              I believe the best use of AI is not replacing people but giving
              them systems they can run themselves. Build it, test it, ship it,
              then{" "}
              <span className="circled">
                hand it over
                <Scribble
                  viewBox="0 0 120 40"
                  d="M14 8C45 0 98 2 112 16s-22 22-58 22S2 30 6 18 30 4 62 5"
                />
              </span>{" "}
              so it keeps working without me.
            </p>
          </blockquote>
        </div>
        <div className="hero-foot">
          <a className="btn btn-primary" href="#work">
            See the work
          </a>
          <a className="btn" href="#esports">
            The esports years
          </a>
          <p className="note">
            <Scribble
              viewBox="0 0 44 26"
              d="M42 20C28 24 12 20 4 8M4 8l1 9M4 8l9 2"
            />
            gg wp. now back to shipping.
          </p>
        </div>
      </section>

      <ul className="wrap now" aria-label="Now">
        {now.map((item) => (
          <li key={item}>
            <span className="dot" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <Rule />

      <Chapter id="esports" version="v1 · esports" years="2012 – 2022">
        <h2>Ten years in the server room of esports.</h2>
        <p>
          I started as a volunteer in 2012, helping turn a weekend Dota 2
          project into a Romanian media site with 10,000+ monthly users. I
          administered leagues, commentated matches, covered events as a
          journalist, and founded Esports Addicts to grow the local scene with
          tournaments across Romanian cities.
        </p>
        <p>
          Along the way I refereed and administered at some of the biggest
          stages in the game, and spent seven years as an engineer at
          GosuGamers, one of the world&apos;s largest esports media platforms.
        </p>
        <ul className="grid two">
          {esportsStats.map(([stat, label]) => (
            <li className="card" key={stat}>
              <p className="stat">{stat}</p>
              <p className="mono">{label}</p>
            </li>
          ))}
        </ul>
        <ol className="rows">
          {esportsTimeline.map(([years, title, detail]) => (
            <li key={title}>
              <span className="mono">{years}</span>
              <span>
                <strong>{title}</strong>
                {detail && <span className="muted"> · {detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      </Chapter>

      <Rule />

      <section className="interlude" id="berlin">
        <p className="loading tag">
          <span className="bar" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          loading v2 · berlin · 2020 – 2022
        </p>
        <h2>Then the arenas went quiet.</h2>
        <p>
          For years I worked fully remote as a digital nomad, building esports
          products from wherever the next event or flight took me. When Corona
          hit, live esports stopped overnight, and so did the nomad life.
        </p>
        <p>
          In spring 2021, as the borders reopened, I moved to Berlin and settled
          here. A year later I left gaming for something completely different:
          the public website of a German statutory health insurer.
        </p>
        <p>
          Same habits, different stakes: millions of insured people, regulation,
          accessibility, and a legacy platform nobody owned.
        </p>
        <p className="newgame">&gt; game over. new game +</p>
      </section>

      <Rule />

      <Chapter id="work" version="v3 · ai-first" years="2022 – now">
        <h2>Making a whole department faster with AI.</h2>
        <p>
          At mkk meine-krankenkasse I initiated and lead applied AI adoption in
          the digital department. I&apos;m setting up our organisation-level
          Claude environment, with custom skills, repositories and workflows
          that about 15 colleagues now use for their daily work, and bringing
          new tools into real use. Workshops and hackathons are next.
        </p>
        <ul className="chips" aria-label="Tools in use">
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <p>
          I care less about demos and more about systems other people can
          operate without me. That&apos;s how one person&apos;s curiosity turns
          into a team&apos;s capability.
        </p>

        <h2 className="sub">Hands-on projects, idea to production.</h2>
        <p>
          Small team, regulated industry, real users. Each project is proof that
          one product owner who still writes code can change what a team ships.
        </p>
        <ul className="grid">
          {projects.map(([stat, title, text]) => (
            <li className="card" key={title}>
              <p className="stat">{stat}</p>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      <Rule />

      <section className="wrap chapter-body" id="after-hours">
        <p className="tag">side quests</p>
        <h2>Things I build after hours.</h2>
        <ul className="grid">
          {sideProjects.map(([title, text, tag, href, host]) => (
            <li key={title} style={{ display: "contents" }}>
              <a className="card" href={href}>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-foot mono">
                  <span>{tag}</span>
                  <span>{host} ↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Rule />

      <section className="wrap chapter-body" id="experience">
        <p className="tag">changelog</p>
        <h2>Experience</h2>
        <ol className="rows exp">
          {experience.map(([years, company, role]) => (
            <li key={years + role}>
              <span className="mono">{years}</span>
              <strong>{company}</strong>
              <span className="muted">{role}</span>
            </li>
          ))}
        </ol>
        <p className="mono muted">
          BSc Computer Science, Technical University of Cluj-Napoca · thesis on
          multi-agent systems for traffic routing. Certification: CSPO.
        </p>
      </section>

      <Rule />
    </>
  );
}
