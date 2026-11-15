// Homepage content.
export const now = [
  "Leading website, AI & automation at mkk meine-krankenkasse",
  "Based in Berlin, working remote",
  "Open to interesting conversations",
];

type Project = { stat: string; title: string; text: string };
type Stat = { stat: string; label: string };
type TimelineEntry = { years?: string; title: string; detail?: string };
type Job = { years: string; company: string; role: string };
type SideProject = {
  title: string;
  text: string;
  kind: string;
  href: string;
  discontinued?: true;
};

export const esportsStats: Stat[] = [
  { stat: "The International 2017", label: "admin / referee" },
  { stat: "Kiev Major 2017 · Boston Major 2016", label: "admin / referee" },
  {
    stat: "Millions of users monthly",
    label: "a core GosuGamers module I designed and built",
  },
  {
    stat: "Founded Esports Addicts",
    label: "events across multiple Romanian cities (2015 – 2018)",
  },
];

export const esportsTimeline: TimelineEntry[] = [
  {
    years: "2012 – 2014",
    title: "Dota 2 Romania",
    detail: "developer, live commentator, tournament admin",
  },
  {
    years: "2013 – 2015",
    title: "PGL",
    detail: "first Dota 2 events in Romania, DreamHack Bucharest",
  },
  {
    years: "2014",
    title: "IeSF",
    detail:
      "hosted the Dota 2 regional qualifiers for the e-Sports World Championship",
  },
  {
    years: "2014 – 2016",
    title: "Esports journalist",
    detail: "live coverage and interviews in Romanian and English",
  },
  {
    title: "joinDOTA League",
    detail: "tournament admin, then trained a team of junior admins",
  },
  { years: "2015 – 2018", title: "Founder, Esports Addicts" },
  {
    years: "2015 – 2022",
    title: "Software Engineer, GosuGamers",
    detail: "back end to full stack; admin panel used daily around the globe",
  },
  {
    years: "2016 – 2018",
    title: "The big stages",
    detail:
      "The International, Kiev and Boston Majors, PUBG and Fortnite championships",
  },
];

export const tools = ["Claude Code", "MCP", "n8n", "AWS Bedrock", "OpenRouter"];

export const projects: Project[] = [
  {
    stat: "RAG in production",
    title: "AI search and “Ask AI” for a health insurer",
    text: "Built Algolia AI search and set up an Ask AI answer agent on the public website: configuration, prompts, guardrails, model selection and widget.",
  },
  {
    stat: "LLM-as-a-judge",
    title: "Testing an AI that answers health questions",
    text: "A self-built evaluation and regression-testing tool for the answer agent (TypeScript, GitLab CI, Algolia API), so model and prompt changes are decided on evidence, not gut feeling.",
  },
  {
    stat: "200+ submissions in month one",
    title: "User feedback, triaged by AI",
    text: "Built alone from idea to delivery: on-page feedback, n8n, AWS Bedrock classification and fix proposals, a human reviewer, routing to Slack and Jira.",
  },
];

export const sideProjects: SideProject[] = [
  {
    title: "Chaptify",
    text: "Splits audiobooks into per-chapter files. Solo full stack: Nuxt, SQLite job queue, FFmpeg worker, Docker, CI.",
    kind: "Tool",
    href: "https://chaptify.app",
  },
  {
    title: "Cafe Prana",
    text: "Bilingual website for a vegan cafe in Prenzlauer Berg; the owner, Sarah, edits content herself via Nuxt Studio, no developer needed.",
    kind: "Client site",
    href: "https://www.cafeprana.de",
  },
  {
    title: "Cancer Type Classifier",
    text: "Open-source Nuxt front end for a classifier based on DNA methylation profiles, built with two researchers who own the model.",
    kind: "Open source",
    href: "https://github.com/Cry0nicS/cancer-classifier-frontend",
    discontinued: true,
  },
];

// shortcut: strips only a leading www.; paths and other subdomains need a real rule.
export const hostOf = (href: string) =>
  new URL(href).host.replace(/^www\./, "");

export const experience: Job[] = [
  {
    years: "2024 — Now",
    company: "mkk meine-krankenkasse",
    role: "Technical Product Owner, Website, AI & Automation",
  },
  {
    years: "2022 — 2024",
    company: "mkk meine-krankenkasse",
    role: "Senior Software Developer",
  },
  { years: "2015 — 2022", company: "GosuGamers", role: "Software Engineer" },
  {
    years: "2015 — 2018",
    company: "Esports Addicts",
    role: "Founder & Project Manager",
  },
  {
    years: "2013 — 2015",
    company: "CGM Clinical Österreich",
    role: "Software Engineer",
  },
];

// Each Release's header details and short dock label; bodies live in page.tsx.
export const releases = [
  {
    id: "v3",
    version: "v3.0",
    name: "ai-first",
    years: "2022 – now",
    short: "ai",
  },
  {
    id: "berlin",
    version: "v2.0",
    name: "berlin",
    years: "2020 – 2022",
    short: "berlin",
  },
  {
    id: "esports",
    version: "v1.0",
    name: "esports",
    years: "2012 – 2022",
    short: "esports",
  },
  {
    id: "after-hours",
    version: "ext",
    name: "side quests",
    years: "after hours",
    short: "quests",
  },
  {
    id: "experience",
    version: "log",
    name: "version history",
    years: "2013 – now",
    short: "history",
  },
] as const;

export type ReleaseId = (typeof releases)[number]["id"];
