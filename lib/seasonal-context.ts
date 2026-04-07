/**
 * Seasonal context generator — injected into every Groq prompt.
 *
 * 100% static. Deterministic from destination + travel date.
 * Zero API calls, zero latency overhead.
 *
 * Gives Groq the timing intelligence it needs to schedule activities
 * correctly: exact sunrise, heat slots, crowd warnings, river advisories.
 */

const PLAINS_STATES = [
  "Uttar Pradesh", "Rajasthan", "Bihar", "Madhya Pradesh",
  "Haryana", "Punjab", "Delhi", "Jharkhand", "West Bengal",
];

const MOUNTAIN_STATES = [
  "Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Sikkim",
];

const HOT_SUMMER_DESTS = [
  "Agra", "Jaipur", "Varanasi", "Lucknow", "Mathura", "Vrindavan",
  "Ayodhya", "Prayagraj", "Kanpur", "Fatehpur Sikri", "Chitrakoot",
  "Jaisalmer", "Bikaner", "Jodhpur", "Ajmer", "Chittorgarh",
  "Alwar", "Bharatpur", "Mandawa", "Kurukshetra", "Deoghar",
];

const RAJASTHAN_DESTS = [
  "Jaipur", "Jaisalmer", "Bikaner", "Jodhpur", "Udaipur", "Ajmer",
  "Pushkar", "Chittorgarh", "Alwar", "Bharatpur", "Mandawa", "Ranakpur",
  "Mount Abu", "Bundi",
];

const SNOW_POSSIBLE_DESTS = [
  "Manali", "Kasol", "Bir Billing", "Chopta", "Auli", "McLeod Ganj",
  "Dalhousie", "Chail", "Vaishno Devi",
];

const RIVER_DESTS = ["Rishikesh", "Haridwar", "Varanasi", "Prayagraj", "Ayodhya"];

// ── Sunrise / Sunset approximation by latitude band + month ──────────────────

interface SunTimes { sunrise: string; sunset: string }

const SUN_TIMES: Record<number, { plains: SunTimes; mountain: SunTimes }> = {
  1:  { plains: { sunrise: "7:10 AM", sunset: "5:50 PM" }, mountain: { sunrise: "7:30 AM", sunset: "5:30 PM" } },
  2:  { plains: { sunrise: "6:50 AM", sunset: "6:10 PM" }, mountain: { sunrise: "7:05 AM", sunset: "5:55 PM" } },
  3:  { plains: { sunrise: "6:20 AM", sunset: "6:30 PM" }, mountain: { sunrise: "6:30 AM", sunset: "6:20 PM" } },
  4:  { plains: { sunrise: "5:55 AM", sunset: "6:50 PM" }, mountain: { sunrise: "6:05 AM", sunset: "6:40 PM" } },
  5:  { plains: { sunrise: "5:35 AM", sunset: "7:10 PM" }, mountain: { sunrise: "5:45 AM", sunset: "7:05 PM" } },
  6:  { plains: { sunrise: "5:30 AM", sunset: "7:20 PM" }, mountain: { sunrise: "5:35 AM", sunset: "7:15 PM" } },
  7:  { plains: { sunrise: "5:45 AM", sunset: "7:10 PM" }, mountain: { sunrise: "5:50 AM", sunset: "7:05 PM" } },
  8:  { plains: { sunrise: "6:00 AM", sunset: "6:50 PM" }, mountain: { sunrise: "6:05 AM", sunset: "6:45 PM" } },
  9:  { plains: { sunrise: "6:15 AM", sunset: "6:20 PM" }, mountain: { sunrise: "6:20 AM", sunset: "6:15 PM" } },
  10: { plains: { sunrise: "6:20 AM", sunset: "5:50 PM" }, mountain: { sunrise: "6:25 AM", sunset: "5:45 PM" } },
  11: { plains: { sunrise: "6:35 AM", sunset: "5:30 PM" }, mountain: { sunrise: "6:50 AM", sunset: "5:20 PM" } },
  12: { plains: { sunrise: "7:05 AM", sunset: "5:30 PM" }, mountain: { sunrise: "7:20 AM", sunset: "5:15 PM" } },
};

function getSunTimes(state: string, month: number): SunTimes {
  const band = MOUNTAIN_STATES.includes(state) ? "mountain" : "plains";
  return SUN_TIMES[month]?.[band] ?? { sunrise: "6:15 AM", sunset: "6:30 PM" };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function getSeasonalContext(
  destName: string,
  state: string,
  startDate: string
): string {
  const month = new Date(startDate).getMonth() + 1; // 1–12
  const monthName = new Date(startDate).toLocaleString("en-IN", { month: "long" });
  const { sunrise, sunset } = getSunTimes(state, month);

  const isMountain = MOUNTAIN_STATES.includes(state);
  const isPlains   = PLAINS_STATES.includes(state);
  const isHot      = HOT_SUMMER_DESTS.includes(destName);

  const lines: string[] = [
    `SEASONAL CONTEXT — ${destName}, ${monthName}:`,
    `Sunrise ~${sunrise} | Sunset ~${sunset}`,
  ];

  // ── Heat block (April–June, plains/hot destinations) ────────────────────────
  if ((isPlains || isHot) && month >= 4 && month <= 6) {
    const maxTemp = month === 5 ? "42–46°C" : month === 6 ? "40–44°C" : "38–43°C";
    lines.push(
      `HEAT ALERT: ${month === 5 ? "Peak summer" : "Summer"} — daytime ${maxTemp}.`,
      `RULE: ALL outdoor heritage walks, fort climbs, or open-air sites MUST be before 11:00 AM or after 5:30 PM.`,
      `MIDDAY SLOT (12 PM–5 PM) = AC museum, hotel rest, cool café, or lunch only. Never schedule outdoor walking here.`,
      `Remind traveler: minimum 2L water, light cotton, UV sunscreen mandatory.`,
    );
    if (destName === "Agra") {
      lines.push(`TAJ MAHAL SPECIFIC: Arrive at east gate by 6:00 AM (opens at sunrise). Inner mausoleum first while cool. Exit by 10:30 AM.`);
    }
    if (RAJASTHAN_DESTS.includes(destName)) {
      lines.push(`RAJASTHAN SUMMER: Book AC accommodation — non-AC rooms become uninhabitable at 45°C. Evening bazaar visits 7–9 PM are excellent.`);
    }
  }

  // ── Cold / snow (Nov–Feb, mountain destinations) ────────────────────────────
  if (isMountain && (month <= 2 || month >= 11)) {
    const minTemp = (month === 1 || month === 12) ? "−5°C to 5°C" : "2°C to 10°C";
    lines.push(
      `COLD ALERT: Winter — night temperature ${minTemp}.`,
      `Clothing: thermal inner + fleece + waterproof outer. Hand warmers recommended.`,
      `Check road/pass status day-before on HRTC or local hotel. Some routes may close after snowfall.`,
    );
    if (SNOW_POSSIBLE_DESTS.includes(destName)) {
      lines.push(`SNOW: Likely this time of year — could mean snowplay/skiing (positive) or blocked roads (check conditions).`);
    }
  }

  // ── Monsoon: mountains (June–September) ─────────────────────────────────────
  if (isMountain && month >= 6 && month <= 9) {
    lines.push(
      `MONSOON ALERT: Active landslide season on mountain roads.`,
      `RULE: Schedule all treks and outdoor activities MORNING ONLY — afternoon thunderstorms are the norm.`,
      `Check NHAI HP/Uttarakhand and local hotel updates the night before travel.`,
    );
  }

  // ── Monsoon: plains (July–September) ────────────────────────────────────────
  if (isPlains && month >= 7 && month <= 9) {
    lines.push(
      `MONSOON: Rainy season — carry umbrella, expect wet roads.`,
      `Heritage sites (open-air ruins, stepwells, ghats) can be slippery — grip footwear essential.`,
      `Ganga-adjacent destinations: river levels HIGH — check ghat accessibility.`,
    );
  }

  // ── River destinations ───────────────────────────────────────────────────────
  if (RIVER_DESTS.includes(destName)) {
    if (destName === "Varanasi") {
      const aartiTime = (month >= 10 || month <= 2) ? "6:00 PM" : "7:00 PM";
      lines.push(`GANGA AARTI at Dashashwamedh Ghat: starts ~${aartiTime}. Arrive 45 minutes early for a good spot — it fills up fast.`);
    }
    if (["Rishikesh", "Haridwar"].includes(destName) && month >= 6 && month <= 9) {
      lines.push(`RIVER ADVISORY: Rafting SUSPENDED Jun–Sept (high water). Focus on yoga, ashrams, Ganga aarti.`);
    }
  }

  // ── Rajasthan peak season crowd warning ─────────────────────────────────────
  if (RAJASTHAN_DESTS.includes(destName)) {
    if (month >= 10 && month <= 3) {
      lines.push(`PEAK SEASON: Book accommodation and safari/fort permits 2–3 weeks in advance. October–March is prime Rajasthan.`);
    } else if (month >= 4 && month <= 6) {
      lines.push(`LOW SEASON: Fewer tourists, negotiable room rates — but plan every outdoor slot around heat (before 11 AM / after 5:30 PM).`);
    }
  }

  // ── Timing instruction to Groq ───────────────────────────────────────────────
  lines.push(
    `INSTRUCTION: Use the sunrise/sunset times above to schedule EVERY activity.`,
    `Never write "morning" — write "6:30 AM" or "${sunrise}". Never write "evening" — write "${sunset.replace("PM", "").trim()} PM" or specific time.`,
    `Every activity slot must include: (1) exact start time, (2) why that time is optimal, (3) one insider tip.`,
  );

  return lines.join("\n");
}
