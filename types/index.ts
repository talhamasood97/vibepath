// ── Core input/output types ───────────────────────────────────────────────────

export type Vibe =
  | "mountains"
  | "beach"
  | "historical"
  | "adventure"
  | "spiritual"
  | "relaxing"
  | "city";

export interface TripInput {
  origin: string;        // NSE city name e.g. "Kanpur"
  budget: number;        // total trip budget in INR per person
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  vibe: Vibe;
  travelers: number;     // default 1
}

// ── Transport types ───────────────────────────────────────────────────────────

export type TransportMode = "train" | "bus" | "flight";
export type TrainClass = "sleeper" | "3ac" | "2ac";

export interface TrainRoute {
  trainName: string;
  trainNumber: string;
  departure: string;       // "22:15"
  arrival: string;         // "06:45"
  durationHours: number;
  overnight: boolean;
  price: {
    sleeper: number;
    ac3: number;
    ac2: number;
  };
  frequency: string;       // "Daily" | "Mon,Wed,Fri"
  note?: string;           // e.g. "Friday trains often sold out — book 2 weeks ahead"
}

export interface BusRoute {
  operatorType: string;    // "UPSRTC" | "Private Volvo"
  price: { min: number; max: number };
  durationHours: number;
  frequency: string;
  note?: string;
}

export interface TransportOption {
  mode: TransportMode;
  train?: TrainRoute;
  bus?: BusRoute;
  firstMile: string;       // "Auto/Ola to Kanpur Central (~₹80, 20 min)"
  lastMile: string;        // "Shared taxi to Rishikesh (~₹120, 45 min)"
  totalCostPerPerson: {
    budget: number;        // cheapest class
    midrange: number;
    comfort: number;
  };
}

// ── Destination types ─────────────────────────────────────────────────────────

export interface Destination {
  name: string;
  state: string;
  tagline: string;
  vibes: Vibe[];
  bestMonths: number[];    // 1-12
  distanceKm: number;
  typicalStayNights: number;
  accommodation: {
    hostel: { min: number; max: number };
    budget: { min: number; max: number };
    midrange: { min: number; max: number };
  };
  food: {
    dailyBudget: number;   // per person per day
    dailyMidrange: number;
  };
  mustDo: string[];        // top 3-5 activities
  avgActivityCost: number; // per person total for a typical trip
}

// ── Budget types ──────────────────────────────────────────────────────────────

export type BudgetProfile = "value" | "balanced" | "comfort";

export interface BudgetAllocation {
  profile: BudgetProfile;
  totalBudget: number;
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  buffer: number;
  utilizationPct: number;
  trainClass: TrainClass;
  accommodationType: "hostel" | "budget" | "midrange";
  tradeoffNote?: string;   // e.g. "Friday train saves ₹300 vs Saturday"
}

// ── Itinerary types ───────────────────────────────────────────────────────────

export interface StructuredItinerary {
  profile: BudgetProfile;
  destination: Destination;
  transport: TransportOption;
  allocation: BudgetAllocation;
  nights: number;
  headline: string;        // e.g. "Budget Rishikesh — ₹6,800 total"
  activities: string[];
}

export interface GeneratedItinerary extends StructuredItinerary {
  narrative: string;       // LLM-generated story (no prices in here — those come from structured data)
  dayPlan: string;         // LLM-generated day-by-day
  tradeoffs: string[];     // LLM-formatted from structured tradeoffs
}

// ── API types ─────────────────────────────────────────────────────────────────

export interface GenerateRequest extends TripInput {}

export interface GenerateResponse {
  itineraries: GeneratedItinerary[];
  origin: string;
  generatedAt: string;
  provider: "groq" | "fallback";
}

export interface GenerateError {
  error: string;
  code: "MISSING_KEY" | "RATE_LIMIT" | "INVALID_INPUT" | "NO_ROUTES" | "LLM_ERROR";
}
