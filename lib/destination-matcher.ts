/**
 * Destination matcher — maps (origin + vibe) to feasible destinations.
 *
 * Logic:
 * 1. Filter by vibe compatibility
 * 2. Filter by transport route existence (only destinations we have data for)
 * 3. Filter by budget feasibility (transport + min stay must fit in budget)
 * 4. Return top 3 matched destinations for 3 itinerary profiles
 */

import type { Destination, Vibe, TripInput } from "@/types";
import { TRAIN_ROUTES, BUS_ROUTES } from "./transport-data";

// ── Destination catalogue ─────────────────────────────────────────────────────

const DESTINATIONS: Destination[] = [
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    tagline: "Adventure capital of India — rafting, yoga, Himalayan vibes",
    vibes: ["adventure", "spiritual", "mountains", "relaxing"],
    bestMonths: [2, 3, 4, 9, 10, 11],
    distanceKm: 500,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 350, max: 700 },
      budget: { min: 700, max: 1400 },
      midrange: { min: 1400, max: 2800 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: ["White water rafting (₹600–1200)", "Bungee jumping (₹3,500)", "Lakshman Jhula walk", "Sunset on the Ghats", "Beatles Ashram visit"],
    avgActivityCost: 1200,
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    tagline: "The Taj, Agra Fort, and Mughal history in 24 hours",
    vibes: ["historical", "city"],
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 320,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3200 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: ["Taj Mahal sunrise (₹1,100 entry)", "Agra Fort (₹650 entry)", "Mehtab Bagh sunset view", "Kinari Bazaar walk", "Petha tasting"],
    avgActivityCost: 1800,
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Ganga Aarti, ancient ghats, and the soul of India",
    vibes: ["spiritual", "historical", "city"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 350,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 300, max: 700 },
      budget: { min: 700, max: 1500 },
      midrange: { min: 1500, max: 3000 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: ["Evening Ganga Aarti at Dashashwamedh Ghat", "Sunrise boat ride (₹200–500)", "Kashi Vishwanath Temple", "Sarnath day trip (₹20 auto)", "Litti chokha street food"],
    avgActivityCost: 800,
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Pink City — forts, palaces, and bazaars",
    vibes: ["historical", "city", "relaxing"],
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 420,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 900 },
      budget: { min: 900, max: 1800 },
      midrange: { min: 1800, max: 3500 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: ["Amber Fort + elephant ride", "Hawa Mahal", "Jantar Mantar (₹200 entry)", "Johri Bazaar shopping", "Dal baati churma thali"],
    avgActivityCost: 1500,
  },
  {
    name: "Mussoorie",
    state: "Uttarakhand",
    tagline: "Queen of Hills — colonial charm, pine forests, Himalayan views",
    vibes: ["mountains", "relaxing", "adventure"],
    bestMonths: [4, 5, 6, 9, 10],
    distanceKm: 550,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 2000 },
      midrange: { min: 2000, max: 4000 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: ["Mall Road walk", "Kempty Falls (₹50 entry)", "Camelback Road trek", "Gun Hill ropeway (₹150)", "Cloud End forest walk"],
    avgActivityCost: 600,
  },
  {
    name: "Nainital",
    state: "Uttarakhand",
    tagline: "Lake city in the Kumaon Hills — boating, malls, and mountain air",
    vibes: ["mountains", "relaxing", "adventure"],
    bestMonths: [3, 4, 5, 9, 10, 11],
    distanceKm: 480,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 450, max: 850 },
      budget: { min: 850, max: 1800 },
      midrange: { min: 1800, max: 3600 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: ["Naini Lake boating (₹200/hr)", "Snow View Point (₹100 ropeway)", "Naina Devi Temple", "Mall Road shopping", "Eco Cave Gardens (₹100)"],
    avgActivityCost: 700,
  },
  {
    name: "Delhi",
    state: "Delhi",
    tagline: "History, street food, and the chaos that makes you feel alive",
    vibes: ["historical", "city", "relaxing"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    distanceKm: 450,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 1000 },
      budget: { min: 1000, max: 2000 },
      midrange: { min: 2000, max: 4500 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: ["India Gate + Rajpath", "Qutub Minar (₹40)", "Humayun's Tomb (₹35)", "Chandni Chowk food crawl", "Lodhi Art District"],
    avgActivityCost: 500,
  },
  {
    name: "Haridwar",
    state: "Uttarakhand",
    tagline: "Ganga Aarti, Har Ki Pauri, and gateway to the Himalayas",
    vibes: ["spiritual", "relaxing", "mountains"],
    bestMonths: [2, 3, 4, 9, 10, 11],
    distanceKm: 480,
    typicalStayNights: 1,
    accommodation: {
      hostel: { min: 300, max: 600 },
      budget: { min: 600, max: 1200 },
      midrange: { min: 1200, max: 2400 },
    },
    food: { dailyBudget: 250, dailyMidrange: 500 },
    mustDo: ["Ganga Aarti at Har Ki Pauri", "Chandi Devi Temple (ropeway ₹169)", "Mansa Devi Temple", "Bharat Mata Mandir", "Rajaji National Park nearby"],
    avgActivityCost: 500,
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "Colonial hill station — Mall Road, toy train, and snow views",
    vibes: ["mountains", "relaxing", "historical"],
    bestMonths: [3, 4, 5, 10, 11, 12, 1],
    distanceKm: 700,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 500, max: 900 },
      budget: { min: 900, max: 2000 },
      midrange: { min: 2000, max: 4500 },
    },
    food: { dailyBudget: 350, dailyMidrange: 700 },
    mustDo: ["Mall Road walk", "Jakhu Temple + monkeys", "Christ Church", "Kufri day trip (₹500–800)", "Kalka-Shimla Toy Train (₹500)"],
    avgActivityCost: 900,
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Maximum city — Gateway of India, Bollywood, and the best street food",
    vibes: ["city", "beach", "relaxing"],
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 1300,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 600, max: 1200 },
      budget: { min: 1200, max: 2500 },
      midrange: { min: 2500, max: 5000 },
    },
    food: { dailyBudget: 400, dailyMidrange: 800 },
    mustDo: ["Gateway of India + Elephanta Caves", "Marine Drive at sunset", "Dharavi walk tour (₹700)", "Vada pav at Dadar", "Bandra-Worli Sea Link walk"],
    avgActivityCost: 1200,
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    tagline: "City of Joy — colonial grandeur, art, and unmatched street food",
    vibes: ["city", "historical", "relaxing"],
    bestMonths: [10, 11, 12, 1, 2],
    distanceKm: 900,
    typicalStayNights: 2,
    accommodation: {
      hostel: { min: 400, max: 800 },
      budget: { min: 800, max: 1600 },
      midrange: { min: 1600, max: 3200 },
    },
    food: { dailyBudget: 300, dailyMidrange: 600 },
    mustDo: ["Victoria Memorial (₹30)", "Howrah Bridge walk", "Kumartuli pottery studios", "Park Street food walk", "Marble Palace"],
    avgActivityCost: 500,
  },
];

// ── Route existence check ─────────────────────────────────────────────────────

function hasRoute(origin: string, destination: string): boolean {
  const key = `${origin.toUpperCase().replace(/\s+/g, "_")}_${destination
    .toUpperCase()
    .replace(/\s+/g, "_")}`;
  return key in TRAIN_ROUTES || key in BUS_ROUTES;
}

// ── Minimum trip cost estimate ────────────────────────────────────────────────

function estimateMinCost(
  origin: string,
  dest: Destination,
  nights: number
): number {
  const key = `${origin.toUpperCase().replace(/\s+/g, "_")}_${dest.name
    .toUpperCase()
    .replace(/\s+/g, "_")}`;

  // Cheapest train (sleeper one-way)
  const trains = TRAIN_ROUTES[key] ?? [];
  const cheapestTrain =
    trains.length > 0
      ? Math.min(
          ...trains
            .map((t) => t.price.sleeper || t.price.ac3)
            .filter((p) => p > 0)
        )
      : 999999;
  const cheapestBus = BUS_ROUTES[key]?.price.min ?? 999999;
  const transportOneWay = Math.min(cheapestTrain, cheapestBus);

  if (transportOneWay === 999999) return 999999; // no route

  const transport = transportOneWay * 2; // return
  const stay = dest.accommodation.hostel.min * nights;
  const food = dest.food.dailyBudget * (nights + 1);
  const activities = dest.avgActivityCost * 0.5; // bare minimum

  return transport + stay + food + activities;
}

// ── Main matcher ──────────────────────────────────────────────────────────────

export function matchDestinations(input: TripInput): Destination[] {
  const { origin, vibe, budget, startDate, endDate } = input;

  // Calculate trip nights
  const nights = Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const candidates = DESTINATIONS.filter((dest) => {
    // 1. Vibe match
    if (!dest.vibes.includes(vibe)) return false;

    // 2. Route exists
    if (!hasRoute(origin, dest.name)) return false;

    // 3. Budget feasibility (min cost must be ≤ 85% of budget, leaving room for 3 profiles)
    const minCost = estimateMinCost(origin, dest, nights);
    if (minCost > budget * 0.85) return false;

    return true;
  });

  // Sort by how well the budget fits (closest to 70-90% utilization preferred)
  candidates.sort((a, b) => {
    const costA = estimateMinCost(origin, a, nights);
    const costB = estimateMinCost(origin, b, nights);
    const utilizationA = costA / budget;
    const utilizationB = costB / budget;
    // Prefer destinations where budget is well-used (not too cheap, not too tight)
    const idealUtilization = 0.65;
    return (
      Math.abs(utilizationA - idealUtilization) -
      Math.abs(utilizationB - idealUtilization)
    );
  });

  return candidates.slice(0, 3);
}

export { DESTINATIONS };
