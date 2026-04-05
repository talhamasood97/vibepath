/**
 * Budget Allocator — the Liquid Budget Engine.
 *
 * Treats budget as a trade-off space, not a hard filter.
 * Produces 3 allocation profiles for each destination:
 *   - value:    maximise budget stretch (sleeper class, hostel)
 *   - balanced: best mix of comfort and value (3AC, budget hotel)
 *   - comfort:  better stay/food quality (2AC, midrange hotel)
 *
 * Each profile also surfaces a concrete tradeoff note
 * (e.g. "overnight train saves ₹1,200 vs a day train + hotel night").
 */

import type {
  BudgetAllocation,
  BudgetProfile,
  Destination,
  TransportOption,
  TrainClass,
} from "@/types";

interface ProfileInput {
  profile: BudgetProfile;
  destination: Destination;
  transport: TransportOption;
  budget: number;
  nights: number;
  startDate?: string;  // used to apply weekend price buffer
}

// Weekend travel (Fri/Sat/Sun departures) inflates hotel prices ~20%
function isWeekendTravel(startDate: string): boolean {
  const day = new Date(startDate).getDay(); // 0=Sun,1=Mon,...,6=Sat
  return day === 5 || day === 6 || day === 0;
}

function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

function calcTransportCost(
  transport: TransportOption,
  profile: BudgetProfile
): { cost: number; trainClass: TrainClass } {
  const costMap = transport.totalCostPerPerson;
  let rawCost: number;
  let trainClass: TrainClass;

  if (profile === "value") {
    rawCost = costMap.budget;
    trainClass = "sleeper";
  } else if (profile === "balanced") {
    rawCost = costMap.midrange;
    trainClass = "3ac";
  } else {
    rawCost = costMap.comfort;
    trainClass = "2ac";
  }

  // Return trip × 2
  return { cost: rawCost * 2, trainClass };
}

function calcAccommodationCost(
  dest: Destination,
  profile: BudgetProfile,
  nights: number
): {
  cost: number;
  type: "hostel" | "budget" | "midrange";
  perNight: number;
} {
  let type: "hostel" | "budget" | "midrange";
  let perNight: number;

  if (profile === "value") {
    type = "hostel";
    perNight = Math.round(
      (dest.accommodation.hostel.min + dest.accommodation.hostel.max) / 2
    );
  } else if (profile === "balanced") {
    type = "budget";
    perNight = Math.round(
      (dest.accommodation.budget.min + dest.accommodation.budget.max) / 2
    );
  } else {
    type = "midrange";
    perNight = Math.round(
      (dest.accommodation.midrange.min + dest.accommodation.midrange.max) / 2
    );
  }

  return { cost: perNight * nights, type, perNight };
}

function calcFoodCost(
  dest: Destination,
  profile: BudgetProfile,
  nights: number
): number {
  const days = nights + 1;
  if (profile === "value") return dest.food.dailyBudget * days;
  if (profile === "balanced")
    return Math.round(
      (dest.food.dailyBudget + dest.food.dailyMidrange) / 2
    ) * days;
  return dest.food.dailyMidrange * days;
}

function buildTradeoffNote(
  transport: TransportOption,
  profile: BudgetProfile,
  accommodation: { perNight: number; type: string }
): string | undefined {
  const train = transport.train;
  if (!train) return undefined;

  if (profile === "value" && train.overnight) {
    const saveVsHotel = accommodation.perNight;
    return `Overnight train saves one night's accommodation (~₹${saveVsHotel.toLocaleString("en-IN")}) — arrive fresh in the morning.`;
  }
  if (profile === "balanced" && train.price.sleeper > 0) {
    const saving = train.price.ac3 - train.price.sleeper;
    if (saving > 150) {
      return `Switching to Sleeper class saves ₹${saving.toLocaleString("en-IN")} per leg — reallocate to a better hotel or activities.`;
    }
  }
  if (profile === "comfort" && train.price.ac3 > 0) {
    const upgrade = train.price.ac2 - train.price.ac3;
    return `2AC upgrade costs only ₹${upgrade.toLocaleString("en-IN")} more than 3AC for a significantly better experience on this route.`;
  }
  return undefined;
}

export function allocateBudget({
  profile,
  destination,
  transport,
  budget,
  nights,
  startDate,
}: ProfileInput): BudgetAllocation {
  const { cost: transportCost, trainClass } = calcTransportCost(
    transport,
    profile
  );
  const accommodationData = calcAccommodationCost(destination, profile, nights);

  // Apply 1.2x weekend buffer on accommodation — hotel prices genuinely spike Fri–Sun
  if (startDate && isWeekendTravel(startDate)) {
    accommodationData.cost = Math.round(accommodationData.cost * 1.2);
    accommodationData.perNight = Math.round(accommodationData.perNight * 1.2);
  }
  const foodCost = calcFoodCost(destination, profile, nights);

  // Activities: use what's left, capped at destination average
  const spent = transportCost + accommodationData.cost + foodCost;
  const remaining = budget - spent;
  const activityBudget = Math.max(
    0,
    Math.min(remaining - 500, destination.avgActivityCost) // keep ₹500 buffer
  );

  const buffer = Math.max(0, budget - spent - activityBudget);
  const totalSpent = transportCost + accommodationData.cost + foodCost + activityBudget;
  const utilizationPct = Math.round((totalSpent / budget) * 100);

  const tradeoffNote = buildTradeoffNote(transport, profile, accommodationData);

  return {
    profile,
    totalBudget: budget,
    transport: roundToHundred(transportCost),
    accommodation: roundToHundred(accommodationData.cost),
    food: roundToHundred(foodCost),
    activities: roundToHundred(activityBudget),
    buffer: roundToHundred(buffer),
    utilizationPct,
    trainClass,
    accommodationType: accommodationData.type,
    tradeoffNote,
  };
}

export function allocateAllProfiles(
  destination: Destination,
  transport: TransportOption,
  budget: number,
  nights: number,
  startDate?: string
): BudgetAllocation[] {
  const profiles: BudgetProfile[] = ["value", "balanced", "comfort"];
  return profiles
    .map((profile) =>
      allocateBudget({ profile, destination, transport, budget, nights, startDate })
    )
    .filter((a) => a.transport + a.accommodation + a.food < budget); // only feasible profiles
}
