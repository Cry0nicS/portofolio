// The about page: one cloud of dots turns into each chapter, from the first game to AI agents.
import type { Metadata } from "next";
import { og } from "../site";
import Link from "next/link";
import { Story } from "./story";
import "./about.css";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  openGraph: { ...og, url: "/about", title: "About" },
};

export default function About() {
  return (
    <div className="about">
      <Story />

      <section className="ab-step ab-step-wide" id="start" data-chapter>
        <div className="wrap">
          <h1>It started with a game.</h1>
          <p className="ab-lead">
            The long way from playing games to building with AI, told by one
            cloud of dots. Scroll to play it back; click to scatter it.
          </p>
        </div>
      </section>

      <section className="ab-step" id="play" data-chapter>
        <div className="wrap">
          <h2>First, the player.</h2>
          <p>
            Games came first. Dota 2 turned the hobby into a scene, and in 2012
            I started helping to build it as a volunteer for Dota 2 Romania.
          </p>
          <ul className="ab-facts">
            <li>
              <span>2012 – 2014</span> developer, live commentator and
              tournament admin, Dota 2 Romania
            </li>
            <li>
              <span>2015 – 2018</span> founded Esports Addicts to grow the local
              scene
            </li>
          </ul>
        </div>
      </section>

      <section className="ab-step" id="code" data-chapter>
        <div className="wrap">
          <h2>Then, the machine behind it.</h2>
          <p>
            The curiosity moved from the match to what made it run. My first
            code was written for games, and it led to a BSc in Computer Science
            at the Technical University of Cluj-Napoca.
          </p>
          <p>
            The thesis was already about AI: multi-agent systems for traffic
            routing, back when agents were far simpler than today. The
            fascination never left.
          </p>
        </div>
      </section>

      <section className="ab-step" id="ship" data-chapter>
        <div className="wrap">
          <h2>Then, software for millions.</h2>
          <p>
            Alongside the esports work came seven years as an engineer at
            GosuGamers, one of the world&apos;s largest esports media platforms.
            A core module I designed and built reached millions of users a
            month, and the admin panel was used daily around the globe.
          </p>
          <ul className="ab-facts">
            <li>
              <span>2013 – 2015</span> Software Engineer, CGM Clinical
              Österreich
            </li>
            <li>
              <span>2015 – 2022</span> Software Engineer, GosuGamers
            </li>
            <li>
              <span>2022 – 2024</span> Senior Software Developer, mkk
              meine-krankenkasse
            </li>
          </ul>
        </div>
      </section>

      <section className="ab-step" id="agents" data-chapter>
        <div className="wrap">
          <h2>Now, the agents caught up.</h2>
          <p>
            The idea from the thesis finally works for real. I lead applied AI
            adoption in the digital department at mkk meine-krankenkasse: an
            organisation-level Claude environment about 15 colleagues use every
            day, RAG in production, and an LLM-as-a-judge that tests it.
          </p>
          <ul className="ab-facts">
            <li>
              <span>2024 – now</span> Technical Product Owner, Website, AI &amp;
              Automation
            </li>
          </ul>
        </div>
      </section>

      <section className="ab-step ab-step-wide" id="handoff" data-chapter>
        <div className="wrap">
          <h2>Build it. Ship it. Hand it over.</h2>
          <p className="ab-lead">
            That is the logo, too: a trigger, a handoff, an agent and an output,
            in one run. Systems people can run without me.
          </p>
          <p className="ab-cta">
            <Link className="ab-btn ab-btn-primary" href="/#work">
              See the work
            </Link>
            {/* The contact footer is already on screen under this button, so the button writes instead of jumping */}
            <a className="ab-btn" href="mailto:contact@adrianpopescu.dev">
              Get in touch
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
