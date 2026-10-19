# 444 Top Talked People

**Value Proposition**: Three names tell you what 444.hu is on about today

---

## Non-negotiable

**SPECS > Code**: Code matched to authoritive specs; NOT specs to code
**Don't Force It**: Let TS infer; no need to force types. No `any`, `as`.
**Don't Get Caught**: Always use `camofox browser` to drive stealth discovery + scraping.
**Idempotency**: Text labels change. Prefer lookup by a constant instead (e.g. "role").
**Simple > Clever**: Name detection is plain code. Two capitalized words, stopword filter. No NER, no LLM, no tag scraping.

---

## Target

- **URL**: `https://444.hu/` — homepage only
- **Goal**: the 3 most talked about person names on the homepage
- **Signal**: how many homepage articles mention the name (headline + lead)
- **Out of scope**: article bodies, pagination, archives, comments, site-wide search

## Flow

1. `camofox` tab → homepage (DOM is complete on load; no scrolling needed)
2. Privacy dialog exists as an overlay and does **not** block the DOM — leave it
3. Collect every `<article>` card (28 today)
4. Extract names with `names.ts`: `findNames(text)` — capitalized-word-pair regex, minus a small stopword set
5. Dedupe within an article — one article counts once per name
6. Tally across articles, rank by count desc, ties break by first appearance
7. Keep top 3, write `results/{unique-timestamp}-444-top-talked-people.yml`

## Discovery facts (2026-10-19)

- **No `<main>`** on the page. Cards are `document.querySelectorAll("article")` → 28, all with distinct URLs.
- **Class names are hashed** (`juj5qq4`, `_19gjvagj`, …) and change per build. Never select on class.
- Card shape, by role only:
  - `article > h1` → headline
  - `article > p` → lead (first paragraph only)
  - `article > a[href]` → article URL, absolute after `.href`
- Most links are `/YYYY/MM/DD/slug`; one card links offsite (partner site). Keep it — it sits on the homepage.
- Extraction runs through `POST /tabs/:tabId/evaluate`; camofox opens the tab via `POST /tabs` and cleans up with `DELETE /sessions/:userId`.

## Data

- `PersonMention`: `name`, `count`, `articles[]` (`title`, `url`)
- `Report`: `scrapedAt`, `sourceUrl`, `articleCount`, `top` (exactly 3)

Schema lives in `schemas/report.schema.ts`; scripts validate before writing.

## Run

- `npm run job:444-top-talked-people:smoke` — page opens, ≥10 article cards with urls
- `npm run job:444-top-talked-people:visit` — writes one YAML per run, never overwrites

## Known limits

- Inflected names are separate entries: `Kaprinyák Tibort` ≠ `Kaprinyák Tibor`.
- Non-person bigrams surface (`Környezetért Felelős`, `Modern Gyárak`); tune the stopword set in `names.ts`, not the regex.
- Headlines only: people named only in article bodies are invisible.
