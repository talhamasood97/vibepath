/**
 * Itinerary Builder — the orchestration layer.
 *
 * Pipeline:
 *   TripInput
 *     → matchDestinations (vibe + origin + budget filter)
 *     → getTransportOptions (static route lookup)
 *     → allocateAllProfiles (3 budget profiles per destination)
 *     → build StructuredItinerary[] (1 per profile per destination, up to 3 total)
 *     → build ItineraryContext[] for LLM
 *
 * The LLM never sees this function. It only receives ItineraryContext objects.
 * The LLM cannot change prices, routes, or logistics — it only writes narrative.
 */

import type {
  TripInput,
  StructuredItinerary,
  GeneratedItinerary,
  Destination,
  TransportOption,
} from "@/types";
import { matchDestinations } from "./destination-matcher";
import { getTransportOptions } from "./transport-data";
import { allocateAllProfiles } from "./budget-allocator";
import { generateAllNarratives, type ItineraryContext } from "./groq-client";

function calcNights(startDate: string, endDate: string): number {
  return Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
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
  return `${profileLabel[profile]} ${destination.name} — ₹${totalSpent.toLocaleString("en-IN")} total`;
}

function pickBestTransport(
  options: TransportOption[],
  profile: string
): TransportOption | null {
  if (options.length === 0) return null;

  if (profile === "value") {
    // Prefer overnight train (saves accommodation) then cheapest
    const overnight = options.find((o) => o.train?.overnight);
    if (overnight) return overnight;
    return options.sort(
      (a, b) => a.totalCostPerPerson.budget - b.totalCostPerPerson.budget
    )[0];
  }
  if (profile === "comfort") {
    // Prefer most comfortable train
    return options.sort(
      (a, b) => b.totalCostPerPerson.comfort - a.totalCostPerPerson.comfort
    )[0];
  }
  // balanced: prefer 3AC train
  const train3AC = options.find((o) => o.mode === "train");
  return train3AC ?? options[0];
}

export async function buildItineraries(
  input: TripInput
): Promise<GeneratedItinerary[]> {
  const nights = calcNights(input.startDate, input.endDate);

  // Step 1: Match destinations
  const destinations = matchDestinations(input);
  if (destinations.length === 0) {
    throw new Error(
      `No routes found from ${input.origin} matching your vibe and budget. ` +
        `Try increasing budget to ₹${Math.round(input.budget * 1.3).toLocaleString("en-IN")} or choose a different vibe.`
    );
  }

  // Step 2: Build structured itineraries — always 3 cards
  // If fewer than 3 destinations match, reuse the best destination with different profiles
  const structured: StructuredItinerary[] = [];
  const profiles = ["value", "balanced", "comfort"] as const;

  // Build a (dest, profile) pair list — up to 3, filling gaps with best destination
  type Pair = { dest: Destination; profile: (typeof profiles)[number] };
  const pairs: Pair[] = [];

  for (let i = 0; i < Math.min(destinations.length, 3); i++) {
    pairs.push({ dest: destinations[i], profile: profiles[i] });
  }

  // Fill remaining slots using the best destination with unused profiles
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

    const transport = pickBestTransport(transportOptions, profile);
    if (!transport) continue;

    const allocations = allocateAllProfiles(
      dest,
      transport,
      input.budget,
      nights
    );
    const allocation = allocations.find((a) => a.profile === profile) ?? allocations[0];
    if (!allocation) continue;

    const totalSpent =
      allocation.transport +
      allocation.accommodation +
      allocation.food +
      allocation.activities;

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
        `Minimum recommended: ₹${Math.ceil(input.budget * 1.4).toLocaleString("en-IN")}.`
    );
  }

  // Step 3: Build LLM contexts
  const contexts: ItineraryContext[] = structured.map((s) => {
    const totalSpent =
      s.allocation.transport +
      s.allocation.accommodation +
      s.allocation.food +
      s.allocation.activities;

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
    };
  });

  // Step 4: Generate narratives in parallel
  const narratives = await generateAllNarratives(contexts);

  // Step 5: Merge structured + narrative
  return structured.map((s, i) => ({
    ...s,
    narrative: narratives[i]?.narrative ?? "",
    dayPlan: narratives[i]?.dayPlan?.join("\n") ?? "",
    tradeoffs: narratives[i]?.tradeoffs ?? [],
  }));
}
