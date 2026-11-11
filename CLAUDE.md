## Project

Personal hobby portfolio site.

- **Runtime / package manager:** Bun. Use `bun install`, `bun run`, `bunx`. Don't use npm, yarn or pnpm, and don't commit their lockfiles.
- **Language:** TypeScript only, in strict mode. No `.js` source files.
- **Framework:** Next.js.
- **Quality:** ESLint for linting, Prettier for formatting. Code must pass both before it is committed.
- **Hosting:** Vercel free (Hobby) tier. Stay within its limits: no paid add-ons, keep serverless and edge usage modest.
- **CI:** GitHub Actions runs lint, the Prettier check, the type check and the build on pushes and PRs.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `Cry0nicS/portofolio`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
