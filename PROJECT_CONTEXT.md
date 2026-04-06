# PROJECT_CONTEXT.md — VibePath

> Single source of truth for the VibePath codebase. Every fact below is derived from actual code inspection.
> Last updated: 2026-04-07

---

## 1. Project Identity

| Field | Value |
|---|---|
| Name | VibePath |
| AI Persona | **Musafir** |
| Tagline | Weekend trip planning without 5 open tabs |
| Live URL | https://vibepath.pages.dev |
| GitHub | https://github.com/talhamasood97/vibepath |
| Package Name | `vibepath-app` v0.1.0 |
| Local Dev Port | 3001 |
| Cloudflare Account | Masoodtalha95@gmail.com |
| CF Pages Project | `vibepath` (NOT `vibepath-app` — that is a stale test project) |

## 2. Product Summary

VibePath is a constraint-based weekend trip planner for Tier 2/3 India. It operates in two modes:

- **DISCOVERY mode:** User provides origin city, budget (₹2k–25k), travel dates, and one vibe → system scores 33 destinations via 5-factor algorithm → returns exactly 3 opinionated itineraries (Value / Balanced / Comfort)
- **DESTINATION mode:** User already knows where they want to go → enters destination directly → system returns 3 budget profiles (Value / Balanced / Comfort) for that same destination with a deep, local-expert itinerary

**Core PM principle:** Budget is a trade-off space, not a filter. The engine treats ₹8,000 as a slider across transport class, stay type, and activities — not a hard cutoff.

## 3. Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Framework | Next.js App Router | 16.2.2 | SSR + API routes |
| Language | TypeScript | ^5 | Strict types throughout |
| Styling | Tailwind CSS | ^4 | Utility-first, custom design tokens |
| LLM — Narrative | Groq — `llama-3.1-8b-instant` | groq-sdk ^1.1.2 | Free 14,400 RPD, "Fast Brain" |
| LLM — Validation | Gemini 2.0 Flash | REST API (no npm pkg) | Google Search Grounding, "Live Eyes" |
| Hosting | Cloudflare Pages | — | Free, unlimited bandwidth, global CDN |
| Font | Inter (Google Fonts via `next/font`) | — | Consistent design |
| Node | v20.20.1 | — | Managed via nvm |

**Zero-cost stack:** Groq free tier (14,400 RPD) + Gemini 2.0 Flash free tier (5,000 grounded prompts/month). No paid APIs, no database, no auth.

## 4. Architecture

### Core Pattern: "Fast Brain + Live Eyes"

Two LLMs run in **parallel**, each doing only what it does best:

| Phase | Tool | Role | Data Source |
|---|---|---|---|
| Logistics | Static code | Transport, budget, routing | `transport-data.ts`, `budget-allocator.ts` |
| Narrative | Groq (Musafir) | Write the trip story, day plan, tradeoffs | Static `.ts` files + local intelligence |
| Validation | Gemini 2.0 Flash | Real-time alerts: weather, closures, bandhs | Google Search Grounding (live web) |
| Display | Frontend | Show itinerary + optional live alert badge | Combined output |

**Groq is "blind"** — Llama only knows training data (6–12 months old). It cannot browse the web. Gemini has "Live Eyes" via Google Search Grounding. Neither blocks the other — they race in `Promise.all()`.

### DISCOVERY MODE Pipeline

```
TripInput (origin, budget, dates, vibe, recentlyShown?)
    │
    ▼
destination-matcher.ts → matchDestinations(input)
  → filter DESTINATIONS catalogue (33 entries) by route existence
  → scoreDestination() → 5-factor score per candidate
  → selectDiverseTop3() → top 3 diverse Destination objects
    │
    ▼
transport-data.ts → getTransportOptions(origin, dest) → TransportOption[]
budget-allocator.ts → allocateAllProfiles(dest, transport, budget, nights)
local-intelligence.ts → getLocalIntelligence(dest.name) → LocalIntelligence | null
    │
    ▼
Promise.all([
  groq-client.ts → generateAllNarratives(contexts[])       ← "Fast Brain"
  gemini-validator.ts → getLiveAlert(dest, state, date)    ← "Live Eyes" per unique dest
])
  → Gemini always fails silently — never blocks Groq results
    │
    ▼
POST /api/generate → GenerateResponse { itineraries[3], mode: "discovery" }
```

### DESTINATION MODE Pipeline

```
TripInput (origin, budget, dates, destinationOverride)
    │
    ▼
findDestinationByName(name) → Destination | null
getTransportOptions(origin, dest)
allocateAllProfiles × 3 (Value/Balanced/Comfort for SAME dest)
    │
    ▼
Promise.all([
  generateAllNarratives(contexts[3])     ← 3 narratives, different profiles
  getLiveAlert(dest, state, date)        ← 1 Gemini call (same dest × 3 profiles)
])
    │
    ▼
POST /api/generate → GenerateResponse { itineraries[3], mode: "destination" }
```

**Deduplication:** In discovery mode, 3 different destinations → up to 3 Gemini calls. In destination mode, 1 destination × 3 profiles → exactly 1 Gemini call. Uses `new Set(destNames)`.

### Gemini Live Alert Details (`lib/gemini-validator.ts`)

- **API:** Direct `fetch` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=...` — no npm package (avoids Edge Runtime compatibility issues)
- **Tool:** `{ google_search: {} }` — enables real-time web grounding
- **Timeout:** 8-second `AbortSignal.timeout`
- **Scope (narrow by design):** IMD weather red/orange alerts, landslides, road closures, floods, bandhs/strikes, official monument/park closures in the last 7 days. NOT cafe hours, hotel reviews, or general travel tips.
- **Silent failure:** Any error (timeout, parse failure, missing key, API down) → returns `null` → Groq results returned as-is
- **Free tier:** 5,000 grounded prompts/month — at ~2 searches/user → covers 2,500 users at $0

### 5-Factor Scoring Engine (`lib/destination-scorer.ts`)

```
Score = VibeDepth×0.30 + TripFit×0.25 + Freshness×0.20 + RouteQuality×0.15 + SeasonalBoost×0.10
```

| Factor | Computation |
|---|---|
| **VibeDepth** | `dest.vibeStrength[vibe]` — 0 to 1 |
| **TripFit** | Ring 1 (≤200km)=1.0, Ring 2 (≤400km)=0.75, Ring 3 (≤600km)=0.5, far=0.3 |
| **Freshness** | hidden-gem=0.95, offbeat=0.80, popular=0.50, iconic=0.30. Penalty from localStorage: -0.4/-0.2/-0.1 for recent sessions |
| **RouteQuality** | train overnight=1.0, train daytime=0.8, bus=0.5, no route=0 |
| **SeasonalBoost** | +0.2 if current month in `dest.bestMonths`, +0.1 if adjacent |

`selectDiverseTop3()` ensures no two cards show the same destination in discovery mode.

## 5. Data & Schemas

### Supported Origins (10)

`Kanpur`, `Lucknow`, `Varanasi`, `Jaipur`, `Indore`, `Nagpur`, `Bhopal`, `Patna`, `Agra`, `Prayagraj`

### Destination Catalogue (33, in `lib/destination-matcher.ts`)

**CRITICAL: All monument/entry prices are INDIAN NATIONAL (domestic) rates.** ASI has two-tier pricing; domestic tourists pay far less. Key corrections applied:

| Monument | Old (wrong — foreign rate) | Correct (Indian national rate) |
|---|---|---|
| Taj Mahal | ₹1,100 | ₹50 entry + ₹200 inner mausoleum |
| Agra Fort | ₹650 | ₹40 |
| Mehtab Bagh | ₹300 | ₹30 |
| Jantar Mantar (Jaipur) | ₹200 | ₹50 |
| Itimad-ud-Daulah | ₹310 | ₹30 |

### Local Intelligence Coverage (`lib/local-intelligence.ts`)

13 destinations with curated hyper-local data injected into Groq prompts:

**Ayodhya, Varanasi, Rishikesh, Agra, Jaipur, Mathura, Orchha, Ujjain, Pushkar, Bodh Gaya, Rajgir, Pachmarchi, Ranthambore, Delhi**

Each entry: `mustEat[]`, `streetFood[]`, `shopping[]`, `hiddenGems[]`, `avoid[]`, `timingTips[]`, `localTransport`, `knowBeforeYouGo[]`, `stayAreas[]`

**Fact corrections applied:**

| Location | Was | Now |
|---|---|---|
| Rishikesh — Lakshman Jhula | "Cross the bridge" | Original demolished 2019–2020; points to Ram Jhula or new footbridge |
| Jaipur — Elephant rides | "Banned in 2022" | "Legally contested since 2019" |
| Ranthambore — Tiger sighting | 70–80% | 50–60% (realistic average) |
| Ranthambore — Booking URL | `rajasthan.gov.in/forest` | `rajasthanwildlife.in` |
| Delhi — Agrasen Ki Baoli | "UNESCO listed" | "ASI-protected monument" |
| Delhi — Metro day pass | ₹100 | ₹200 (1-day Tourist Card) |

**Groq system prompts** include: *"All entry prices in the data are INDIAN NATIONAL rates. Do not substitute or mention foreign national prices."*

### Vibes (7)

`mountains` · `beach` (**pill disabled, "SOON" badge**) · `historical` · `adventure` · `spiritual` · `relaxing` · `city`

### Budget Profiles (3)

| Profile | Train Class | Accommodation | Badge |
|---|---|---|---|
| `value` | Sleeper | Hostel | Best Value (teal) |
| `balanced` | 3AC | Budget hotel | Best Match (purple, featured) |
| `comfort` | 2AC | Midrange | Comfort (gold) |

### Key TypeScript Interfaces (`types/index.ts`)

```typescript
type Vibe = "mountains" | "beach" | "historical" | "adventure" | "spiritual" | "relaxing" | "city"
type TravelerType = "solo-male" | "solo-female" | "couple" | "friends" | "family"

interface TripInput {
  origin: string; budget: number; startDate: string; endDate: string;
  vibe: Vibe; travelers: number; travelerType?: TravelerType;
  destinationOverride?: string;
  recentlyShown?: string[];
}

interface LiveAlert {
  text: string;      // one concise sentence from Gemini Search Grounding
  source?: string;   // e.g. "IMD", "NHAI"
}

interface DestinationAlternative {
  name: string; state: string; tagline: string;
  primaryVibe: Vibe; discovery: DiscoveryTag;
}

interface GenerateError {
  error: string;
  code: "MISSING_KEY" | "RATE_LIMIT" | "INVALID_INPUT" | "NO_ROUTES" | "LLM_ERROR" | "DESTINATION_NOT_CURATED";
  alternatives?: DestinationAlternative[];  // present only on DESTINATION_NOT_CURATED
  requestedDestination?: string;
}

interface GeneratedItinerary extends StructuredItinerary {
  narrative: string;
  dayPlan: string;
  tradeoffs: string[];
  monsoonWarning?: string;
  liveAlert?: LiveAlert;   // absent = no alert found (Gemini returned null)
}

interface GenerateResponse {
  itineraries: GeneratedItinerary[];
  origin: string; generatedAt: string;
  provider: "groq"; mode: "discovery" | "destination";
}
```

## 6. File Map

```
vibepath-app/
├── app/
│   ├── layout.tsx              # Root layout: Inter font, imports globals.css
│   ├── page.tsx                # Full SPA ("use client"). Features:
│   │                           #   - Sticky "Plan a weekend ↑" fixed button (visible scrollY > 480)
│   │                           #   - Sample cards with data-tip route pill tooltips
│   │                           #   - Hover hint "↑ Click to pre-fill your search" on sample cards
│   │                           #   - Social proof with proof-meta-badge for institution names
│   │                           #   - LoadingSteps animation (4 steps, 1.8s intervals)
│   ├── globals.css             # Full design system. Key classes:
│   │                           #   .sticky-plan-btn (position:fixed bottom-right, fade-in)
│   │                           #   .route-pill[data-tip]::after (CSS-only tooltip on hover)
│   │                           #   .sample-card-cta-hint (fades in on card hover)
│   │                           #   .pill[data-vibe][data-active="true"] (per-vibe glow/border)
│   │                           #   .proof-meta-badge (pill badge for institution names)
│   │                           #   .live-alert + .live-alert-badge (Gemini alert block)
│   │                           #   .monsoon-warning (amber caution)
│   └── api/generate/route.ts   # POST /api/generate. runtime="edge". Validates all inputs.
│
├── components/
│   ├── SearchForm.tsx          # Origin (10 cities), budget slider (₹2k–25k, default ₹8k),
│   │                           # date pickers with night count, 7 vibe pills (beach=SOON),
│   │                           # traveler type pills, destination override combobox (29 dests),
│   │                           # saveShownDestinations() exported for freshness
│   └── ItineraryCard.tsx       # Gradient header (profile+vibe), stacked budget bar + legend,
│                               # narrative, last-mile display, monsoon warning,
│                               # liveAlert block (🔴 Live Check badge — only when present),
│                               # route pills, day plan, activity pills, tradeoff box,
│                               # TrainMan deep link (if train) / IRCTC fallback,
│                               # RedBus deep link (if bus route), WhatsApp share button
│
├── lib/
│   ├── destination-matcher.ts  # 33-entry catalogue. Indian national prices.
│   │                           # matchDestinations() | findDestinationByName()
│   │                           # findAlternativesForOrigin(origin, startDate, n=3)
│   ├── destination-scorer.ts   # 5-factor scorer. selectDiverseTop3().
│   ├── local-intelligence.ts   # Curated data, 13 destinations. Fact-checked.
│   ├── transport-data.ts       # ~60+ TRAIN/BUS routes. FIRST_MILE/LAST_MILE maps.
│   │                           # getRedBusLink(origin, dest, startDate) → RedBus deep link
│   │                           # getTrainManLink(origin, dest) → TrainMan search link
│   ├── budget-allocator.ts     # allocateAllProfiles() → 3 BudgetAllocation[]
│   ├── groq-client.ts          # Musafir persona. Discovery + Destination system prompts.
│   │                           # Rule: "All prices are INDIAN NATIONAL rates."
│   │                           # generateAllNarratives() → parallel Promise.allSettled
│   ├── gemini-validator.ts     # "Live Eyes" layer. fetch() to Gemini 2.0 Flash REST API.
│   │                           # google_search tool. 8s timeout. Always fails silently.
│   └── itinerary-builder.ts    # Orchestrates everything. Promise.all([Groq, Gemini]).
│                               # Deduplicates dest names for Gemini calls.
│                               # Throws DestinationNotCuratedError (422) for unknown dests.
│
├── types/index.ts              # All shared types. LiveAlert + liveAlert on GeneratedItinerary.
├── wrangler.toml               # name="vibepath". MUST match CF Pages project name.
├── next.config.ts              # Minimal (empty).
└── package.json                # dev | build | pages:build | deploy
```

## 7. API Contract

**Discovery request:**
```json
{ "origin": "Lucknow", "budget": 8000, "startDate": "2026-04-11", "endDate": "2026-04-13",
  "vibe": "spiritual", "travelers": 1, "recentlyShown": ["Ayodhya"] }
```

**Destination request:**
```json
{ "origin": "Lucknow", "budget": 8000, "startDate": "2026-04-11", "endDate": "2026-04-13",
  "vibe": "relaxing", "travelers": 1, "destinationOverride": "Ayodhya" }
```

**Success (200):** `{ itineraries[3], origin, generatedAt, provider: "groq", mode }`

`liveAlert` is absent (not `null`) when no alert found. Frontend renders `🔴 Live Check` only when field exists.

**Errors:** `MISSING_KEY` (500) · `INVALID_INPUT` (400) · `NO_ROUTES` (422) · `LLM_ERROR` (500) · `DESTINATION_NOT_CURATED` (422)

**DESTINATION_NOT_CURATED (422)** — returned when `destinationOverride` is not in the curated catalogue:
```json
{
  "error": "\"Bikaner\" isn't in our verified destination network yet...",
  "code": "DESTINATION_NOT_CURATED",
  "requestedDestination": "Bikaner",
  "alternatives": [
    { "name": "Jaipur", "state": "Rajasthan", "tagline": "...", "primaryVibe": "historical", "discovery": "iconic" },
    ...
  ]
}
```

Gemini errors are **never** surfaced to the API consumer.

## 8. UI Design System

**Color tokens:** `--primary: #5b3fd9` · `--accent-warm: #ff6a3c` · `--accent-teal: #00c9a7` · `--accent-gold: #FFB547` · `--bg: #f6f5ff`

**Vibe pill glow (active state):**
- mountains → `#134e5e` border + shadow
- adventure → `var(--accent-warm)` border + shadow
- historical → `#f7971e` border + shadow
- spiritual → `#c0392b` border + shadow
- relaxing → `var(--accent-teal)` border + shadow
- city → `#4a5568` border + shadow

**Route pill tooltips:** `.route-pill[data-tip]` → CSS `::after { content: attr(data-tip) }`. No JS. Fades in on hover.

**Page structure:** sticky header → sticky-plan-btn (fixed bottom-right, visible after 480px) → hero (copy + search card) → stats bar → results/sample cards → how-it-works + Budget Engine → social proof → cities → footer CTA → footer

## 9. Deployment

### CRITICAL — Two CF Pages Projects

| Project | URL | Status |
|---|---|---|
| `vibepath` | `vibepath.pages.dev` | **PRODUCTION — always deploy here** |
| `vibepath-app` | `vibepath-app.pages.dev` | Stale test project — ignore |

`wrangler.toml` has `name = "vibepath"` → `npm run deploy` goes to correct place automatically.

**Verify after deploy:**
```bash
curl -s "https://vibepath.pages.dev" | grep -o 'chunks/[^"]*\.js' | sort
ls .vercel/output/static/_next/static/chunks/ | sort
# Chunk names must match
```

**Manual deploy (if needed):**
```bash
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name vibepath --branch=main
```

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Yes — throws 500 if missing | Groq LLM |
| `GEMINI_API_KEY` | Optional — missing = no live alerts | Gemini 2.0 Flash. Get free at aistudio.google.com |
| `NODE_VERSION` | Yes (CF Pages) | `20` |

Set in CF Pages dashboard (Settings → Environment Variables) AND in `.env.local` for local dev.

### Auto-Deploy

Every `git push origin main` → CF Pages rebuilds and deploys `vibepath.pages.dev` automatically.

## 10. GOVERNANCE Rules

1. `export const runtime = "edge"` on all API routes
2. **Groq key fails loud** — explicit 500 if `GROQ_API_KEY` missing. Gemini key is optional.
3. **STRUCTURED GENERATION ONLY** — Groq/Musafir writes narrative only, never prices or logistics
4. **INDIAN NATIONAL PRICES** — all ASI entry prices are domestic tourist rates
5. **NO GENERIC FALLBACK** — unknown destination → `DestinationNotCuratedError` (422) + curated alternatives. Never serve a templated itinerary with no real data.
6. **Gemini scope is narrow** — only real-time safety/closure alerts, not reviews or tips
7. **Unicode in JSX** — `\uXXXX` must be inside `{}` JS expressions, never bare JSX text (Turbopack renders them literally otherwise)
8. **Deploy to correct project** — `wrangler.toml` `name = "vibepath"`. Verify with `wrangler pages project list`.
9. **Specific git add** — never `git add -A`
10. **Build before push** — `npm run build` must pass clean

## 11. Current State (as of 2026-04-05)

### Working
- Full site live at `vibepath.pages.dev`
- Discovery mode (33 destinations, 5-factor scoring, anti-repetition)
- Destination mode (override combobox, deep local-expert plan)
- **Hard quality gate**: unknown destination → 422 + curated alternatives (no generic plans ever)
- **Alternatives UI**: page shows top-3 reachable curated alternatives as clickable cards
- **WhatsApp share**: formatted trip card with transport, day plan, must-eat, hidden gem
- **TrainMan deep links** on each itinerary card (IRCTC fallback if no specific train)
- **RedBus deep links** with date-encoded URL (DD-MM-YYYY format)
- Destination mode: verified ✅ / unverified ⚠️ / default hint text
- Local intelligence injected into Groq (13 destinations, fact-checked)
- Groq + Gemini parallel ("Fast Brain + Live Eyes")
- `🔴 Live Check` badge when Gemini finds an alert
- Monsoon warnings (Jun–Sep, mountain/beach destinations)
- Train frequency filter (excludes trains not running on departure date)
- Overnight train detection
- Correct Indian monument prices throughout
- Vibe pill glow per-vibe color
- Sticky "Plan a weekend ↑" CTA
- Route pill CSS tooltips on sample cards
- Sample card hover hint
- Social proof institution badges
- ~60+ transport routes

### Pending
- No real-time train availability
- No user accounts or saved itineraries
- Budget Engine sidebar shows static demo data
- No custom domain

## 12. Rolling Version Log

| Date | Summary |
|---|---|
| 2026-04-07 | Hard quality gate (`DestinationNotCuratedError`), alternatives UI, WhatsApp share, TrainMan + RedBus deep links, vibe fix in dest mode |
| 2026-04-05 | Gemini "Live Eyes" — `gemini-validator.ts`, parallel `Promise.all`, `LiveAlert` type, `🔴 Live Check` badge |
| 2026-04-05 | Indian monument prices fixed (Taj ₹50, Agra Fort ₹40, Jantar Mantar ₹50, etc.) |
| 2026-04-05 | Local intelligence fact-check (Rishikesh bridge, Ranthambore stats, Delhi metro, Agrasen Ki Baoli) |
| 2026-04-05 | UI: sticky CTA, vibe pill glow, route pill tooltips, sample card hover hint, proof badges |
| 2026-04-05 | Deploy fix: `wrangler.toml` `name` → `vibepath` (was `vibepath-app`) |
| 2026-04-05 | feat: 33 destinations, 5-factor scorer, local intelligence, destination mode, freshness, 60+ routes |
| 2026-04-03 | feat: rename Arjun → Musafir |
| 2026-04-03 | feat: VibePath MVP, Cloudflare Pages |

## 13. Agent Operating Instructions

1. **Never use worktrees.** Edit in `/Users/mohdtalhamasood/Downloads/VibePath(itinerary)/vibepath-app/` directly.
2. **Node prefix if needed:** `PATH="$HOME/.nvm/versions/node/v20.20.1/bin:$PATH"`
3. **Definition of Done:** edit → `npm run build` passes → `git add <files>` → commit → push → CF Pages auto-deploys.
4. **Deploy verification:** compare chunk names between live site and local build (see §9).
5. **Always deploy to `vibepath`.** Confirm project: `wrangler pages project list`.
6. **Adding origin city:** `SUPPORTED_ORIGINS` in `route.ts` + `FIRST_MILE`/`LAST_MILE` + route entries.
7. **Adding destination:** `DESTINATIONS` in `destination-matcher.ts` (full interface) + transport routes + optional local intelligence.
8. **Adding vibe:** `Vibe` union in `types/index.ts` + `VALID_VIBES` in `route.ts` + pill in `SearchForm` + gradient in `globals.css` + `VIBE_GRADIENTS` in `ItineraryCard` + active color in `globals.css`.
9. **Unicode in JSX:** `{"\u20b9"}` or `` {`\u20b9${expr}`} `` — never bare in JSX text.
10. **Gemini is optional.** Missing key = no alerts, product still 100% functional.
11. **Prices = Indian national rates.** Verify ASI domestic rates when adding entry prices.

---

*Update this document whenever architecture, data, or key decisions change.*
