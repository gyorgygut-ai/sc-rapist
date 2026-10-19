import { z } from "zod"
import { evaluate, sourceUrl, withPage } from "./camofox.ts"

const countSchema = z.object({
  articles: z.number().int().nonnegative(),
  uniqueUrls: z.number().int().nonnegative(),
})

const expression = `(() => {
  const cards = [...document.querySelectorAll("article")]
  const urls = new Set(
    cards.map((card) => card.querySelector("a[href]")?.href).filter(Boolean),
  )
  return { articles: cards.length, uniqueUrls: urls.size }
})()`

const counts = await withPage((tabId) =>
  evaluate(tabId, expression, countSchema),
)

console.log(`${sourceUrl} articles=${counts.articles} unique=${counts.uniqueUrls}`)
if (counts.articles < 10 || counts.uniqueUrls < 10) {
  throw new Error("smoke failed: homepage article cards missing")
}
console.log("444 top-talked smoke ok")
