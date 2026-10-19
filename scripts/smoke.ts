import { z } from "zod"

const baseUrl = process.env.CAMOFOX_URL ?? "http://localhost:9377"
const userId = "scrapist-smoke"
const sessionKey = "smoke"
const targetUrl = "https://example.com"
const refPattern = /e\d+/

const healthSchema = z.object({ ok: z.boolean() })

const tabSchema = z.object({ tabId: z.string(), url: z.string().optional() })

const snapshotSchema = z.object({ url: z.string(), snapshot: z.string() })

const send = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, init)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `${init?.method ?? "GET"} ${path} -> ${response.status} ${body}`,
    )
  }
  return response.json()
}

const main = async () => {
  const health = healthSchema.parse(await send("/health"))
  console.log(`health ok=${health.ok}`)

  const tab = tabSchema.parse(
    await send("/tabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, sessionKey, url: targetUrl }),
    }),
  )
  console.log(`tab ${tab.tabId}`)

  const snapshot = snapshotSchema.parse(
    await send(`/tabs/${tab.tabId}/snapshot?userId=${userId}`),
  )
  if (!refPattern.test(snapshot.snapshot)) {
    throw new Error("smoke failed: snapshot contained no element refs")
  }
  console.log(snapshot.snapshot.slice(0, 300))
  console.log("camofox smoke ok")
}

try {
  await main()
} finally {
  await send(`/sessions/${userId}`, { method: "DELETE" })
}
