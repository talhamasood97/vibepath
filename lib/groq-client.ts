/**
 * Groq LLM client \u2014 Musafir persona with local intelligence injection.
 *
 * Two generation modes:
 *   STRUCTURED MODE  \u2014 static transport + budget data provided; LLM writes narrative + rich days only
 *   LLM-ONLY MODE    \u2014 destination not in catalog; LLM estimates transport, budget, AND writes the plan
 *
 * GOVERNANCE rules applied:
 * - ENV VARS FAIL LOUD: throws immediately if GROQ_API_KEY is missing
 * - STRUCTURED GENERATION: in structured mode, LLM never generates prices/train names
 * - LOCAL INTELLIGENCE: curated destination data injected for hyper-specific narrative
 * - DESTINATION MODE: separate system prompt for "I know where I\u2019m going" searches
 * - LLM-ONLY ESTIMATION: for unknown destinations, all estimates labelled \u007e AI-estimated
 */

import Groq from "groq-sdk";
import type { LocalIntelligence, TravelerType, DetailedDay } from "@/types";

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

export interface LLMResponse {
  narrative: string;
  dayPlan: string[];        // compact one-liner per day (card view)
  detailedDays: DetailedDay[];
  tradeoffs: string[];
  provider: "groq";
}

// LLM-only mode adds budget estimate fields
export interface LLMOnlyBudgetEstimate {
  state: string;
  nearestStation: string;
  transportDescription: string;
  transportCostRoundtrip: number;
  accommodationType: string;
  accommodationPerNight: number;
  foodPerDay: number;
  activitiesBudget: number;
  totalSpent: number;
  utilizationPct: number;
}

export interface LLMOnlyResponse extends LLMResponse {
  budgetEstimate: LLMOnlyBudgetEstimate;
}

// ── Discovery mode system prompt ──────────────────────────────────────────────

const DISCOVERY_SYSTEM_PROMPT = `You are Musafir \u2014 a well-travelled friend from a Tier 2 Indian city who gives honest,
enthusiastic travel advice. You talk like a smart dost, not a corporate travel agent or tourism brochure.

CRITICAL RULES:
1. DO NOT change any prices, train names, timings, or distances from the structured data given to you.
2. DO NOT invent new facts, hotels, restaurants, or attractions not explicitly provided in the data.
3. STRICTLY \u2014 do not mention any landmark, restaurant, activity, or attraction not listed in TOP THINGS TO DO or LOCAL INTELLIGENCE. If unsure, stick to general descriptions.
4. All entry prices in the data are INDIAN NATIONAL rates. Do not substitute or mention foreign national prices.
5. Write like a friend who has actually BEEN there. Reference the specific local intelligence given.
6. DO NOT use formal language. Use "you should", "don\u2019t miss", "go for it", "bilkul worth it".
7. Keep narrative under 90 words. Each day plan compact line under 20 words.
8. Use English naturally with occasional desi phrases (dost, scene hai, bilkul, bhai, yaar) where they fit.
9. The tradeoffs should be honest \u2014 tell them what this profile GIVES UP vs other options too.
10. For detailedDays: each section (morning/afternoon/evening) should be 50-70 words with specific place names, timings, food spots, and insider tips from the LOCAL INTELLIGENCE provided.`;

// ── Destination mode system prompt ───────────────────────────────────────────

const DESTINATION_SYSTEM_PROMPT = `You are Musafir \u2014 a seasoned traveller who has been to this destination multiple times.
The user already knows WHERE they\u2019re going. They need YOUR local expertise on HOW to make it perfect.

CRITICAL RULES:
1. DO NOT change any prices, train names, timings from the structured data given to you.
2. STRICTLY \u2014 do not mention any landmark, restaurant, activity, or attraction not listed in TOP THINGS TO DO or LOCAL INTELLIGENCE. If unsure, stick to general descriptions.
3. All entry prices in the data are INDIAN NATIONAL rates.
4. Use the LOCAL INTELLIGENCE data to give hyper-specific recommendations with actual place names, timing tips, and hidden gems.
5. Be the friend who says "skip the overpriced place near the tourist gate, walk 5 mins to THIS spot".
6. Write like you lived there for 6 months. Specific, opinionated, honest.
7. Keep narrative under 100 words. Each day plan compact line under 20 words.
8. Mix English with natural desi phrases. Sound warm, not formal.
9. The tradeoffs should compare what each profile experience FEELS like, not just the budget difference.
10. For detailedDays: each section (morning/afternoon/evening) must name specific spots, timings, and food from the LOCAL INTELLIGENCE. Minimum 60 words per section. Include hidden gems and timing warnings.`;

// ── LLM-only mode system prompt ───────────────────────────────────────────────

const LLM_ONLY_SYSTEM_PROMPT = `You are Musafir \u2014 a well-travelled Indian who has explored destinations all over the country.
You are being asked to plan a trip to a destination NOT in your verified database, so you must ESTIMATE costs based on your knowledge.

CRITICAL RULES:
1. Be honest that these are estimates \u2014 use phrases like "typically around", "expect roughly", "usually costs".
2. Base transport estimates on real Indian rail/bus costs for similar distances/routes (2025 prices).
3. Base accommodation on realistic Indian hotel prices for the destination type and region.
4. Base food on realistic Indian meal costs \u2014 budget dhaba meals \u20b9150-250/day, midrange restaurants \u20b9400-700/day.
5. DO NOT make up specific train names or numbers \u2014 use descriptions like "express trains on this route" or "overnight trains available via X junction".
6. For detailedDays: give genuinely useful advice about real places at this destination.
7. Each day section (morning/afternoon/evening) should be 50-70 words with specific recommendations.
8. Sound like a friend who\u2019s been there, not a Wikipedia article.
9. Be specific about food: name actual local dishes or well-known eateries you know about.
10. Include at least one hidden gem or insider tip per day.`;

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
  localIntelligence?: LocalIntelligence | null;
  isDestinationMode?: boolean;
  travelerType?: TravelerType;
  monsoonWarning?: string;
}

export interface LLMOnlyContext {
  profile: string;
  destination: string;
  origin: string;
  budget: number;
  nights: number;
  travelerType?: TravelerType;
  startDate: string;
}

// ── Local intelligence formatter ──────────────────────────────────────────────

function formatLocalIntelligence(intel: LocalIntelligence, profile: string): string {
  const sections: string[] = [];

  if (intel.mustEat.length > 0) {
    const topFood = intel.mustEat.slice(0, profile === "comfort" ? 4 : 3);
    sections.push(
      `MUST EAT:\n${topFood.map((f) => `- ${f.name} (${f.area}): ${f.knownFor ?? "local favourite"} \u2014 ${f.price}${f.tip ? `. TIP: ${f.tip}` : ""}`).join("\n")}`
    );
  }

  if (intel.streetFood.length > 0) {
    const sf = intel.streetFood.slice(0, profile === "comfort" ? 2 : 3);
    sections.push(
      `STREET FOOD:\n${sf.map((f) => `- ${f.name} at ${f.area} (${f.price})${f.tip ? ". " + f.tip : ""}`).join("\n")}`
    );
  }

  if (intel.hiddenGems.length > 0) {
    const gems = intel.hiddenGems.slice(0, 2);
    sections.push(
      `HIDDEN GEMS:\n${gems.map((g) => `- ${g.name}: ${g.what}. ${g.why}${g.bestTime ? ` Best time: ${g.bestTime}` : ""}`).join("\n")}`
    );
  }

  if (intel.avoid.length > 0) {
    sections.push(
      `HONEST WARNINGS (tourist traps to avoid):\n${intel.avoid.map((a) => `- ${a}`).join("\n")}`
    );
  }

  if (intel.timingTips.length > 0) {
    sections.push(
      `TIMING TIPS:\n${intel.timingTips.map((t) => `- ${t.activity}: best at ${t.bestTime}${t.tip ? `. ${t.tip}` : ""}${t.avoidTime ? `. Avoid: ${t.avoidTime}` : ""}`).join("\n")}`
    );
  }

  if (intel.localTransport) {
    sections.push(`LOCAL TRANSPORT: ${intel.localTransport}`);
  }

  if (intel.knowBeforeYouGo.length > 0) {
    sections.push(
      `KNOW BEFORE YOU GO:\n${intel.knowBeforeYouGo.map((k) => `- ${k}`).join("\n")}`
    );
  }

  if (intel.shopping.length > 0) {
    const shops = intel.shopping.slice(0, profile === "comfort" ? 3 : 2);
    sections.push(
      `SHOPPING:\n${shops.map((s) => `- ${s.what} at ${s.where} (${s.priceRange})${s.tip ? `. ${s.tip}` : ""}`).join("\n")}`
    );
  }

  if (intel.stayAreas && intel.stayAreas.length > 0) {
    const area =
      intel.stayAreas.find((a) =>
        profile === "comfort"
          ? a.bestFor.includes("comfort") || a.bestFor.includes("mid")
          : profile === "value"
          ? a.bestFor.includes("budget") || a.bestFor.includes("hostel")
          : true
      ) ?? intel.stayAreas[0];
    sections.push(`BEST STAY AREA: ${area.area} \u2014 ${area.why}`);
  }

  return sections.join("\n\n");
}

// ── JSON schema for a single DetailedDay ─────────────────────────────────────

const DETAIL_DAY_SCHEMA = `{
  "day": <number>,
  "theme": "<Day theme in 4-6 words>",
  "morning": "<50-70 words: what to do from arrival/morning, specific place names + timings>",
  "afternoon": "<50-70 words: main sightseeing + where to eat lunch (name the place)>",
  "evening": "<50-70 words: evening program, sunset spot if applicable, dinner recommendation>",
  "eat": "<named food spots for the day with prices>",
  "hiddenGem": "<one insider tip or off-beat spot for this day>",
  "tip": "<one logistic/timing tip specific to this day>"
}`;

function buildDayPlanInstruction(nights: number, isDestinationMode: boolean): string {
  return `3. DETAILED_DAYS: A JSON array of ${nights + 1} day objects. Each MUST follow this schema:
${DETAIL_DAY_SCHEMA}
Day 1 = arrival day. Day ${nights + 1} = departure day (morning activity, check out, head back).
${isDestinationMode ? "Name SPECIFIC places from LOCAL INTELLIGENCE in morning/afternoon/evening." : "Reference LOCAL INTELLIGENCE highlights in each day\u2019s sections."}
Each morning/afternoon/evening MUST be 50-70 words minimum. Be specific \u2014 no filler.`;
}

// ── Structured mode: main generate function ───────────────────────────────────

export async function generateItineraryNarrative(
  ctx: ItineraryContext
): Promise<LLMResponse> {
  const client = getGroqClient();
  const systemPrompt = ctx.isDestinationMode
    ? DESTINATION_SYSTEM_PROMPT
    : DISCOVERY_SYSTEM_PROMPT;

  const localIntelSection = ctx.localIntelligence
    ? `\n\nLOCAL INTELLIGENCE (use these specific details in narrative and every day plan section):\n${formatLocalIntelligence(ctx.localIntelligence, ctx.profile)}`
    : "";

  const destinationModeNote = ctx.isDestinationMode
    ? `\nThe user specifically chose ${ctx.destination} \u2014 they know they want to go here. Be their local expert.`
    : "";

  const travelerNote = ctx.travelerType
    ? (() => {
        const notes: Record<TravelerType, string> = {
          "solo-female": "TRAVELER: Solo female. Prioritise well-lit central stays, female-friendly hostels, safe evening timings. Mention specific safety tips.",
          "solo-male":   "TRAVELER: Solo male. Emphasis on budget-stretching, meeting travellers, street food trails, independent exploration.",
          "couple":      "TRAVELER: Couple. Highlight romantic stays, scenic spots, quiet cafes, experiences better shared.",
          "friends":     "TRAVELER: Friends group. Emphasise shared hostel experience, group activities, nightlife or late-night street food.",
          "family":      "TRAVELER: Family with kids/elders. Prioritise comfort, early check-ins, child/elder-friendly activities. Avoid long treks.",
        };
        return `\n${notes[ctx.travelerType]}`;
      })()
    : "";

  const monsoonNote = ctx.monsoonWarning
    ? `\nSEASONAL NOTE: ${ctx.monsoonWarning} Acknowledge naturally in narrative \u2014 honest but not alarmist.`
    : "";

  const userPrompt = `Here is the structured data for a ${ctx.profile} trip to ${ctx.destination}, ${ctx.state}:${destinationModeNote}${travelerNote}${monsoonNote}

DESTINATION: ${ctx.destination} \u2014 "${ctx.tagline}"
TRANSPORT: ${ctx.transportMode}${ctx.trainName ? ` (${ctx.trainName})` : ""}
  Departs: ${ctx.departure ?? "flexible"} \u2192 Arrives: ${ctx.arrival ?? "varies"}${ctx.overnight ? " (overnight \u2014 saves a hotel night, arrive fresh in the morning)" : ""}
  First mile: ${ctx.firstMile}
  Last mile: ${ctx.lastMile}
  Round-trip cost: \u20b9${ctx.transportCostRoundtrip.toLocaleString("en-IN")}${ctx.trainClass ? ` (${ctx.trainClass})` : ""}

STAY: ${ctx.nights} night(s) in ${ctx.accommodationType} \u2014 \u20b9${ctx.accommodationCost.toLocaleString("en-IN")} total
FOOD: \u20b9${ctx.foodBudget.toLocaleString("en-IN")} for the trip
ACTIVITIES: \u20b9${ctx.activitiesBudget.toLocaleString("en-IN")} budget
TOTAL: \u20b9${ctx.totalSpent.toLocaleString("en-IN")} of \u20b9${ctx.totalBudget.toLocaleString("en-IN")} (${ctx.utilizationPct}% used)

TOP THINGS TO DO:
${ctx.mustDo.map((a, i) => `${i + 1}. ${a}`).join("\n")}
${localIntelSection}
${ctx.tradeoffNote ? `\nTRADEOFF INSIGHT: ${ctx.tradeoffNote}` : ""}

Now write:

1. NARRATIVE (under ${ctx.isDestinationMode ? "100" : "90"} words): ${ctx.isDestinationMode
    ? "You are the local expert. Reference specific places from local intelligence. Tell them the one thing most visitors miss. Sound like a friend who\u2019s been here 5 times."
    : "Enthusiastic, honest description of why this trip works for someone from a Tier 2 city. Mention the journey, the vibe, one specific highlight from local intelligence if provided."
  }

2. DAY_PLAN: Compact summary as a JSON array. One short line per day (under 20 words). ${ctx.nights + 1} days total. Format: ["Day 1: ...", "Day 2: ...", ...]

${buildDayPlanInstruction(ctx.nights, ctx.isDestinationMode ?? false)}

4. TRADEOFFS: ${ctx.isDestinationMode
    ? `A JSON array of 2-3 tips. For the ${ctx.profile} profile: what does this budget ENABLE and SACRIFICE at ${ctx.destination}? Be specific.`
    : `A JSON array of 1-2 short punchy tips (under 25 words each). Honest about what this profile gives up.`
  }

Respond in this EXACT JSON format (no extra keys, no markdown):
{
  "narrative": "...",
  "dayPlan": ["Day 1: ...", "Day 2: ..."],
  "detailedDays": [${Array.from({length: ctx.nights + 1}, (_, i) => `{"day": ${i+1}, ...}`).join(", ")}],
  "tradeoffs": ["...", "..."]
}`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: ctx.isDestinationMode ? 0.8 : 0.7,
    max_tokens: 2200,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  return parseStructuredResponse(raw, ctx.destination, ctx.nights, ctx.profile);
}

// ── LLM-only mode: estimate + generate for unknown destinations ───────────────

export async function generateLLMOnlyItinerary(
  ctx: LLMOnlyContext
): Promise<LLMOnlyResponse> {
  const client = getGroqClient();

  const profileConfig: Record<string, { accomType: string; transportClass: string; budgetLabel: string }> = {
    value:    { accomType: "hostel or budget guesthouse",   transportClass: "Sleeper class train or cheapest bus", budgetLabel: "budget-stretch" },
    balanced: { accomType: "budget hotel (clean, central)", transportClass: "3AC train or semi-sleeper bus",       budgetLabel: "best-value" },
    comfort:  { accomType: "midrange hotel (AC, good area)",transportClass: "2AC train or AC Volvo bus",           budgetLabel: "comfortable" },
  };
  const pl = profileConfig[ctx.profile] ?? profileConfig.balanced;

  const travelerNote = ctx.travelerType
    ? (() => {
        const notes: Record<TravelerType, string> = {
          "solo-female": "TRAVELER: Solo female. Prioritise safe, well-lit, central stays. Add safety tips.",
          "solo-male":   "TRAVELER: Solo male. Emphasise budget-stretching and local exploration.",
          "couple":      "TRAVELER: Couple. Highlight romantic, scenic, quiet experiences.",
          "friends":     "TRAVELER: Friends group. Emphasise shared experiences, group activities.",
          "family":      "TRAVELER: Family. Prioritise comfort, accessibility, avoid long treks.",
        };
        return `\n${notes[ctx.travelerType]}`;
      })()
    : "";

  const userPrompt = `Plan a ${ctx.profile} (${pl.budgetLabel}) trip from ${ctx.origin} to ${ctx.destination} for ${ctx.nights} nights.
Total per-person budget: \u20b9${ctx.budget.toLocaleString("en-IN")}.
Travel dates starting: ${ctx.startDate}.
Transport preference: ${pl.transportClass}.
Stay preference: ${pl.accomType}.${travelerNote}

This destination is NOT in our verified database \u2014 estimate all costs from your knowledge of Indian travel (2025 prices).

Respond ONLY with this exact JSON (no markdown, no extra keys):
{
  "budgetEstimate": {
    "state": "<state/UT where ${ctx.destination} is located>",
    "nearestStation": "<nearest major railway station>",
    "transportDescription": "<describe how to get from ${ctx.origin} to ${ctx.destination} \u2014 trains/buses, journey time, options>",
    "transportCostRoundtrip": <round-trip per-person INR for ${pl.transportClass}>,
    "accommodationType": "<hostel|budget hotel|midrange hotel>",
    "accommodationPerNight": <per-night INR for ${pl.accomType}>,
    "foodPerDay": <daily food INR for ${ctx.profile} traveler>,
    "activitiesBudget": <total activities INR for full trip>,
    "totalSpent": <transport + accommodation*${ctx.nights} + food*${ctx.nights + 1} + activities>,
    "utilizationPct": <round(totalSpent / ${ctx.budget} * 100)>
  },
  "narrative": "<90-100 words: honest, enthusiastic pitch for this trip at ${ctx.profile} budget>",
  "dayPlan": ${JSON.stringify(Array.from({length: ctx.nights + 1}, (_, i) => `Day ${i+1}: <20-word summary>`))},
  "detailedDays": [
    ${Array.from({length: ctx.nights + 1}, (_, i) => `{
      "day": ${i + 1},
      "theme": "<theme for day ${i + 1}>",
      "morning": "<50-70 words: specific morning activities with real place names + timings>",
      "afternoon": "<50-70 words: afternoon sightseeing + named lunch spot + dish recommendations>",
      "evening": "<50-70 words: evening program, named dinner spot or street food area>",
      "eat": "<specific food recs with prices for day ${i + 1}>",
      "hiddenGem": "<insider tip or off-beat spot for day ${i + 1}>",
      "tip": "<logistic or timing tip for day ${i + 1}>"
    }`).join(",\n    ")}
  ],
  "tradeoffs": ["<2-3 short honest tips about the ${ctx.profile} profile for ${ctx.destination}>"]
}`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: LLM_ONLY_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.75,
    max_tokens: 2800,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const base = parseStructuredResponse(raw, ctx.destination, ctx.nights, ctx.profile);

  const be = (parsed.budgetEstimate as Record<string, unknown>) ?? {};
  const accPerNight = typeof be.accommodationPerNight === "number" ? be.accommodationPerNight : 800;
  const foodPerDay  = typeof be.foodPerDay === "number" ? be.foodPerDay : 300;
  const transport   = typeof be.transportCostRoundtrip === "number" ? be.transportCostRoundtrip : Math.round(ctx.budget * 0.30);
  const activities  = typeof be.activitiesBudget === "number" ? be.activitiesBudget : Math.round(ctx.budget * 0.10);
  const totalSpent  = transport + accPerNight * ctx.nights + foodPerDay * (ctx.nights + 1) + activities;

  const budgetEstimate: LLMOnlyBudgetEstimate = {
    state:                  typeof be.state === "string" ? be.state : "India",
    nearestStation:         typeof be.nearestStation === "string" ? be.nearestStation : ctx.destination,
    transportDescription:   typeof be.transportDescription === "string" ? be.transportDescription : "Check IRCTC for trains",
    transportCostRoundtrip: transport,
    accommodationType:      typeof be.accommodationType === "string" ? be.accommodationType : pl.accomType.split(" ")[0],
    accommodationPerNight:  accPerNight,
    foodPerDay,
    activitiesBudget:       activities,
    totalSpent:             Math.min(totalSpent, ctx.budget),
    utilizationPct:         Math.min(Math.round(totalSpent / ctx.budget * 100), 100),
  };

  return { ...base, budgetEstimate, provider: "groq" };
}

// ── Shared response parser ────────────────────────────────────────────────────

function parseStructuredResponse(
  raw: string,
  destination: string,
  nights: number,
  profile: string
): LLMResponse {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const narrative =
    typeof parsed.narrative === "string" && parsed.narrative.trim().length > 0
      ? parsed.narrative.trim()
      : `${destination} is a great ${profile}-budget pick. Worth every rupee.`;

  const dayPlan =
    Array.isArray(parsed.dayPlan) && (parsed.dayPlan as unknown[]).every((d) => typeof d === "string")
      ? (parsed.dayPlan as string[])
      : [`Day 1: Arrive and explore ${destination}.`, `Day ${nights + 1}: Return home.`];

  const detailedDays: DetailedDay[] = (() => {
    if (!Array.isArray(parsed.detailedDays)) return buildFallbackDays(destination, nights);
    return (parsed.detailedDays as unknown[]).map((d, i): DetailedDay => {
      const day = (d as Record<string, unknown>) ?? {};
      return {
        day:       typeof day.day === "number" ? day.day : i + 1,
        theme:     typeof day.theme === "string" ? day.theme : `Day ${i + 1}`,
        morning:   typeof day.morning === "string" ? day.morning : `Explore ${destination} in the morning.`,
        afternoon: typeof day.afternoon === "string" ? day.afternoon : "Visit the main attractions.",
        evening:   typeof day.evening === "string" ? day.evening : "Evening walk and local dinner.",
        eat:       typeof day.eat === "string" ? day.eat : "Try local street food.",
        hiddenGem: typeof day.hiddenGem === "string" && day.hiddenGem.length > 5 ? day.hiddenGem : undefined,
        tip:       typeof day.tip === "string" && day.tip.length > 5 ? day.tip : undefined,
      };
    });
  })();

  const tradeoffs =
    Array.isArray(parsed.tradeoffs) && (parsed.tradeoffs as unknown[]).every((t) => typeof t === "string")
      ? (parsed.tradeoffs as string[])
      : ["Prices estimated \u2014 verify on IRCTC/RedBus before booking."];

  return { narrative, dayPlan, detailedDays, tradeoffs, provider: "groq" };
}

function buildFallbackDays(destination: string, nights: number): DetailedDay[] {
  return Array.from({ length: nights + 1 }, (_, i) => ({
    day: i + 1,
    theme: i === 0 ? "Arrival & First Impressions" : i === nights ? "Last Morning & Departure" : `Day ${i + 1} Exploration`,
    morning: i === 0
      ? `Arrive at ${destination}, check into your accommodation and freshen up. Take a leisurely walk around the area to get your bearings. Grab a chai from a local stall and soak in the atmosphere.`
      : `Start early to beat the crowds. Head to the main sights when the light is best and entry queues are short. Early mornings at most Indian heritage sites are genuinely magical.`,
    afternoon: i === nights
      ? `Enjoy a final local meal before checking out. Head to the station early \u2014 give yourself buffer time. Pick up any last-minute souvenirs from the market near the station.`
      : `Explore the main attractions. Have lunch at a local dhaba or popular restaurant near the central market area. Take a short rest during peak afternoon heat (1\u20133 PM).`,
    evening: i === nights
      ? `Board your train/bus home. Reflect on the trip \u2014 already planning the next one.`
      : `Evening stroll through the main bazaar. Try at least one street food item the locals recommend. The evenings here are the most atmospheric.`,
    eat: "Try local specialities at the market area. Ask your hotel or guesthouse owner for their personal favourite dhaba.",
    hiddenGem: i === 0 ? `Ask your accommodation owner or a local shopkeeper for their favourite off-the-beaten-path spot \u2014 it\u2019s often the best tip you\u2019ll get.` : undefined,
    tip: i === 0 ? "Arrive as early in the day as possible to maximise your first evening." : i === nights ? "Keep your bag light \u2014 leave some space for souvenirs you pick up on the way back." : undefined,
  }));
}

// ── Batch generation (structured mode) ───────────────────────────────────────

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
      dayPlan: [`Day 1: Arrive & explore. Day ${contexts[i].nights + 1}: Return home.`],
      detailedDays: buildFallbackDays(contexts[i].destination, contexts[i].nights),
      tradeoffs: ["Prices estimated \u2014 verify on IRCTC/RedBus before booking."],
      provider: "groq" as const,
    };
  });
}

// ── Batch LLM-only generation ─────────────────────────────────────────────────

export async function generateAllLLMOnly(
  contexts: LLMOnlyContext[]
): Promise<LLMOnlyResponse[]> {
  const results = await Promise.allSettled(
    contexts.map((ctx) => generateLLMOnlyItinerary(ctx))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`LLM-only generation failed for context ${i}:`, result.reason);
    const ctx = contexts[i];
    const fallbackSpend = Math.round(ctx.budget * 0.75);
    return {
      narrative: `${ctx.destination} \u2014 a ${ctx.profile} plan estimated within your \u20b9${ctx.budget.toLocaleString("en-IN")} budget.`,
      dayPlan: [`Day 1: Arrive in ${ctx.destination}. Day ${ctx.nights + 1}: Return home.`],
      detailedDays: buildFallbackDays(ctx.destination, ctx.nights),
      tradeoffs: ["All costs are AI-estimated \u2014 verify actual prices before booking."],
      provider: "groq" as const,
      budgetEstimate: {
        state: "India",
        nearestStation: ctx.destination,
        transportDescription: `Check IRCTC for trains from ${ctx.origin} to ${ctx.destination}`,
        transportCostRoundtrip: Math.round(ctx.budget * 0.30),
        accommodationType: ctx.profile === "comfort" ? "midrange hotel" : ctx.profile === "value" ? "hostel" : "budget hotel",
        accommodationPerNight: ctx.profile === "comfort" ? 2000 : ctx.profile === "value" ? 600 : 1200,
        foodPerDay: ctx.profile === "comfort" ? 600 : ctx.profile === "value" ? 250 : 400,
        activitiesBudget: Math.round(ctx.budget * 0.10),
        totalSpent: fallbackSpend,
        utilizationPct: 75,
      },
    };
  });
}
