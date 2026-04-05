/**
 * Gemini Validator — "Live Eyes" layer.
 *
 * Runs in PARALLEL with Groq narrative generation (never blocks results).
 * Uses Gemini 2.0 Flash with Google Search Grounding to check for
 * real-time travel alerts: weather red alerts, landslides, road closures,
 * strikes, major monument/park closures.
 *
 * Scope is intentionally narrow — only weather/disaster/closure alerts,
 * NOT cafe hours or hotel reviews (unreliable for tier-2/3 India).
 *
 * Always fails silently — if Gemini is unavailable, results are returned
 * as-is without any alert. Never throws.
 *
 * Cost: $0 — Gemini 2.0 Flash free tier covers 5,000 grounded prompts/month.
 */

import type { LiveAlert } from "@/types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// 8-second hard timeout — Groq typically responds in 5-8s, so Gemini
// must finish within the same window to not delay the UI.
const TIMEOUT_MS = 8000;

export async function getLiveAlert(
  destination: string,
  state: string,
  startDate: string
): Promise<LiveAlert | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt =
    `Search for any ACTIVE travel alerts or safety warnings for ${destination}, ${state}, India ` +
    `around ${startDate}. Look specifically for: weather red/orange alerts from IMD, ` +
    `landslides or road closures on major routes, floods, strikes or bandhs, ` +
    `or official closures of major monuments or national parks announced in the last 7 days.\n\n` +
    `Respond ONLY with valid JSON — no markdown, no explanation:\n` +
    `• If a relevant alert exists: {"alert": "one concise sentence describing the issue", "source": "source name"}\n` +
    `• If nothing significant found: {"alert": null}`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    };

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    // Extract JSON from response (model sometimes wraps it in backticks)
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as { alert?: unknown; source?: unknown };

    if (
      !parsed.alert ||
      typeof parsed.alert !== "string" ||
      parsed.alert.length < 10
    ) {
      return null;
    }

    return {
      text: parsed.alert.trim(),
      source: typeof parsed.source === "string" ? parsed.source : undefined,
    };
  } catch {
    // Network error, timeout, parse error — always return null, never throw
    return null;
  }
}
