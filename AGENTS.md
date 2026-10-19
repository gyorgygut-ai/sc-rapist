# Scrapist

**Value Proposition**: It wouldn't be called scraping if it was legal

---

## Non-negotiable

**SPECS > Code**: Code matched to authoritive specs; NOT specs to code
**Don't Force It**: Let TS infer; no need to force types. No `any`, `as`.
**Don't Get Caught**: Always use `camofox browser` to drive stealth discovery + scraping.
**Idempotency**: Text labels change. Prefer lookup by a constant instead (e.g. "role").

---

## Process

**0. Setup**:

- **Problem**: I want my enviroment set up for tooling
- **Approach**: Install missing tooling; otherwise proceed
- **Outcome**: Seamless, idempotent tooling; no one-off hacks
- **Tool**: [Camofox Browser](https://github.com/jo-inc/camofox-browser)
- **Acceptance**:

  - `npm`, `npx` accessible
  - `typescript`, `oxlint`, `zod` installed
  - `npm install` succeeds without error
  - quick smoke proves `camofox` working

**1. Scaffolding**:

- **Problem**: I want to quickly scaffold new targets
- **Approach**: Interview user about scrape target + goals
- **Outcome**: Requirements ready to be mapped to a new folder
- **Acceptance**:

  - New `./jobs/{new-name}/` exists
  - New `./jobs/{new-name}/schemas` exists
  - New `./jobs/{new-name}/jobs` exists
  - New `./jobs/{new-name}/results` exists
  - New `./jobs/{new-name}/AGENTS.md` exists
  - `./jobs/{new-name}/AGENTS.md` describes url, goals, flows
  - `./jobs/{new-name}/AGENTS.md` matches tone + style of this doc

**2. Discovery**:

- **Problem**: I want scraping based on facts; not guesses
- **Approach**: One-off LLM-driven discovery of target site
- **Outcome**: Target markup, forms and url structure mapped
- **Acceptance**:

  - `./jobs/{job-name}/AGENTS.md` describes critical rules for idempotent runs
  - `./jobs/{job-name}/schemas/*.schema.ts` one schema file per data type

**3. Scrape Jobs**:

- **Problem**: I want to periodically do the same scraping flow
- **Approach**: Deterministic code-driven scraping, saving results
- **Outcome**: Job runs without error
- **Acceptance**:

  - 1. Created: `./jobs/{job-name}/smoke.ts`
  - 1. Created: `./jobs/{job-name}/visit.ts`
  - 3. Created: npm `job:{job-name}:smoke`, `tsx -> smoke.ts`
  - 4. Created: npm `job:{job-name}:visit`, `tsx -> visit.ts`
  - 5. Code uses schemas for end-to-end type safety
  - 6. Verification: `npm run job:{job-name}:smoke` executed
  - 7. Verification: `npm run job:{job-name}:visit` executed
  - 8. Exists: `./jobs/{job-name}/results/{{unique-timestamp}-{job-name}}.yml`
  - 9. Verification: `npm run job:{job-name}:visit` executed again
  - 10. Exists: `./jobs/{job-name}/results/{{unique-timestamp}-{job-name}}.yml`
