import { z } from "zod"

const baseUrl = process.env.CAMOFOX_URL ?? "http://localhost:9377"
const userId = "scrapist-444-top-talked"
const sessionKey = "444-top-talked"
export const sourceUrl = "https://444.hu/"

const tabSchema = z.object({ tabId: z.string() })
const payloadSchema = z.object({ result: z.unknown() })

const send = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, init)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `${init?.method ?? "GET"} ${path} -> ${response.status} ${body}`,
    )
  }
  const body: unknown = await response.json()
  return body
}

export const withPage = async <T>(run: (tabId: string) => Promise<T>) => {
  const tab = tabSchema.parse(
    await send("/tabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, sessionKey, url: sourceUrl }),
    }),
  )
  try {
    return await run(tab.tabId)
  } finally {
    await send(`/sessions/${userId}`, { method: "DELETE" })
  }
}

export const evaluate = async <T>(
  tabId: string,
  expression: string,
  schema: z.ZodType<T>,
) => {
  const payload = payloadSchema.parse(
    await send(`/tabs/${tabId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, expression }),
    }),
  )
  return schema.parse(payload.result)
}
