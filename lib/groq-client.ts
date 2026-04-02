/**
 * Groq LLM client with fail-loud env check.
 *
 * GOVERNANCE rules applied:
 * - ENV VARS FAIL LOUD: throws immediately if GROQ_API_KEY is missing — no silent undefined
 * - NODE RUNTIME: this file is only used in /api/generate/route.ts which uses Node runtime
 * - The LLM is ONLY called with pre-structured context (never raw user input)
 * - LLM writes narrative ONLY — all prices/logistics come from structured data, never from LLM
 */

import Groq from "groq-sdk";

// ── Fail loud on missing key ──────────────────────────────────────────────────
// Do not return undefined. Do not silently fall back. Throw explicitly.

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to .env.local before running. " +
        "Get a free key at console.groq.com (no credit card required)."
    );
  }
  return new Groq({ apiKey: apiKey.trim() });
}

// ── Response type ─────────────────────────────────────────────────────────────

export interface LLMResponse {
  narrative: string;
  dayPlan: string[];
  tradeoffs: string[];
  provider: "groq";
}

// ── System prompt ─────────────────────────────────────────────────────────────
// The LLM's role: interpret structured data, NOT generate logistics.

const SYSTEM_PROMPT = `You are Arjun — a well-travelled friend from a Tier 2 Indian city who gives honest,
enthusiastic travel advice. You talk like a smart friend, not a corporate travel agent.

CRITICAL RULES you must follow exactly:
1. DO NOT change any prices, train names, timings, or distances from the structured data given to you.
2. DO NOT invent new facts, hotels, restaurants, or attractions not in the data.
3. DO NOT use formal language like "I recommend" or "one may consider." Use "you should", "don't miss", "go for it."
4. Your job is ONLY to write the narrative, day plan, and format the tradeoff notes. Nothing else.
5. Keep narrative under 80 words. Keep each day plan item under 20 words.
6. Write in English but feel free to drop in desi phrases like "dost", "scene hai", "bilkul" where natural.`;

// ── Main generate function ────────────────────────────────────────────────────

export interface ItineraryContext {
  profile: string;
  destination: string;
  state: string;
  tagline: string;
  transportMode: string;
  trainName?: string;
  departure?: string;
  arrival?: string;
  overnight?: boolean;
  firstMile: string;
  lastMile: string;
  transportCostRoundtrip: number;
  trainClass?: string;
  nights: number;
  accommodationType: string;
  accommodationCost: number;
  foodBudget: number;
  activitiesBudget: number;
  totalSpent: number;
  totalBudget: number;
  utilizationPct: number;
  mustDo: string[];
  tradeoffNote?: string;
}

export async function generateItineraryNarrative(
  ctx: ItineraryContext
): Promise<LLMResponse> {
  const client = getGroqClient();

  const userPrompt = `Here is the structured data for a ${ctx.profile} itinerary to ${ctx.destination}, ${ctx.state}:

DESTINATION: ${ctx.destination} — "${ctx.tagline}"
TRANSPORT: ${ctx.transportMode}${ctx.trainName ? ` (${ctx.trainName})` : ""}
  Departs: ${ctx.departure ?? "flexible"} → Arrives: ${ctx.arrival ?? "varies"}${ctx.overnight ? " (overnight — saves a hotel night)" : ""}
  First mile: ${ctx.firstMile}
  Last mile: ${ctx.lastMile}
  Round-trip cost: ₹${ctx.transportCostRoundtrip.toLocaleString("en-IN")}${ctx.trainClass ? ` (${ctx.trainClass})` : ""}

STAY: ${ctx.nights} night(s) in ${ctx.accommodationType} — ₹${ctx.accommodationCost.toLocaleString("en-IN")} total
FOOD: ₹${ctx.foodBudget.toLocaleString("en-IN")} for the trip
ACTIVITIES: ₹${ctx.activitiesBudget.toLocaleString("en-IN")} budget
TOTAL SPEND: ₹${ctx.totalSpent.toLocaleString("en-IN")} of ₹${ctx.totalBudget.toLocaleString("en-IN")} budget (${ctx.utilizationPct}% used)

TOP THINGS TO DO:
${ctx.mustDo.map((a, i) => `${i + 1}. ${a}`).join("\n")}

${ctx.tradeoffNote ? `TRADEOFF INSIGHT: ${ctx.tradeoffNote}` : ""}

Now write:

1. NARRATIVE (under 80 words): An enthusiastic, honest description of why this trip is great for someone from a Tier 2 city. Mention the vibe, the journey, and one specific highlight. Don't repeat the budget numbers — those are shown separately.

2. DAY_PLAN: A simple day-by-day plan as a JSON array of strings. Each item under 20 words. For a ${ctx.nights}-night trip that's ${ctx.nights + 1} days. Format: ["Day 1: ...", "Day 2: ...", ...]

3. TRADEOFFS: Format the tradeoff insight (if any) as a JSON array of 1-2 short, punchy tips. Each under 25 words. If no tradeoff insight, return ["Prices verified at time of planning — confirm on IRCTC/RedBus before booking."]

Respond in this exact JSON format:
{
  "narrative": "...",
  "dayPlan": ["Day 1: ...", "Day 2: ..."],
  "tradeoffs": ["...", "..."]
}`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: { narrative?: string; dayPlan?: string[]; tradeoffs?: string[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return {
    narrative: parsed.narrative ?? `${ctx.destination} is a great ${ctx.profile}-budget pick from here. Worth every rupee.`,
    dayPlan: parsed.dayPlan ?? [`Day 1: Arrive, explore. Day 2: Top sights. Day ${ctx.nights + 1}: Return.`],
    tradeoffs: parsed.tradeoffs ?? ["Prices verified at time of planning — confirm on IRCTC/RedBus before booking."],
    provider: "groq",
  };
}

// ── Batch generation (all 3 profiles, 3 parallel requests) ───────────────────

export async function generateAllNarratives(
  contexts: ItineraryContext[]
): Promise<LLMResponse[]> {
  // GOVERNANCE: parallel requests, but each is independent — no chaining
  const results = await Promise.allSettled(
    contexts.map((ctx) => generateItineraryNarrative(ctx))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    // Fallback if one narrative fails — don't crash the whole response
    console.error(`Narrative generation failed for context ${i}:`, result.reason);
    return {
      narrative: `${contexts[i].destination} — ${contexts[i].profile} trip within your ₹${contexts[i].totalBudget.toLocaleString("en-IN")} budget.`,
      dayPlan: [`Day 1: Arrive & explore. Day ${contexts[i].nights + 1}: Return home.`],
      tradeoffs: ["Prices estimated — verify on IRCTC/RedBus before booking."],
      provider: "groq" as const,
    };
  });
}
