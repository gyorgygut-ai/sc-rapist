# Scrapist

**Value Proposition**: It wouldn't be called scraping if it was legal

---

## Non-negotiable

**SPECS > Code**: Code matched to authoritive specs; NOT specs to code
**Don't Force It**: Let TS infer; no need to force types. No `any`, `as`.
**Don't Get Caught**: Always use `camofox browser` to drive discovery + scraping.
**Be Future Proof**: Text labels change. Prefer lookup by a constant instead (e.g. "role").

---

## Process

**0. Setup**:

- **Problem**: I want my enviroment set up for tooling
- **Approach**: Install missing tooling; otherwise proceed
- **Outcome**: Seamless, idempotent tooling; no one-off hacks
- **Tool**: [Camofox Browser](https://github.com/jo-inc/camofox-browser)
- **Acceptance**:

  - `npm`, `npx` accessible
  - `ts`, `oxlint`, `zod` installed
  - `npm install` succeeds without error
  - quick smoke proves `camofox` working

**1. Scaffolding**:

- **Problem**: I want to quickly scaffold new targets
- **Approach**: Interview user about scrape target + goals
- **Outcome**: Requirements ready to be mapped to a new folder
- **Acceptance**:

  - New `./targets/{new-name}/` exists
  - New `./targets/{new-name}/schemas` exists
  - New `./targets/{new-name}/jobs` exists
  - New `./targets/{new-name}/results` exists
  - New`./targets/{new-name}/AGENTS.md` exists
  - New `AGENTS.md` describes url, goals, flows
  - New `AGENTS.md` matches tone + style of this doc

**2. Discovery**:

- **Problem**: I want scraping based on facts; not guesses
- **Approach**: One-off LLM-driven discovery of target site
- **Outcome**: Target markup, forms and url structure mapped
- **Acceptance**:

  - `./targets/{target}/AGENTS.md` describes critical facts
  - `./targets/{target}/schemas/*.schema.ts` one schema per data type

**3. Scrape Jobs**:

- **Problem**: I want to periodically do the same scraping flow
- **Approach**: Deterministic code-driven scraping, saving results
- **Outcome**: Job runs without error
- **Acceptance**:

  - 1. Created: `./targets/{target}/jobs/{job-name}.ts`
  - 2. Job uses schemas for end-to-end type safety
  - 3. Created: `tsx job:{job-name}`
  - 4. Verification: `tsx job:{job-name}` executed
  - 5. Exists: `./targets/{target}/results/{{unique-timestamp}-{job-name}}.yml`
  - 6. Verification: `tsx job:{job-name}` executed again
  - 7. Exists: `./targets/{target}/results/{{unique-timestamp}-{job-name}}.yml`
