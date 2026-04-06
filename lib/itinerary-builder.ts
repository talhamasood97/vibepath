/**
 * Itinerary Builder \u2014 orchestration layer.
 *
 * Three modes:
 *   DISCOVERY MODE     \u2014 User chose a vibe \u2192 match + score destinations \u2192 3 cards
 *   DESTINATION MODE   \u2014 User chose a known destination \u2192 skip matcher \u2192 deep local plan
 *   LLM-ONLY MODE      \u2014 User typed a destination not in catalog \u2192 Groq estimates everything
 *
 * Pipeline (discovery):
 *   TripInput \u2192 matchDestinations \u2192 getTransportOptions \u2192 allocateAllProfiles
 *             \u2192 buildStructured \u2192 injectLocalIntelligence \u2192 generateNarratives \u2192 merge
 *
 * Pipeline (destination override \u2014 known):
 *   TripInput.destinationOverride \u2192 findDestination \u2192 getTransportOptions
 *             \u2192 allocateAllProfiles (all 3 for same dest) \u2192 injectLocalIntelligence
 *             \u2192 generateNarratives (destination mode prompt) \u2192 merge
 *
 * Pipeline (LLM-only \u2014 unknown destination):
 *   TripInput.destinationOverride \u2192 [not found in catalog] \u2192 generateAllLLMOnly (3 profiles)
 *             \u2192 Gemini live alert check \u2192 assemble GeneratedItinerary with isAIEstimated=true
 */

import type {
  TripInput,
  StructuredItinerary,
  GeneratedItinerary,
  Destination,
  TransportOption,
  TravelerType,
  BudgetAllocation,
  TrainClass,
  DestinationAlternative,
} from "@/types";
import { matchDestinations, findDestinationByName, findAlternativesForOrigin } from "./destination-matcher";
import { getTransportOptions } from "./transport-data";
import { allocateAllProfiles } from "./budget-allocator";
import {
  generateAllNarratives,
  generateAllLLMOnly,
  validateDestinationForTravel,
  type ItineraryContext,
  type LLMOnlyContext,
  type LLMOnlyBudgetEstimate,
} from "./groq-client";
import { getLocalIntelligence } from "./local-intelligence";
import { getLiveAlert } from "./gemini-validator";

// ── Quality gate error ────────────────────────────────────────────────────────
// Thrown when a destination is not in the curated catalogue.
// Carries alternative suggestions so the API can return them to the client.

export class DestinationNotCuratedError extends Error {
  alternatives: DestinationAlternative[];
  requestedDestination: string;

  constructor(requestedDest: string, alternatives: Destination[]) {
    super(
      `\u201c${requestedDest}\u201d isn\u2019t in our verified destination network yet. ` +
      `We only create itineraries for destinations with real, curated data \u2014 no generic plans ever.`
    );
    this.name = "DestinationNotCuratedError";
    this.requestedDestination = requestedDest;
    this.alternatives = alternatives.map((d): DestinationAlternative => ({
      name: d.name,
      state: d.state,
      tagline: d.tagline,
      primaryVibe: d.primaryVibe,
      discovery: d.discovery,
    }));
  }
}

function calcNights(startDate: string, endDate: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

function trainRunsOnDate(frequency: string, dateStr: string): boolean {
  if (frequency === "Daily") return true;
  const dayOfWeek = new Date(dateStr).getDay();
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return frequency
    .split(",")
    .map((d) => dayMap[d.trim()])
    .filter((d) => d !== undefined)
    .includes(dayOfWeek);
}

function getMonsoonWarning(dest: Destination, startDate: string): string | undefined {
  const month = new Date(startDate).getMonth() + 1;
  if (month < 6 || month > 9) return undefined;

  const heavyMonsoonStates = ["Uttarakhand", "Himachal Pradesh", "Goa", "Kerala", "Sikkim"];
  if (!heavyMonsoonStates.includes(dest.state)) return undefined;

  if (dest.primaryVibe === "mountains" || dest.primaryVibe === "adventure") {
    return `Active monsoon season (Jun\u2013Sep) in ${dest.state}. Landslide alerts and road closures are common \u2014 check NHAI / local news before travel.`;
  }
  if (dest.primaryVibe === "beach") {
    return `Monsoon season (Jun\u2013Sep) in ${dest.state}. Beaches may be rough and water sports suspended. Great for offseason rates but plan for rain.`;
  }
  return undefined;
}

function buildHeadline(profile: string, destination: Destination, totalSpent: number): string {
  const profileLabel: Record<string, string> = {
    value: "Budget", balanced: "Balanced", comfort: "Comfort",
  };
  return `${profileLabel[profile]} ${destination.name} \u2014 \u20b9${totalSpent.toLocaleString("en-IN")} total`;
}

function pickBestTransport(
  options: TransportOption[],
  profile: string,
  startDate?: string
): TransportOption | null {
  if (options.length === 0) return null;

  const validOptions = startDate
    ? options.filter((o) =>
        o.train ? trainRunsOnDate(o.train.frequency, startDate) : true
      )
    : options;

  const pool = validOptions.length > 0 ? validOptions : options;

  if (profile === "value") {
    const overnight = pool.find((o) => o.train?.overnight);
    if (overnight) return overnight;
    return [...pool].sort((a, b) => a.totalCostPerPerson.budget - b.totalCostPerPerson.budget)[0];
  }
  if (profile === "comfort") {
    return [...pool].sort((a, b) => b.totalCostPerPerson.comfort - a.totalCostPerPerson.comfort)[0];
  }
  return pool.find((o) => o.mode === "train") ?? pool[0];
}

// ── DISCOVERY MODE ────────────────────────────────────────────────────────────

async function buildDiscoveryItineraries(input: TripInput): Promise<GeneratedItinerary[]> {
  const nights = calcNights(input.startDate, input.endDate);
  const destinations = matchDestinations(input);

  if (destinations.length === 0) {
    throw new Error(
      `No routes found from ${input.origin} matching your vibe and budget. ` +
        `Try increasing budget to \u20b9${Math.round(input.budget * 1.3).toLocaleString("en-IN")} or choose a different vibe.`
    );
  }

  const structured: StructuredItinerary[] = [];
  const profiles = ["value", "balanced", "comfort"] as const;
  type Pair = { dest: Destination; profile: (typeof profiles)[number] };
  const pairs: Pair[] = [];

  for (let i = 0; i < Math.min(destinations.length, 3); i++) {
    pairs.push({ dest: destinations[i], profile: profiles[i] });
  }

  while (pairs.length < 3 && destinations.length > 0) {
    const dest = destinations[0];
    const usedProfiles = pairs.filter((p) => p.dest.name === dest.name).map((p) => p.profile);
    const nextProfile = profiles.find((p) => !usedProfiles.includes(p));
    if (nextProfile) pairs.push({ dest, profile: nextProfile });
    else break;
  }

  for (const { dest, profile } of pairs) {
    const transportOptions = getTransportOptions(input.origin, dest.name);
    if (transportOptions.length === 0) continue;
    const transport = pickBestTransport(transportOptions, profile, input.startDate);
    if (!transport) continue;

    const allocations = allocateAllProfiles(dest, transport, input.budget, nights, input.startDate);
    const allocation = allocations.find((a) => a.profile === profile) ?? allocations[0];
    if (!allocation) continue;

    const totalSpent =
      allocation.transport + allocation.accommodation + allocation.food + allocation.activities;
    structured.push({
      profile, destination: dest, transport, allocation, nights,
      headline: buildHeadline(profile, dest, totalSpent),
      activities: dest.mustDo.slice(0, 4),
    });
  }

  if (structured.length === 0) {
    throw new Error(
      `Budget too tight for available routes from ${input.origin}. ` +
        `Minimum recommended: \u20b9${Math.ceil(input.budget * 1.4).toLocaleString("en-IN")}.`
    );
  }

  return buildAndGenerateNarratives(structured, input, false);
}

// ── DESTINATION MODE (known catalog) ─────────────────────────────────────────

async function buildDestinationItineraries(
  input: TripInput,
  destinationName: string
): Promise<GeneratedItinerary[]> {
  const nights = calcNights(input.startDate, input.endDate);
  const dest = findDestinationByName(destinationName);

  // Unknown destination → quality gate: never serve generic/LLM-only itineraries.
  // Find curated alternatives reachable from origin and surface them to the user instead.
  if (!dest) {
    const alternatives = findAlternativesForOrigin(input.origin, input.startDate, 3);
    throw new DestinationNotCuratedError(destinationName, alternatives);
  }

  const transportOptions = getTransportOptions(input.origin, dest.name);
  if (transportOptions.length === 0) {
    throw new Error(
      `No direct transport found from ${input.origin} to ${dest.name}. ` +
        `Try a different origin city or use vibe-based search.`
    );
  }

  const profiles = ["value", "balanced", "comfort"] as const;
  const structured: StructuredItinerary[] = [];

  for (const profile of profiles) {
    const transport = pickBestTransport(transportOptions, profile, input.startDate);
    if (!transport) continue;

    const allocations = allocateAllProfiles(dest, transport, input.budget, nights, input.startDate);
    const allocation = allocations.find((a) => a.profile === profile) ?? allocations[0];
    if (!allocation) continue;

    const totalSpent =
      allocation.transport + allocation.accommodation + allocation.food + allocation.activities;
    structured.push({
      profile, destination: dest, transport, allocation, nights,
      headline: buildHeadline(profile, dest, totalSpent),
      activities: dest.mustDo.slice(0, 5),
    });
  }

  if (structured.length === 0) {
    throw new Error(
      `Budget too tight for ${dest.name}. Try \u20b9${Math.ceil(input.budget * 1.4).toLocaleString("en-IN")} or more.`
    );
  }

  return buildAndGenerateNarratives(structured, input, true);
}

// ── LLM-ONLY MODE (unknown destination) ──────────────────────────────────────

async function buildLLMOnlyItineraries(
  input: TripInput,
  destinationName: string
): Promise<GeneratedItinerary[]> {
  // Validate before burning 3 Groq calls on a non-destination
  const validation = await validateDestinationForTravel(destinationName, input.origin);

  if (!validation.isValid) {
    throw new Error(
      `"${destinationName}" doesn\u2019t appear to be a travel destination${validation.reason ? ` \u2014 ${validation.reason}` : ""}. ` +
      `Try destinations like Manali, Hampi, Gokarna, Coorg, or use vibe-based search to discover places.`
    );
  }

  // Use the canonical name going forward (corrects capitalisation + typos)
  const canonicalName = validation.canonicalName || destinationName;

  const nights = calcNights(input.startDate, input.endDate);
  const profiles = ["value", "balanced", "comfort"] as const;

  const contexts: LLMOnlyContext[] = profiles.map((profile) => ({
    profile,
    destination: canonicalName,
    origin: input.origin,
    budget: input.budget,
    nights,
    travelerType: input.travelerType as TravelerType | undefined,
    startDate: input.startDate,
    destinationType: validation.destinationType,
    state: validation.state,
  }));

  // Groq (3 profiles) + Gemini live alert check run in parallel
  const [llmResults, liveAlert] = await Promise.all([
    generateAllLLMOnly(contexts),
    getLiveAlert(canonicalName, validation.state, input.startDate),
  ]);

  return profiles.map((profile, i): GeneratedItinerary => {
    const llm = llmResults[i];
    const be: LLMOnlyBudgetEstimate = llm.budgetEstimate;

    // Synthetic destination for type compatibility
    const synthDest: Destination = {
      name: canonicalName,
      state: be.state || validation.state,
      tagline: llm.narrative.split(".")[0]?.trim() ?? destinationName,
      vibes: ["relaxing"],
      primaryVibe: "relaxing",
      vibeStrength: {},
      discovery: "offbeat",
      bestMonths: [10, 11, 12, 1, 2, 3],
      distanceKm: 0,
      typicalStayNights: nights,
      accommodation: {
        hostel:   { min: Math.round(be.accommodationPerNight * 0.65), max: Math.round(be.accommodationPerNight * 0.85) },
        budget:   { min: Math.round(be.accommodationPerNight * 0.85), max: Math.round(be.accommodationPerNight * 1.15) },
        midrange: { min: Math.round(be.accommodationPerNight * 1.15), max: Math.round(be.accommodationPerNight * 1.6) },
      },
      food: {
        dailyBudget:   be.foodPerDay,
        dailyMidrange: Math.round(be.foodPerDay * 1.8),
      },
      mustDo: [],
      avgActivityCost: be.activitiesBudget,
    };

    const accomType: "hostel" | "budget" | "midrange" =
      profile === "value" ? "hostel" : profile === "comfort" ? "midrange" : "budget";

    const trainClass: TrainClass =
      profile === "value" ? "sleeper" : profile === "comfort" ? "2ac" : "3ac";

    const synthTransport: TransportOption = {
      mode: "train",
      firstMile: `From ${input.origin} station`,
      lastMile: `To ${destinationName} centre`,
      totalCostPerPerson: {
        budget:   Math.round(be.transportCostRoundtrip / 2),
        midrange: Math.round(be.transportCostRoundtrip / 2 * 1.3),
        comfort:  Math.round(be.transportCostRoundtrip / 2 * 1.8),
      },
    };

    const accTotal  = be.accommodationPerNight * nights;
    const foodTotal = be.foodPerDay * (nights + 1);
    const totalSpent = be.transportCostRoundtrip + accTotal + foodTotal + be.activitiesBudget;

    const synthAllocation: BudgetAllocation = {
      profile,
      totalBudget:       input.budget,
      transport:         Math.round(be.transportCostRoundtrip / 100) * 100,
      accommodation:     Math.round(accTotal / 100) * 100,
      food:              Math.round(foodTotal / 100) * 100,
      activities:        Math.round(be.activitiesBudget / 100) * 100,
      buffer:            Math.max(0, input.budget - totalSpent),
      utilizationPct:    be.utilizationPct,
      trainClass,
      accommodationType: accomType,
      tradeoffNote:      be.transportDescription,
    };

    const headline = `${profile === "value" ? "Budget" : profile === "comfort" ? "Comfort" : "Balanced"} ${canonicalName} \u2014 ~\u20b9${Math.round(totalSpent).toLocaleString("en-IN")} total`;

    return {
      profile,
      destination:    synthDest,
      transport:      synthTransport,
      allocation:     synthAllocation,
      nights,
      headline,
      activities:     [],
      narrative:      llm.narrative,
      dayPlan:        llm.dayPlan.join("\n"),
      detailedDays:   llm.detailedDays,
      tradeoffs:      llm.tradeoffs,
      localIntelligence: null,
      isAIEstimated:  true,
      liveAlert:      liveAlert ?? undefined,
    };
  });
}

// ── Shared: build contexts + generate narratives ──────────────────────────────

async function buildAndGenerateNarratives(
  structured: StructuredItinerary[],
  input: TripInput,
  isDestinationMode: boolean
): Promise<GeneratedItinerary[]> {
  const contexts: ItineraryContext[] = structured.map((s) => {
    const totalSpent =
      s.allocation.transport + s.allocation.accommodation + s.allocation.food + s.allocation.activities;
    const localIntelligence = getLocalIntelligence(s.destination.name);
    const monsoonWarning = getMonsoonWarning(s.destination, input.startDate);

    return {
      profile:              s.profile,
      destination:          s.destination.name,
      state:                s.destination.state,
      tagline:              s.destination.tagline,
      transportMode:        s.transport.mode,
      trainName:            s.transport.train?.trainName,
      departure:            s.transport.train?.departure,
      arrival:              s.transport.train?.arrival,
      overnight:            s.transport.train?.overnight,
      firstMile:            s.transport.firstMile,
      lastMile:             s.transport.lastMile,
      transportCostRoundtrip: s.allocation.transport,
      trainClass:           s.allocation.trainClass,
      nights:               s.nights,
      accommodationType:    s.allocation.accommodationType,
      accommodationCost:    s.allocation.accommodation,
      foodBudget:           s.allocation.food,
      activitiesBudget:     s.allocation.activities,
      totalSpent,
      totalBudget:          input.budget,
      utilizationPct:       s.allocation.utilizationPct,
      mustDo:               s.destination.mustDo,
      tradeoffNote:         s.allocation.tradeoffNote,
      localIntelligence,
      isDestinationMode,
      travelerType:         input.travelerType as TravelerType | undefined,
      monsoonWarning,
    };
  });

  const uniqueDestNames = [...new Set(structured.map((s) => s.destination.name))];

  const [narratives, alertMap] = await Promise.all([
    generateAllNarratives(contexts),
    (async () => {
      const map = new Map<string, import("@/types").LiveAlert | null>();
      await Promise.all(
        uniqueDestNames.map(async (destName) => {
          const s = structured.find((x) => x.destination.name === destName)!;
          const alert = await getLiveAlert(destName, s.destination.state, input.startDate);
          map.set(destName, alert);
        })
      );
      return map;
    })(),
  ]);

  return structured.map((s, i): GeneratedItinerary => {
    const monsoonWarning = getMonsoonWarning(s.destination, input.startDate);
    const liveAlert      = alertMap.get(s.destination.name) ?? undefined;
    const localIntelligence = getLocalIntelligence(s.destination.name);

    return {
      ...s,
      narrative:      narratives[i]?.narrative ?? "",
      dayPlan:        narratives[i]?.dayPlan?.join("\n") ?? "",
      detailedDays:   narratives[i]?.detailedDays ?? [],
      tradeoffs:      narratives[i]?.tradeoffs ?? [],
      monsoonWarning,
      liveAlert:      liveAlert ?? undefined,
      localIntelligence,
      isAIEstimated:  false,
    };
  });
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function buildItineraries(input: TripInput): Promise<GeneratedItinerary[]> {
  if (input.destinationOverride && input.destinationOverride.trim()) {
    return buildDestinationItineraries(input, input.destinationOverride.trim());
  }
  return buildDiscoveryItineraries(input);
}
