// The homepage as release notes, newest first.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  now,
  esportsStats,
  esportsTimeline,
  tools,
  projects,
  sideProjects,
  experience,
} from "./content";
import { ReleaseIndex } from "./release-index";
import { TowerParticles } from "./tower-particles";
import "./home.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const marks = { add: "+", change: "~", remove: "−", next: "›" };

function Group({
  title,
  kind,
  children,
}: {
  title: string;
  kind: keyof typeof marks;
  children: ReactNode;
}) {
  return (
    <section className="cl-group" data-mark={marks[kind]}>
      <h3>{title}</h3>
      <ul>{children}</ul>
    </section>
  );
}

function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li>
      <strong>{title}</strong>
      <span>{children}</span>
    </li>
  );
}

function ReleaseHead({
  version,
  name,
  years,
  latest,
}: {
  version: string;
  name: string;
  years: string;
  latest?: boolean;
}) {
  return (
    <header className="cl-head">
      <p className="cl-ver">
        <span className="cl-num">{version}</span>
        <span className="cl-name">{name}</span>
      </p>
      <p className="cl-date">
        {latest && <span className="cl-badge">latest</span>}
        {years}
      </p>
    </header>
  );
}

export default function Home() {
  return (
    <div className="changelog wrap">
      <aside className="cl-side" aria-label="Release index">
        <p className="cl-side-title">
          Changelog
          <span className="cl-badge">v3.0 current</span>
        </p>
        <ReleaseIndex />
        <TowerParticles />
        <p className="cl-side-label">Status</p>
        <ul className="cl-now">
          {now.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>

      <div className="cl-main">
        <article className="cl-release" id="v3">
          <ReleaseHead
            version="v3.0"
            name="ai-first"
            years="2022 – now"
            latest
          />
          <h1>Builder first.</h1>
          <p className="cl-lead">
            Technical Product Owner at mkk meine-krankenkasse, leading the
            public website and applied AI adoption in the digital department.
            Previously nearly a decade in esports, as an engineer at GosuGamers
            and as an admin and referee at Dota 2 Majors and The International.
          </p>
          <blockquote className="cl-quote">
            <p>
              I believe the best use of AI is not replacing people but giving
              them systems they can run themselves. Build it, test it, ship it,
              then hand it over so it keeps working without me.
            </p>
          </blockquote>
          <p className="cl-cta">
            <a className="cl-btn cl-btn-primary" href="#work">
              See the work
            </a>
            <a className="cl-btn" href="#esports">
              The esports years
            </a>
          </p>
          {/* Shown on small screens only, where the sidebar status is hidden */}
          <ul className="cl-now cl-now-inline" aria-label="Status">
            {now.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <section className="cl-notes" id="work">
            <h2>Making a whole department faster with AI.</h2>
            <p>
              Small team, regulated industry, real users. Each entry is proof
              that one product owner who still writes code can change what a
              team ships.
            </p>

            <Group title="Added" kind="add">
              <Item title="Applied AI adoption">
                Initiated and lead it for the digital department at mkk
                meine-krankenkasse, bringing new tools into real use.
              </Item>
              <Item title="Organisation-level Claude environment">
                Custom skills, repositories and workflows that about 15
                colleagues now use for their daily work.
              </Item>
              <Item title="Toolchain">
                <span className="cl-tools">{tools.join(" · ")}</span>
              </Item>
            </Group>

            <Group title="Shipped" kind="add">
              {projects.map(([stat, title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span className="cl-stat">{stat}</span>
                  <span>{text}</span>
                </li>
              ))}
            </Group>

            <Group title="Changed" kind="change">
              <Item title="Role">
                Senior Software Developer (2022) to Technical Product Owner,
                Website, AI &amp; Automation (2024).
              </Item>
              <Item title="Focus">
                Less about demos, more about systems other people can operate
                without me. That is how one person&apos;s curiosity turns into a
                team&apos;s capability.
              </Item>
            </Group>

            <Group title="Unreleased" kind="next">
              <Item title="Workshops and hackathons">Next up.</Item>
            </Group>
          </section>
        </article>

        <article className="cl-release" id="berlin">
          <ReleaseHead version="v2.0" name="berlin" years="2020 – 2022" />
          <h2>Then the arenas went quiet.</h2>
          <p>
            Same habits, different stakes: millions of insured people,
            regulation, accessibility, and a legacy platform nobody owned.
          </p>

          <Group title="Removed" kind="remove">
            <Item title="Live esports">
              When Corona hit, it stopped overnight.
            </Item>
            <Item title="The nomad life">
              Years of working fully remote, building esports products from
              wherever the next event or flight took me, ended with it.
            </Item>
            <Item title="Gaming">
              Left the industry in 2022 for something completely different.
            </Item>
          </Group>

          <Group title="Changed" kind="change">
            <Item title="Home base">
              Moved to Berlin in spring 2021, as the borders reopened, and
              settled here.
            </Item>
            <Item title="Industry">
              From esports to the public website of a German statutory health
              insurer.
            </Item>
          </Group>
        </article>

        <article className="cl-release" id="esports">
          <ReleaseHead version="v1.0" name="esports" years="2012 – 2022" />
          <h2>Ten years in the server room of esports.</h2>
          <p>
            I started as a volunteer in 2012, helping turn a weekend Dota 2
            project into a Romanian media site with 10,000+ monthly users. I
            administered leagues, commentated matches, covered events as a
            journalist, and founded Esports Addicts to grow the local scene.
          </p>
          <p>
            Along the way I refereed and administered at some of the biggest
            stages in the game, and spent seven years as an engineer at
            GosuGamers, one of the world&apos;s largest esports media platforms.
          </p>

          <section className="cl-group">
            <h3>Highlights</h3>
            <dl className="cl-stats">
              {esportsStats.map(([stat, label]) => (
                <div key={stat}>
                  <dt>{stat}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="cl-group">
            <h3>Log</h3>
            <ol className="cl-log">
              {esportsTimeline.map(([years, title, detail]) => (
                <li key={title}>
                  <span className="cl-log-years">{years}</span>
                  <span>
                    <strong>{title}</strong>
                    {detail && <span className="muted"> · {detail}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </article>

        <article className="cl-release" id="after-hours">
          <ReleaseHead version="ext" name="side quests" years="after hours" />
          <h2>Things I build after hours.</h2>
          <ul className="cl-plugins">
            {sideProjects.map(([title, text, tag, href, host]) => (
              <li key={title}>
                <a
                  href={href}
                  data-mark={tag.includes("discontinued") ? "−" : "+"}
                >
                  <span className="cl-plugin-head">
                    <strong>{title}</strong>
                    <span className="cl-plugin-tag">{tag}</span>
                    <span className="cl-plugin-host">{host} ↗</span>
                  </span>
                  <span className="cl-plugin-text">{text}</span>
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="cl-release" id="experience">
          <ReleaseHead
            version="log"
            name="version history"
            years="2013 – now"
          />
          <h2>Experience</h2>
          <table className="cl-table">
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Company</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {experience.map(([years, company, role]) => (
                <tr key={years + role}>
                  <td>{years}</td>
                  <th scope="row">{company}</th>
                  <td>{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cl-edu">
            BSc Computer Science, Technical University of Cluj-Napoca · thesis
            on multi-agent systems for traffic routing. Certification: CSPO.
          </p>
        </article>
      </div>
    </div>
  );
}
