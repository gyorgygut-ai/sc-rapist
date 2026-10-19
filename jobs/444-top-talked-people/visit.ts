import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { stringify } from "yaml"
import { z } from "zod"
import { evaluate, sourceUrl, withPage } from "./camofox.ts"
import { findNames } from "./names.ts"
import { reportSchema } from "./schemas/report.schema.ts"

const articleSchema = z.object({
  title: z.string(),
  lead: z.string(),
  url: z.string(),
})

const articlesSchema = z.array(articleSchema)

const expression = `(() => {
  const norm = (text) => text.replace(/\\s+/g, " ").trim()
  return [...document.querySelectorAll("article")].map((card) => {
    const heading = card.querySelector("h1")
    const lead = card.querySelector("p")
    const link = card.querySelector("a[href]")
    return {
      title: heading ? norm(heading.innerText) : "",
      lead: lead ? norm(lead.innerText) : "",
      url: link ? link.href : "",
    }
  })
})()`

const articles = await withPage((tabId) =>
  evaluate(tabId, expression, articlesSchema),
)
const usable = articles.filter((article) => article.title && article.url)

const tally = new Map<
  string,
  { name: string; count: number; articles: { title: string; url: string }[] }
>()
for (const article of usable) {
  for (const name of findNames(`${article.title} ${article.lead}`)) {
    const entry = tally.get(name) ?? { name, count: 0, articles: [] }
    entry.count += 1
    entry.articles.push({ title: article.title, url: article.url })
    tally.set(name, entry)
  }
}
// Map keeps first-seen order, and sort is stable, so ties break by first appearance.
const top = [...tally.values()].sort((a, b) => b.count - a.count).slice(0, 3)

const report = reportSchema.parse({
  scrapedAt: new Date().toISOString(),
  sourceUrl,
  articleCount: usable.length,
  top,
})

const resultsDir = join(import.meta.dirname, "results")
mkdirSync(resultsDir, { recursive: true })
const stamp = report.scrapedAt.replace(/[:.]/g, "-")
const file = join(resultsDir, `${stamp}-444-top-talked-people.yml`)
writeFileSync(file, stringify(report))

console.log(`${usable.length} articles, saved ${file}`)
for (const [index, person] of report.top.entries()) {
  console.log(`${index + 1}. ${person.name} (${person.count})`)
}
