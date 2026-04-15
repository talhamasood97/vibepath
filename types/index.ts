// ── Core input/output types ───────────────────────────────────────────────────

export type Vibe =
  | "mountains"
  | "beach"
  | "historical"
  | "adventure"
  | "spiritual"
  | "relaxing"
  | "city";

export type DiscoveryTag = "iconic" | "popular" | "offbeat" | "hidden-gem";

export type TravelerType = "solo-male" | "solo-female" | "couple" | "friends" | "family";

export interface TripInput {
  origin: string;              // city name e.g. "Kanpur"
  budget: number;              // total trip budget in INR per person
  startDate: string;           // ISO date string
  endDate: string;             // ISO date string
  vibe: Vibe;
  travelers: number;           // default 1
  travelerType?: TravelerType; // who's traveling — affects safety/stay recommendations
  destinationOverride?: string; // Rec 4: user already knows where they want to go
  recentlyShown?: string[];    // Rec 6: destination names shown in recent sessions
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
  note?: string;
}

export interface BusRoute {
  operatorType: string;
  price: { min: number; max: number };
  durationHours: number;
  frequency: string;
  note?: string;
}

export interface LastMileData {
  budget: string;   // cheapest option e.g. "Shared auto (₹40, 15 min)"
  comfort: string;  // comfortable option e.g. "Ola/cab (₹250, 15 min)"
  duration: string; // approx time e.g. "10–15 min"
}

export interface TransportOption {
  mode: TransportMode;
  train?: TrainRoute;
  bus?: BusRoute;
  firstMile: string;
  lastMile: string;
  lastMileData?: LastMileData;  // structured last-mile breakdown
  totalCostPerPerson: {
    budget: number;
    midrange: number;
    comfort: number;
  };
}

// ── Local Intelligence types ──────────────────────────────────────────────────

export interface LocalFood {
  name: string;
  area: string;
  knownFor?: string;
  price: string;
  tip?: string;
}

export interface LocalShopping {
  what: string;
  where: string;
  priceRange: string;
  tip?: string;
}

export interface LocalHiddenGem {
  name: string;
  what: string;
  why: string;
  bestTime?: string;
}

export interface LocalTiming {
  activity: string;
  bestTime: string;
  avoidTime?: string;
  tip?: string;
}

export interface LocalIntelligence {
  destination: string;
  mustEat: LocalFood[];
  streetFood: LocalFood[];
  shopping: LocalShopping[];
  hiddenGems: LocalHiddenGem[];
  avoid: string[];            // tourist traps / honest warnings
  timingTips: LocalTiming[];
  localTransport: string;     // how to get around locally
  knowBeforeYouGo: string[];  // packing / prep / entry rules
  stayAreas: { area: string; why: string; bestFor: string }[];
}

// ── POI seed list (anti-hallucination layer) ──────────────────────────────────
// Passed to Musafir as the definitive list of places — it may only narrate
// around named POIs in this list, never invent new ones.

export type PoiType =
  | "temple"
  | "monument"
  | "nature"
  | "market"
  | "food"
  | "viewpoint"
  | "museum"
  | "activity"
  | "neighbourhood"
  | "lake"
  | "ghat"
  | "fort";

export interface PoiItem {
  name: string;              // exact place name used in the narrative
  type: PoiType;
  bestTime: string;          // e.g. "6:00 AM", "5:30 PM", "anytime"
  durationHours: number;     // typical visit length
  entryFee?: number;         // INR for Indian nationals (0 = free)
  note?: string;             // one insider tip
}

// ── Destination types ─────────────────────────────────────────────────────────

export interface Destination {
  name: string;
  state: string;
  tagline: string;
  vibes: Vibe[];
  primaryVibe: Vibe;
  vibeStrength: Partial<Record<Vibe, number>>;  // 0-1 score per vibe
  discovery: DiscoveryTag;
  bestMonths: number[];        // 1-12
  distanceKm: number;
  typicalStayNights: number;
  accommodation: {
    hostel: { min: number; max: number };
    budget: { min: number; max: number };
    midrange: { min: number; max: number };
  };
  food: {
    dailyBudget: number;
    dailyMidrange: number;
  };
  mustDo: string[];
  avgActivityCost: number;
  pois?: PoiItem[];            // curated POI seed list — if present, LLM uses ONLY these
  lat?: number;                // coordinates for haversine distance calculation
  lng?: number;
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
  tradeoffNote?: string;
}

// ── Itinerary types ───────────────────────────────────────────────────────────

export interface StructuredItinerary {
  profile: BudgetProfile;
  destination: Destination;
  transport: TransportOption;
  allocation: BudgetAllocation;
  nights: number;
  headline: string;
  activities: string[];
}

export interface LiveAlert {
  text: string;
  source?: string;
}

// Extended Gemini response — superset of LiveAlert
// weatherNow + currentEvent injected into Groq context for richer narratives
export interface GeminiBriefing {
  alert?: string;      // safety alert sentence (maps to LiveAlert.text)
  source?: string;
  weatherNow?: string; // e.g. "Partly cloudy, 28–34°C" — injected into Groq prompt
  currentEvent?: string; // e.g. "Holi festival" or null
}

// Rich per-day structure used in the detail modal
export interface DetailedDay {
  day: number;
  theme: string;       // "Arrival & First Impressions"
  morning: string;     // activity + timing (50-70 words)
  afternoon: string;   // main sightseeing + lunch spot (50-70 words)
  evening: string;     // evening program + dinner (50-70 words)
  eat: string;         // specific food recs for the day (named places, price, tip)
  hiddenGem?: string;  // one off-beat spot or insider tip for this day
  tip?: string;        // logistic / timing tip specific to this day
}

export interface GeneratedItinerary extends StructuredItinerary {
  narrative: string;
  dayPlan: string;               // compact summary (card view)
  detailedDays: DetailedDay[];   // rich day-by-day (modal full view)
  tradeoffs: string[];
  monsoonWarning?: string;
  liveAlert?: LiveAlert;
  localIntelligence?: LocalIntelligence | null;  // passed through for modal display
  isAIEstimated?: boolean;       // true for destinations not in the static catalog
}

// ── API types ─────────────────────────────────────────────────────────────────

export interface GenerateRequest extends TripInput {}

export interface GenerateResponse {
  itineraries: GeneratedItinerary[];
  origin: string;
  generatedAt: string;
  provider: "groq" | "fallback";
  mode?: "discovery" | "destination";
}

// Slim destination shape used in alternative suggestions
export interface DestinationAlternative {
  name: string;
  state: string;
  tagline: string;
  primaryVibe: Vibe;
  discovery: DiscoveryTag;
}

export interface GenerateError {
  error: string;
  code: "MISSING_KEY" | "RATE_LIMIT" | "INVALID_INPUT" | "NO_ROUTES" | "LLM_ERROR" | "DESTINATION_NOT_CURATED";
  // Populated only when code === "DESTINATION_NOT_CURATED"
  alternatives?: DestinationAlternative[];
  requestedDestination?: string;
}
