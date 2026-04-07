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

import type { LiveAlert, GeminiBriefing } from "@/types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// 8-second hard timeout — Groq typically responds in 5-8s, so Gemini
// must finish within the same window to not delay the UI.
const TIMEOUT_MS = 8000;

/**
 * Returns a GeminiBriefing with up to 4 fields from a single grounded search call:
 *   alert       — safety issue (IMD, NHAI, bandh, closure) — null if none
 *   source      — e.g. "IMD", "NHAI"
 *   weatherNow  — current conditions in one sentence — null if uncertain
 *   currentEvent — active festival/mela this week — null if none
 *
 * Deliberately excludes crowdLevel (redundant with scoring) and trendingNow
 * (unverifiable — hallucination risk). Scope stays narrow = higher parse success.
 *
 * Always fails silently — null = no data, never throws.
 */
export async function getLiveAlert(
  destination: string,
  state: string,
  startDate: string
): Promise<GeminiBriefing | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt =
    `You are a live travel intelligence agent. Search the web for current information about ` +
    `${destination}, ${state}, India for travel around ${startDate}.\n\n` +
    `Respond ONLY with valid JSON — no markdown, no extra text:\n` +
    `{\n` +
    `  "alert": "<one sentence about any ACTIVE safety issue: IMD red/orange alert, landslide, road closure, bandh, or major monument/park closure in last 7 days — null if none>",\n` +
    `  "source": "<source name e.g. IMD, NHAI — null if no alert>",\n` +
    `  "weatherNow": "<current weather in one sentence: temperature range + conditions e.g. 'Partly cloudy, 28–34°C, light evening showers possible' — null if uncertain>",\n` +
    `  "currentEvent": "<name of any festival, mela, or major event happening THIS week at ${destination} — null if none>"\n` +
    `}\n\n` +
    `Rules: Only include verified, recent information. If you are not confident about a field, use null. ` +
    `weatherNow should reflect actual current conditions, not seasonal averages.`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 350 },
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

    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

    const briefing: GeminiBriefing = {};

    if (typeof parsed.alert === "string" && parsed.alert.length > 10) {
      briefing.alert = parsed.alert.trim();
    }
    if (typeof parsed.source === "string" && parsed.source.length > 0) {
      briefing.source = parsed.source.trim();
    }
    if (typeof parsed.weatherNow === "string" && parsed.weatherNow.length > 5) {
      briefing.weatherNow = parsed.weatherNow.trim();
    }
    if (typeof parsed.currentEvent === "string" && parsed.currentEvent.length > 3) {
      briefing.currentEvent = parsed.currentEvent.trim();
    }

    // Return null only if we got absolutely nothing useful
    if (!briefing.alert && !briefing.weatherNow && !briefing.currentEvent) {
      return null;
    }

    return briefing;
  } catch {
    // Network error, timeout, parse error — always return null, never throw
    return null;
  }
}

/**
 * Converts a GeminiBriefing to a LiveAlert for backward-compatible UI display.
 * Returns null if no safety alert present.
 */
export function toLiveAlert(briefing: GeminiBriefing | null): LiveAlert | undefined {
  if (!briefing?.alert) return undefined;
  return { text: briefing.alert, source: briefing.source };
}
