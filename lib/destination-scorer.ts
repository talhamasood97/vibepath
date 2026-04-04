/**
 * Destination Scorer — 5-factor scoring engine.
 *
 * Replaces the simple "sort by budget utilization" with a proper ranking model:
 *
 *   Score = VibeDepth      × 0.30   — How deeply does this dest match the vibe?
 *         + TripFit        × 0.25   — Does it suit a weekend trip from this origin?
 *         + Freshness      × 0.20   — Discovery tag + anti-repetition penalty
 *         + RouteQuality   × 0.15   — Direct train, overnight bonus
 *         + SeasonalBoost  × 0.10   — Right place, right time of year
 *
 * All factors normalize to 0–1. Final score is 0–1.
 * Higher = recommended more strongly.
 *
 * GOVERNANCE: Pure math, no API calls. Zero cost. Deterministic.
 */

import type { Destination, Vibe, TransportOption } from "@/types";

// ── VibeDepth (0.30) ──────────────────────────────────────────────────────────
// Uses per-destination vibeStrength map rather than binary vibe match.
// Primary vibe match is weighted 1.0, secondary 0.5–0.8, off-vibe 0–0.2.

function vibeDepthScore(dest: Destination, vibe: Vibe): number {
  const strength = dest.vibeStrength[vibe];
  if (strength !== undefined) return Math.min(1, strength);
  // Not in vibeStrength map — check vibes array as fallback
  if (dest.vibes.includes(vibe)) return 0.5;
  return 0;
}

// ── TripFit (0.25) ────────────────────────────────────────────────────────────
// Ratio of usable destination time vs total travel time.
// Rewards nearby destinations for short trips.

function tripFitScore(
  travelDurationHours: number,
  tripNights: number
): number {
  const totalTripHours = tripNights * 24;
  const roundTripHours = travelDurationHours * 2;
  const atDestination = Math.max(0, totalTripHours - roundTripHours);

  if (totalTripHours <= 0) return 0.5;

  const ratio = atDestination / totalTripHours;
  // Ratio of 0.8+ (lots of time there) = 1.0 score
  // Ratio of 0.4 (half the trip is travel) = 0.4 score
  return Math.min(1, Math.max(0, ratio));
}

// ── Freshness (0.20) ──────────────────────────────────────────────────────────
// Combines discovery tag base score with localStorage-based anti-repetition.

const DISCOVERY_SCORES: Record<string, number> = {
  "hidden-gem": 0.95,
  offbeat: 0.80,
  popular: 0.50,
  iconic: 0.30,
};

function freshnessScore(
  dest: Destination,
  recentlyShown: string[]
): number {
  const base = DISCOVERY_SCORES[dest.discovery] ?? 0.50;

  // Penalty for recently shown destinations
  const idx = recentlyShown.indexOf(dest.name);
  let penalty = 0;
  if (idx === 0) penalty = 0.40;       // shown last search
  else if (idx === 1) penalty = 0.20;  // shown 2 searches ago
  else if (idx === 2) penalty = 0.10;  // shown 3 searches ago

  return Math.max(0, base - penalty);
}

// ── RouteQuality (0.15) ───────────────────────────────────────────────────────
// Direct train > one change > bus. Overnight bonus for weekend trips.

function routeQualityScore(transport: TransportOption | null): number {
  if (!transport) return 0;

  let score = 0.5; // default

  if (transport.mode === "train") {
    score = 0.9;
    // Overnight bonus: saves a hotel night — great for budget and time
    if (transport.train?.overnight) {
      score = Math.min(1.0, score + 0.1);
    }
  } else if (transport.mode === "bus") {
    score = 0.5;
  } else if (transport.mode === "flight") {
    score = 0.7;
  }

  return score;
}

// ── SeasonalBoost (0.10) ──────────────────────────────────────────────────────
// Boosts destinations in their ideal travel months.
// Uses Destination.bestMonths array.

function seasonalBoostScore(dest: Destination, currentMonth: number): number {
  if (dest.bestMonths.includes(currentMonth)) return 1.0;

  // Adjacent months get partial score
  const adj = [(currentMonth - 2 + 12) % 12 + 1, (currentMonth % 12) + 1];
  if (adj.some((m) => dest.bestMonths.includes(m))) return 0.6;

  return 0.2; // off-season
}

// ── Main scorer ───────────────────────────────────────────────────────────────

export interface ScoredDestination {
  destination: Destination;
  score: number;
  scores: {
    vibeDepth: number;
    tripFit: number;
    freshness: number;
    routeQuality: number;
    seasonal: number;
  };
}

export function scoreDestination(
  dest: Destination,
  vibe: Vibe,
  transport: TransportOption | null,
  tripNights: number,
  recentlyShown: string[],
  currentMonth: number
): ScoredDestination {
  const travelDuration = transport?.train?.durationHours
    ?? transport?.bus?.durationHours
    ?? 6; // fallback

  const vibeDepth   = vibeDepthScore(dest, vibe);
  const tripFit     = tripFitScore(travelDuration, tripNights);
  const freshness   = freshnessScore(dest, recentlyShown);
  const routeQuality = routeQualityScore(transport);
  const seasonal    = seasonalBoostScore(dest, currentMonth);

  const score =
    vibeDepth    * 0.30 +
    tripFit      * 0.25 +
    freshness    * 0.20 +
    routeQuality * 0.15 +
    seasonal     * 0.10;

  return {
    destination: dest,
    score,
    scores: { vibeDepth, tripFit, freshness, routeQuality, seasonal },
  };
}

// ── Diversity-aware top-3 selection ──────────────────────────────────────────
// After scoring, ensures the 3 cards come from at least 2 different states
// and at least 2 different discovery tiers. Avoids boring repetitive results.

export function selectDiverseTop3(
  scored: ScoredDestination[]
): ScoredDestination[] {
  if (scored.length <= 3) return scored;

  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const selected: ScoredDestination[] = [];

  // Always take the top scorer
  selected.push(sorted[0]);

  for (const candidate of sorted.slice(1)) {
    if (selected.length >= 3) break;

    const selectedStates = selected.map((s) => s.destination.state);
    const selectedDiscovery = selected.map((s) => s.destination.discovery);

    // Check diversity: if all selected are same state, require different state
    const allSameState = selectedStates.every((s) => s === selectedStates[0]);
    if (allSameState && selected.length === 2) {
      if (candidate.destination.state === selectedStates[0]) continue; // skip same state
    }

    // Prefer different discovery tier for variety
    const hasOffbeat = selectedDiscovery.some(
      (d) => d === "offbeat" || d === "hidden-gem"
    );
    if (selected.length === 2 && !hasOffbeat) {
      // Try to make 3rd card an offbeat/hidden-gem pick
      if (
        candidate.destination.discovery !== "offbeat" &&
        candidate.destination.discovery !== "hidden-gem"
      ) {
        // Check if there's a better diverse option later
        const offbeatOption = sorted.slice(sorted.indexOf(candidate) + 1).find(
          (s) =>
            s.destination.discovery === "offbeat" ||
            s.destination.discovery === "hidden-gem"
        );
        if (offbeatOption) continue; // skip for now, take offbeat option next round
      }
    }

    selected.push(candidate);
  }

  // If diversity filtering left us with < 3, fill remaining from sorted list
  if (selected.length < 3) {
    for (const candidate of sorted) {
      if (selected.length >= 3) break;
      if (!selected.find((s) => s.destination.name === candidate.destination.name)) {
        selected.push(candidate);
      }
    }
  }

  return selected;
}
