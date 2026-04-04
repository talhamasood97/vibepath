/**
 * Groq LLM client — Musafir persona with local intelligence injection.
 *
 * GOVERNANCE rules applied:
 * - ENV VARS FAIL LOUD: throws immediately if GROQ_API_KEY is missing
 * - STRUCTURED GENERATION: LLM writes narrative ONLY. All prices/logistics from static data.
 * - LOCAL INTELLIGENCE: rich destination-specific data injected into prompts so Musafir
 *   sounds like a friend who's BEEN there, not a generic travel brochure.
 * - DESTINATION MODE: separate system prompt for "I know where I'm going" searches.
 */

import Groq from "groq-sdk";
import type { LocalIntelligence } from "@/types";

// ── Fail loud on missing key ──────────────────────────────────────────────────

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

// ── Discovery mode system prompt ──────────────────────────────────────────────
// Used when user doesn't know where to go (vibe-based search)

const DISCOVERY_SYSTEM_PROMPT = `You are Musafir — a well-travelled friend from a Tier 2 Indian city who gives honest,
enthusiastic travel advice. You talk like a smart dost, not a corporate travel agent or tourism brochure.

CRITICAL RULES:
1. DO NOT change any prices, train names, timings, or distances from the structured data given to you.
2. DO NOT invent new facts, hotels, restaurants, or attractions not explicitly provided in the data.
3. Write like a friend who has actually BEEN there. Reference the specific local intelligence given.
4. DO NOT use formal language. Use "you should", "don't miss", "go for it", "bilkul worth it".
5. Keep narrative under 90 words. Each day plan item under 25 words.
6. Use English naturally with occasional desi phrases (dost, scene hai, bilkul, bhai, yaar) where they fit.
7. The tradeoffs should be honest — tell them what this profile GIVES UP vs other options too.`;

// ── Destination mode system prompt ───────────────────────────────────────────
// Used when user has already chosen their destination

const DESTINATION_SYSTEM_PROMPT = `You are Musafir — a seasoned traveller who has been to this destination multiple times.
The user already knows WHERE they're going. They need YOUR local expertise on HOW to make it perfect.

CRITICAL RULES:
1. DO NOT change any prices, train names, timings from the structured data given to you.
2. Use the LOCAL INTELLIGENCE data provided to give hyper-specific recommendations.
   Reference actual place names, timing tips, and hidden gems from the data.
3. Be the friend who says "skip the overpriced place near the tourist gate, walk 5 mins to THIS spot".
4. Write like you lived there for 6 months. Specific, opinionated, honest.
5. Keep narrative under 100 words. Each day plan item under 30 words.
6. Mix English with natural desi phrases. Sound warm, not formal.
7. The tradeoffs should compare what each profile experience FEELS like, not just the budget difference.`;

// ── Context interfaces ────────────────────────────────────────────────────────

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
  localIntelligence?: LocalIntelligence | null;  // injected for richer narrative
  isDestinationMode?: boolean;                    // true when user chose destination directly
}

// ── Local intelligence formatter ──────────────────────────────────────────────
// Formats local data into structured text for the prompt

function formatLocalIntelligence(intel: LocalIntelligence, profile: string): string {
  const sections: string[] = [];

  if (intel.mustEat.length > 0) {
    const topFood = intel.mustEat.slice(0, profile === "comfort" ? 3 : 2);
    sections.push(
      `MUST EAT:\n${topFood.map((f) => `- ${f.name} (${f.area}): ${f.knownFor} — ${f.price}${f.tip ? `. TIP: ${f.tip}` : ""}`).join("\n")}`
    );
  }

  if (intel.streetFood.length > 0 && profile !== "comfort") {
    const sf = intel.streetFood.slice(0, 2);
    sections.push(
      `STREET FOOD:\n${sf.map((f) => `- ${f.name} at ${f.area} (${f.price})${f.tip ? ". " + f.tip : ""}`).join("\n")}`
    );
  }

  if (intel.hiddenGems.length > 0) {
    const gem = intel.hiddenGems[0]; // always surface at least one hidden gem
    sections.push(
      `HIDDEN GEM:\n- ${gem.name}: ${gem.what}. ${gem.why}${gem.bestTime ? ` Best time: ${gem.bestTime}` : ""}`
    );
  }

  if (intel.avoid.length > 0) {
    sections.push(
      `HONEST WARNINGS (tourist traps to avoid):\n${intel.avoid.slice(0, 2).map((a) => `- ${a}`).join("\n")}`
    );
  }

  if (intel.timingTips.length > 0) {
    const tip = intel.timingTips[0];
    sections.push(
      `TIMING TIP:\n- ${tip.activity}: ${tip.bestTime}${tip.tip ? `. ${tip.tip}` : ""}${tip.avoidTime ? `. Avoid: ${tip.avoidTime}` : ""}`
    );
  }

  if (intel.localTransport) {
    sections.push(`LOCAL TRANSPORT: ${intel.localTransport}`);
  }

  if (intel.knowBeforeYouGo.length > 0) {
    sections.push(
      `KNOW BEFORE YOU GO:\n${intel.knowBeforeYouGo.slice(0, 3).map((k) => `- ${k}`).join("\n")}`
    );
  }

  if (intel.shopping.length > 0 && (profile === "balanced" || profile === "comfort")) {
    const shop = intel.shopping[0];
    sections.push(
      `SHOPPING: ${shop.what} at ${shop.where} (${shop.priceRange})${shop.tip ? `. ${shop.tip}` : ""}`
    );
  }

  return sections.join("\n\n");
}

// ── Main generate function ────────────────────────────────────────────────────

export async function generateItineraryNarrative(
  ctx: ItineraryContext
): Promise<LLMResponse> {
  const client = getGroqClient();
  const systemPrompt = ctx.isDestinationMode
    ? DESTINATION_SYSTEM_PROMPT
    : DISCOVERY_SYSTEM_PROMPT;

  // Build local intelligence section if available
  const localIntelSection =
    ctx.localIntelligence
      ? `\n\nLOCAL INTELLIGENCE (use these specific details in your narrative and day plan):\n${formatLocalIntelligence(ctx.localIntelligence, ctx.profile)}`
      : "";

  const destinationModeNote = ctx.isDestinationMode
    ? `\nThe user specifically chose ${ctx.destination} — they know they want to go here. Be their local expert.`
    : "";

  const userPrompt = `Here is the structured data for a ${ctx.profile} trip to ${ctx.destination}, ${ctx.state}:${destinationModeNote}

DESTINATION: ${ctx.destination} — "${ctx.tagline}"
TRANSPORT: ${ctx.transportMode}${ctx.trainName ? ` (${ctx.trainName})` : ""}
  Departs: ${ctx.departure ?? "flexible"} → Arrives: ${ctx.arrival ?? "varies"}${ctx.overnight ? " (overnight — saves a hotel night, arrive fresh in the morning)" : ""}
  First mile: ${ctx.firstMile}
  Last mile: ${ctx.lastMile}
  Round-trip cost: ₹${ctx.transportCostRoundtrip.toLocaleString("en-IN")}${ctx.trainClass ? ` (${ctx.trainClass})` : ""}

STAY: ${ctx.nights} night(s) in ${ctx.accommodationType} — ₹${ctx.accommodationCost.toLocaleString("en-IN")} total
FOOD: ₹${ctx.foodBudget.toLocaleString("en-IN")} for the trip
ACTIVITIES: ₹${ctx.activitiesBudget.toLocaleString("en-IN")} budget
TOTAL: ₹${ctx.totalSpent.toLocaleString("en-IN")} of ₹${ctx.totalBudget.toLocaleString("en-IN")} (${ctx.utilizationPct}% used)

TOP THINGS TO DO:
${ctx.mustDo.map((a, i) => `${i + 1}. ${a}`).join("\n")}
${localIntelSection}
${ctx.tradeoffNote ? `\nTRADEOFF INSIGHT: ${ctx.tradeoffNote}` : ""}

Now write:

1. NARRATIVE (under ${ctx.isDestinationMode ? "100" : "90"} words): ${ctx.isDestinationMode
    ? "You are the local expert for this destination. Reference specific places from the local intelligence. Tell them the one thing most visitors miss. Sound like a friend who has been here 5 times."
    : "Enthusiastic, honest description of why this trip works for someone from a Tier 2 city. Mention the journey, the vibe, one specific highlight from the local intelligence if provided. Don't repeat budget numbers."
  }

2. DAY_PLAN: A day-by-day plan as a JSON array. Each item under ${ctx.isDestinationMode ? "30" : "25"} words. ${ctx.nights + 1} days total. ${ctx.isDestinationMode ? "Include specific place names, timing tips, and at least one hidden gem from the local intelligence." : "Include specific highlights."} Format: ["Day 1: ...", "Day 2: ...", ...]

3. TRADEOFFS: ${ctx.isDestinationMode
    ? `A JSON array of 2-3 tips. For the ${ctx.profile} profile: what does this budget ENABLE and what does it SACRIFICE at ${ctx.destination}? Be specific to this destination.`
    : `Format the tradeoff insight as a JSON array of 1-2 short punchy tips (under 25 words each). Honest about what this profile gives up vs other options.`
  }

Respond in this exact JSON format:
{
  "narrative": "...",
  "dayPlan": ["Day 1: ...", "Day 2: ..."],
  "tradeoffs": ["...", "..."]
}`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: ctx.isDestinationMode ? 0.8 : 0.7,
    max_tokens: ctx.isDestinationMode ? 800 : 650,
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
    narrative:
      parsed.narrative ??
      `${ctx.destination} is a great ${ctx.profile}-budget pick from here. Worth every rupee.`,
    dayPlan: parsed.dayPlan ?? [
      `Day 1: Arrive and explore. Day ${ctx.nights + 1}: Return home.`,
    ],
    tradeoffs: parsed.tradeoffs ?? [
      "Prices verified at time of planning \u2014 confirm on IRCTC/RedBus before booking.",
    ],
    provider: "groq",
  };
}

// ── Batch generation ──────────────────────────────────────────────────────────

export async function generateAllNarratives(
  contexts: ItineraryContext[]
): Promise<LLMResponse[]> {
  const results = await Promise.allSettled(
    contexts.map((ctx) => generateItineraryNarrative(ctx))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`Narrative generation failed for context ${i}:`, result.reason);
    return {
      narrative: `${contexts[i].destination} \u2014 ${contexts[i].profile} trip within your \u20b9${contexts[i].totalBudget.toLocaleString("en-IN")} budget.`,
      dayPlan: [
        `Day 1: Arrive & explore. Day ${contexts[i].nights + 1}: Return home.`,
      ],
      tradeoffs: ["Prices estimated \u2014 verify on IRCTC/RedBus before booking."],
      provider: "groq" as const,
    };
  });
}
