import { z } from "zod"

export const articleRefSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
})

export const personMentionSchema = z.object({
  name: z.string().min(1),
  count: z.number().int().positive(),
  articles: z.array(articleRefSchema).min(1),
})

export const reportSchema = z.object({
  scrapedAt: z.iso.datetime(),
  sourceUrl: z.string().url(),
  articleCount: z.number().int().nonnegative(),
  top: z.array(personMentionSchema).length(3),
})

export type ArticleRef = z.infer<typeof articleRefSchema>
export type PersonMention = z.infer<typeof personMentionSchema>
export type Report = z.infer<typeof reportSchema>
