/**
 * Itinerary Builder — orchestration layer.
 *
 * Two modes:
 *   DISCOVERY MODE: User chose a vibe → match + score destinations → 3 cards
 *   DESTINATION MODE: User chose a specific destination → skip matcher → deep local plan
 *
 * Pipeline (discovery):
 *   TripInput → matchDestinations → getTransportOptions → allocateAllProfiles
 *             → buildStructured → injectLocalIntelligence → generateNarratives → merge
 *
 * Pipeline (destination override):
 *   TripInput.destinationOverride → findDestination → getTransportOptions
 *             → allocateAllProfiles (all 3 for same dest) → injectLocalIntelligence
 *             → generateNarratives (destination mode prompt) → merge
 */

import type {
  TripInput,
  StructuredItinerary,
  GeneratedItinerary,
  Destination,
  TransportOption,
  TravelerType,
} from "@/types";
import { matchDestinations, findDestinationByName } from "./destination-matcher";
import { getTransportOptions } from "./transport-data";
import { allocateAllProfiles } from "./budget-allocator";
import { generateAllNarratives, type ItineraryContext } from "./groq-client";
import { getLocalIntelligence } from "./local-intelligence";
import { getLiveAlert } from "./gemini-validator";

function calcNights(startDate: string, endDate: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

// Returns true if a train with this frequency string runs on the given date.
// Prevents recommending a Mon/Wed/Fri-only train for a Saturday departure.
function trainRunsOnDate(frequency: string, dateStr: string): boolean {
  if (frequency === "Daily") return true;
  const dayOfWeek = new Date(dateStr).getDay(); // 0=Sun,1=Mon,...,6=Sat
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return frequency
    .split(",")
    .map((d) => dayMap[d.trim()])
    .filter((d) => d !== undefined)
    .includes(dayOfWeek);
}

// Generates a monsoon/seasonal warning for mountain/hill-station destinations
// in Jun–Sep. Shown in the card as an amber caution badge.
function getMonsoonWarning(dest: Destination, startDate: string): string | undefined {
  const month = new Date(startDate).getMonth() + 1; // 1-12
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

function buildHeadline(
  profile: string,
  destination: Destination,
  totalSpent: number
): string {
  const profileLabel: Record<string, string> = {
    value: "Budget",
    balanced: "Balanced",
    comfort: "Comfort",
  };
  return `${profileLabel[profile]} ${destination.name} \u2014 \u20b9${totalSpent.toLocaleString("en-IN")} total`;
}

function pickBestTransport(
  options: TransportOption[],
  profile: string,
  startDate?: string
): TransportOption | null {
  if (options.length === 0) return null;

  // Filter out trains that don't run on the departure date — prevents "ghost train" bookings
  const validOptions = startDate
    ? options.filter((o) =>
        o.train ? trainRunsOnDate(o.train.frequency, startDate) : true
      )
    : options;

  // Fall back to all options if the date filter eliminated everything
  const pool = validOptions.length > 0 ? validOptions : options;

  if (profile === "value") {
    const overnight = pool.find((o) => o.train?.overnight);
    if (overnight) return overnight;
    return [...pool].sort(
      (a, b) => a.totalCostPerPerson.budget - b.totalCostPerPerson.budget
    )[0];
  }
  if (profile === "comfort") {
    return [...pool].sort(
      (a, b) => b.totalCostPerPerson.comfort - a.totalCostPerPerson.comfort
    )[0];
  }
  // balanced: prefer train, then bus
  return pool.find((o) => o.mode === "train") ?? pool[0];
}

// ── DISCOVERY MODE ────────────────────────────────────────────────────────────

async function buildDiscoveryItineraries(
  input: TripInput
): Promise<GeneratedItinerary[]> {
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

  // Fill remaining slots with best destination and unused profiles
  while (pairs.length < 3 && destinations.length > 0) {
    const dest = destinations[0];
    const usedProfiles = pairs
      .filter((p) => p.dest.name === dest.name)
      .map((p) => p.profile);
    const nextProfile = profiles.find((p) => !usedProfiles.includes(p));
    if (nextProfile) {
      pairs.push({ dest, profile: nextProfile });
    } else {
      break;
    }
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
      profile,
      destination: dest,
      transport,
      allocation,
      nights,
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

// ── DESTINATION MODE ──────────────────────────────────────────────────────────

async function buildDestinationItineraries(
  input: TripInput,
  destinationName: string
): Promise<GeneratedItinerary[]> {
  const nights = calcNights(input.startDate, input.endDate);

  const dest = findDestinationByName(destinationName);
  if (!dest) {
    throw new Error(
      `${destinationName} is not yet in Musafir\u2019s catalog. ` +
        `Try using vibe-based search to discover great alternatives, or check back soon \u2014 we add destinations weekly.`
    );
  }

  const transportOptions = getTransportOptions(input.origin, dest.name);
  if (transportOptions.length === 0) {
    throw new Error(
      `No direct transport found from ${input.origin} to ${dest.name}. ` +
        `Try a different origin city or use vibe-based search.`
    );
  }

  // In destination mode: 3 cards = 3 profiles for the SAME destination
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
      profile,
      destination: dest,
      transport,
      allocation,
      nights,
      headline: buildHeadline(profile, dest, totalSpent),
      activities: dest.mustDo.slice(0, 5), // more mustDos in destination mode
    });
  }

  if (structured.length === 0) {
    throw new Error(
      `Budget too tight for ${dest.name}. ` +
        `Try \u20b9${Math.ceil(input.budget * 1.4).toLocaleString("en-IN")} or more.`
    );
  }

  return buildAndGenerateNarratives(structured, input, true);
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
      profile: s.profile,
      destination: s.destination.name,
      state: s.destination.state,
      tagline: s.destination.tagline,
      transportMode: s.transport.mode,
      trainName: s.transport.train?.trainName,
      departure: s.transport.train?.departure,
      arrival: s.transport.train?.arrival,
      overnight: s.transport.train?.overnight,
      firstMile: s.transport.firstMile,
      lastMile: s.transport.lastMile,
      transportCostRoundtrip: s.allocation.transport,
      trainClass: s.allocation.trainClass,
      nights: s.nights,
      accommodationType: s.allocation.accommodationType,
      accommodationCost: s.allocation.accommodation,
      foodBudget: s.allocation.food,
      activitiesBudget: s.allocation.activities,
      totalSpent,
      totalBudget: input.budget,
      utilizationPct: s.allocation.utilizationPct,
      mustDo: s.destination.mustDo,
      tradeoffNote: s.allocation.tradeoffNote,
      localIntelligence,
      isDestinationMode,
      travelerType: input.travelerType as TravelerType | undefined,
      monsoonWarning,
    };
  });

  // Build a deduplicated set of destinations to query Gemini once per destination
  // (discovery mode has 3 different destinations; destination mode has 1)
  const uniqueDestNames = [...new Set(structured.map((s) => s.destination.name))];

  // Run Groq narratives AND Gemini live-alert checks in parallel.
  // Gemini failure (timeout, missing key, API error) is always silent.
  const [narratives, alertMap] = await Promise.all([
    generateAllNarratives(contexts),
    (async () => {
      const map = new Map<string, import("@/types").LiveAlert | null>();
      await Promise.all(
        uniqueDestNames.map(async (destName) => {
          const s = structured.find((x) => x.destination.name === destName)!;
          const alert = await getLiveAlert(
            destName,
            s.destination.state,
            input.startDate
          );
          map.set(destName, alert);
        })
      );
      return map;
    })(),
  ]);

  return structured.map((s, i) => {
    const monsoonWarning = getMonsoonWarning(s.destination, input.startDate);
    const liveAlert = alertMap.get(s.destination.name) ?? undefined;
    return {
      ...s,
      narrative: narratives[i]?.narrative ?? "",
      dayPlan: narratives[i]?.dayPlan?.join("\n") ?? "",
      tradeoffs: narratives[i]?.tradeoffs ?? [],
      monsoonWarning,
      liveAlert: liveAlert ?? undefined,
    };
  });
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function buildItineraries(
  input: TripInput
): Promise<GeneratedItinerary[]> {
  if (input.destinationOverride && input.destinationOverride.trim()) {
    return buildDestinationItineraries(input, input.destinationOverride.trim());
  }
  return buildDiscoveryItineraries(input);
}
