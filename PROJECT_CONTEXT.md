# PROJECT_CONTEXT.md — VibePath

> Single source of truth for the VibePath codebase. Every fact below is derived from actual code inspection.
> Last updated: 2026-04-05

---

## 1. Project Identity

| Field | Value |
|---|---|
| Name | VibePath |
| AI Persona | **Musafir** (renamed from Arjun) |
| Tagline | Weekend trip planning without 5 open tabs |
| Live URL | https://vibepath.pages.dev |
| GitHub | https://github.com/talhamasood97/vibepath |
| Package Name | `vibepath-app` v0.1.0 |
| Local Dev Port | 3001 |
| Cloudflare Account | Masoodtalha95@gmail.com |

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
| LLM | Groq — `llama-3.1-8b-instant` | groq-sdk ^1.1.2 | Free 14,400 RPD, no credit card |
| Hosting | Cloudflare Pages | — | Free, unlimited bandwidth, global CDN |
| Font | Inter (Google Fonts via `next/font`) | — | Consistent with opus design |
| Node | v20.20.1 | — | Managed via nvm |

**Zero-cost stack:** No paid APIs, no database, no auth. Entire product runs on static data + Groq free tier.

## 4. Architecture

### Core Pattern: Structured Generation

The LLM (**Musafir** persona) **only writes narrative**. All prices, routes, timings, and logistics come from deterministic static data. This guarantees accuracy and prevents hallucinated prices.

### DISCOVERY MODE Pipeline

```
TripInput (origin, budget, dates, vibe, recentlyShown?)
    │
    ▼
destination-matcher.ts → matchDestinations(input)
  → filter DESTINATIONS catalogue (33 entries) by route existence
  → for each candidate: scoreDestination() → 5-factor score
  → selectDiverseTop3() → top 3 diverse Destination objects
    │
    ▼
transport-data.ts → getTransportOptions(origin, dest) → TransportOption[]
    │
    ▼
budget-allocator.ts → allocateAllProfiles(dest, transport, budget, nights)
  → Value = sleeper + hostel | Balanced = 3AC + budget hotel | Comfort = 2AC + midrange
    │
    ▼
local-intelligence.ts → getLocalIntelligence(dest.name) → LocalIntelligence | null
  (curated food/gems/warnings injected into LLM prompt)
    │
    ▼
groq-client.ts → generateAllNarratives(contexts[]) — parallel Promise.allSettled
  → DISCOVERY_SYSTEM_PROMPT: Musafir as "smart dost who's been there"
  → model: llama-3.1-8b-instant, response_format: json_object
    │
    ▼
POST /api/generate → GenerateResponse { itineraries[3], mode: "discovery" }
```

### DESTINATION MODE Pipeline

```
TripInput (origin, budget, dates, destinationOverride)
    │
    ▼
destination-matcher.ts → findDestinationByName(name) → Destination | null
    │
    ▼
transport-data.ts → getTransportOptions(origin, dest)
    │
    ▼
budget-allocator.ts → allocateAllProfiles × 3 (Value/Balanced/Comfort for SAME dest)
    │
    ▼
local-intelligence.ts → getLocalIntelligence(dest.name)
    │
    ▼
groq-client.ts → generateAllNarratives(contexts[])
  → DESTINATION_SYSTEM_PROMPT: Musafir as "local expert who's been here 5 times"
  → higher token budget (800 vs 650), temp 0.8 vs 0.7
    │
    ▼
POST /api/generate → GenerateResponse { itineraries[3], mode: "destination" }
```

### 5-Factor Scoring Engine (`lib/destination-scorer.ts`)

```
Score = VibeDepth×0.30 + TripFit×0.25 + Freshness×0.20 + RouteQuality×0.15 + SeasonalBoost×0.10
```

| Factor | Computation |
|---|---|
| **VibeDepth** | `dest.vibeStrength[vibe]` — 0 to 1 |
| **TripFit** | Proximity: Ring 1 (≤200km)=1.0, Ring 2 (≤400km)=0.75, Ring 3 (≤600km)=0.5, far=0.3. Adjusted for `typicalStayNights` fit |
| **Freshness** | Base: hidden-gem=0.95, offbeat=0.80, popular=0.50, iconic=0.30. Penalty from localStorage: -0.4 (last session), -0.2 (2 ago), -0.1 (3 ago) |
| **RouteQuality** | train overnight=1.0, train daytime=0.8, bus=0.5, no route=0 |
| **SeasonalBoost** | +0.2 if current month in `dest.bestMonths`, +0.1 if adjacent month |

`selectDiverseTop3()` ensures no two cards show the same destination in discovery mode.

### Transport Data Key Format

`TRAIN_ROUTES` and `BUS_ROUTES` keyed as `"ORIGIN_DESTINATION"` uppercase, e.g. `"LUCKNOW_AYODHYA"`. ~60+ routes total (up from 25 at MVP).

### First/Last Mile

Every `TransportOption` includes `firstMile` and `lastMile` strings for door-to-destination routing (from `FIRST_MILE` / `LAST_MILE` maps in `transport-data.ts`).

### Anti-Repetition (Freshness, Rec 6)

localStorage key `"vp_recently_shown"` stores last 5 sessions as `string[][]`. `loadRecentlyShown()` in `SearchForm` flattens these and passes as `recentlyShown` in `TripInput`. Scorer applies freshness penalty so users don't see same destinations repeatedly.

## 5. Data & Schemas

### Supported Origins (10)

`Kanpur`, `Lucknow`, `Varanasi`, `Jaipur`, `Indore`, `Nagpur`, `Bhopal`, `Patna`, `Agra`, `Prayagraj`

Validation in `route.ts` — returns 400 with full list if origin not matched.

### Destination Catalogue (33, in `lib/destination-matcher.ts`)

Each destination has: `name`, `state`, `tagline`, `vibes[]`, `primaryVibe`, `vibeStrength` (per-vibe 0–1 scores), `discovery` tag, `bestMonths[]`, `distanceKm`, `typicalStayNights`, `accommodation` (hostel/budget/midrange min-max), `food` (daily budgets), `mustDo[]`, `avgActivityCost`.

| Destination | State | Primary Vibe | Discovery Tag |
|---|---|---|---|
| Ayodhya | Uttar Pradesh | spiritual | iconic |
| Mathura | Uttar Pradesh | spiritual | popular |
| Varanasi | Uttar Pradesh | spiritual | iconic |
| Haridwar | Uttarakhand | spiritual | popular |
| Rishikesh | Uttarakhand | adventure | popular |
| Ujjain | Madhya Pradesh | spiritual | offbeat |
| Pushkar | Rajasthan | spiritual | offbeat |
| Bodh Gaya | Bihar | spiritual | offbeat |
| Rajgir | Bihar | spiritual | hidden-gem |
| Chitrakoot | Uttar Pradesh | spiritual | hidden-gem |
| Agra | Uttar Pradesh | historical | iconic |
| Jaipur | Rajasthan | historical | iconic |
| Delhi | Delhi | city | iconic |
| Orchha | Madhya Pradesh | historical | offbeat |
| Khajuraho | Madhya Pradesh | historical | popular |
| Gwalior | Madhya Pradesh | historical | offbeat |
| Sanchi | Madhya Pradesh | historical | hidden-gem |
| Bundi | Rajasthan | historical | hidden-gem |
| Udaipur | Rajasthan | relaxing | popular |
| Jodhpur | Rajasthan | historical | popular |
| Mandu | Madhya Pradesh | historical | hidden-gem |
| Mussoorie | Uttarakhand | mountains | popular |
| Nainital | Uttarakhand | mountains | popular |
| Shimla | Himachal Pradesh | mountains | popular |
| Lansdowne | Uttarakhand | mountains | hidden-gem |
| Pachmarchi | Madhya Pradesh | mountains | offbeat |
| Ranthambore | Rajasthan | adventure | popular |
| Pench | Madhya Pradesh | adventure | offbeat |
| Jabalpur | Madhya Pradesh | adventure | offbeat |
| Corbett | Uttarakhand | adventure | popular |
| Pushkar | Rajasthan | spiritual | offbeat |
| Tadoba | Maharashtra | adventure | offbeat |
| Kanha | Madhya Pradesh | adventure | offbeat |

### Local Intelligence Coverage (`lib/local-intelligence.ts`)

13 destinations have curated hyper-local data injected into LLM prompts:

**Ayodhya, Varanasi, Rishikesh, Agra, Jaipur, Mathura, Orchha, Ujjain, Pushkar, Bodh Gaya, Rajgir, Pachmarchi, Ranthambore, Delhi**

Each entry contains:
- `mustEat[]` — named restaurants/dhabas with `area`, `knownFor`, `price`, `tip?`
- `streetFood[]` — street snacks with `area`, `price`, `tip?`
- `shopping[]` — craft/souvenir spots with `what`, `where`, `priceRange`, `tip?`
- `hiddenGems[]` — off-the-beaten-path spots with `name`, `what`, `why`, `bestTime?`
- `avoid[]` — honest tourist trap warnings (strings)
- `timingTips[]` — when to visit specific sites, what to avoid
- `localTransport` — how to get around locally (string)
- `knowBeforeYouGo[]` — dress codes, entry rules, packing tips
- `stayAreas[]` — recommended neighbourhoods per profile

### Vibes (7)

`mountains` · `beach` (**disabled — "SOON" pill in UI**) · `historical` · `adventure` · `spiritual` · `relaxing` · `city`

### Budget Profiles (3)

| Profile | Train Class | Accommodation | Badge |
|---|---|---|---|
| `value` | sleeper | hostel | Best Value (teal) |
| `balanced` | 3AC | budget hotel | Best Match (purple, featured) |
| `comfort` | 2AC | midrange | Comfort (gold) |

### Key TypeScript Interfaces (`types/index.ts`)

```typescript
type Vibe = "mountains" | "beach" | "historical" | "adventure" | "spiritual" | "relaxing" | "city"
type DiscoveryTag = "iconic" | "popular" | "offbeat" | "hidden-gem"

interface TripInput {
  origin: string; budget: number; startDate: string; endDate: string;
  vibe: Vibe; travelers: number;
  destinationOverride?: string;   // DESTINATION mode
  recentlyShown?: string[];       // freshness anti-repetition
}

interface Destination {
  name, state, tagline, vibes: Vibe[], primaryVibe: Vibe,
  vibeStrength: Partial<Record<Vibe, number>>,  // 0-1 per vibe
  discovery: DiscoveryTag, bestMonths: number[],
  distanceKm, typicalStayNights, accommodation, food, mustDo, avgActivityCost
}

interface LocalFood { name: string; area: string; knownFor?: string; price: string; tip?: string; }
interface LocalShopping { what: string; where: string; priceRange: string; tip?: string; }
interface LocalIntelligence { destination, mustEat, streetFood, shopping, hiddenGems, avoid, timingTips, localTransport, knowBeforeYouGo, stayAreas }

interface BudgetAllocation { profile, totalBudget, transport, accommodation, food, activities, buffer, utilizationPct, trainClass, accommodationType, tradeoffNote? }
interface GeneratedItinerary extends StructuredItinerary { narrative: string; dayPlan: string; tradeoffs: string[]; }

interface GenerateResponse { itineraries: GeneratedItinerary[]; origin: string; generatedAt: string; provider: "groq"; mode: "discovery" | "destination"; }
interface GenerateError { error: string; code: "MISSING_KEY" | "RATE_LIMIT" | "INVALID_INPUT" | "NO_ROUTES" | "LLM_ERROR"; }
```

## 6. File Map

```
vibepath-app/
├── app/
│   ├── layout.tsx              # Root layout: Inter font (next/font/google), imports globals.css
│   ├── page.tsx                # Full single-page app: header, hero, stats, results, how-it-works,
│   │                           # social proof, cities, footer CTA, footer. "use client".
│   ├── globals.css             # Full design system. CSS vars, all component classes.
│   │                           # --primary #5b3fd9, --accent-warm #ff6a3c, --accent-teal #00c9a7
│   │                           # --accent-gold #FFB547, --bg #f6f5ff
│   └── api/generate/route.ts   # POST /api/generate. runtime = "edge". Validates origin, budget,
│                               # vibe (optional in dest mode), startDate, endDate,
│                               # destinationOverride?, recentlyShown?
│                               # Returns GenerateResponse with mode: "discovery" | "destination"
│
├── components/
│   ├── SearchForm.tsx          # "use client". Origin dropdown (10 cities), budget slider
│   │                           # (₹2k–25k step 500, default ₹8,000), date pickers (night count),
│   │                           # 7 vibe pills (beach=disabled "SOON"),
│   │                           # destination override toggle + combobox (29 known dests),
│   │                           # freshness: loadRecentlyShown() + saveShownDestinations() exported
│   └── ItineraryCard.tsx       # "use client". Gradient header per profile+vibe, budget bar,
│                               # narrative, route pills, day plan, activity pills, tradeoff box,
│                               # IRCTC CTA link.
│
├── lib/
│   ├── destination-matcher.ts  # DESTINATIONS catalogue (33 entries, all with primaryVibe,
│   │                           # vibeStrength, discovery tag).
│   │                           # matchDestinations(input) → top 3 scored Destination[]
│   │                           # findDestinationByName(name) → Destination | null
│   ├── destination-scorer.ts   # NEW: 5-factor scoring engine.
│   │                           # scoreDestination(dest, vibe, transport, nights, recentlyShown, month)
│   │                           # selectDiverseTop3(scored[]) → diverse top 3
│   ├── local-intelligence.ts   # NEW: curated hyper-local data for 13 destinations.
│   │                           # getLocalIntelligence(name) → LocalIntelligence | null
│   │                           # Injected into Groq prompts — real restaurant names, hidden gems,
│   │                           # tourist trap warnings, timing tips.
│   ├── transport-data.ts       # Static TRAIN_ROUTES + BUS_ROUTES (~60+ routes).
│   │                           # Key: "ORIGIN_DESTINATION" uppercase.
│   │                           # FIRST_MILE / LAST_MILE per city.
│   │                           # getTransportOptions(origin, dest) → TransportOption[]
│   ├── budget-allocator.ts     # allocateBudget({ profile, dest, transport, budget, nights })
│   │                           # allocateAllProfiles(...) → 3 BudgetAllocation[]
│   ├── groq-client.ts          # Fail-loud env check. Musafir persona.
│   │                           # DISCOVERY_SYSTEM_PROMPT: "smart dost from Tier 2 city"
│   │                           # DESTINATION_SYSTEM_PROMPT: "local expert who's been here 5 times"
│   │                           # formatLocalIntelligence(intel, profile) injects curated data
│   │                           # generateAllNarratives(contexts[]) → parallel Promise.allSettled
│   │                           # Model: llama-3.1-8b-instant, temp 0.7/0.8, tokens 650/800
│   └── itinerary-builder.ts    # buildItineraries(input) → routes to discovery or destination mode
│                               # buildDiscoveryItineraries: match → score → transport → allocate → LLM
│                               # buildDestinationItineraries: find → transport → 3 profiles → LLM
│                               # Both inject localIntelligence into LLM context
│
├── types/index.ts              # All shared types (see §5 above)
├── wrangler.toml               # name=vibepath-app, compatibility_date=2024-09-23,
│                               # compatibility_flags=["nodejs_compat"],
│                               # pages_build_output_dir=.vercel/output/static
├── next.config.ts              # Minimal (empty config). No setupDevPlatform.
└── package.json                # scripts: dev, build, pages:build, deploy
```

## 7. API Contract

### POST /api/generate

**Discovery mode request:**
```json
{
  "origin": "Lucknow",
  "budget": 8000,
  "startDate": "2026-04-11",
  "endDate": "2026-04-13",
  "vibe": "spiritual",
  "travelers": 1,
  "recentlyShown": ["Ayodhya", "Varanasi"]
}
```

**Destination mode request:**
```json
{
  "origin": "Lucknow",
  "budget": 8000,
  "startDate": "2026-04-11",
  "endDate": "2026-04-13",
  "vibe": "relaxing",
  "travelers": 1,
  "destinationOverride": "Ayodhya"
}
```

**Success response (200):**
```json
{
  "itineraries": [ ...3x GeneratedItinerary... ],
  "origin": "Lucknow",
  "generatedAt": "2026-04-05T10:00:00.000Z",
  "provider": "groq",
  "mode": "discovery"
}
```

**Error responses:**
| Code | HTTP | Trigger |
|---|---|---|
| `MISSING_KEY` | 500 | GROQ_API_KEY not set |
| `INVALID_INPUT` | 400 | Bad origin / budget / vibe / dates |
| `NO_ROUTES` | 422 | No transport data, dest not in catalog, budget too tight |
| `LLM_ERROR` | 500 | Groq request failed |

## 8. UI Design System

**Color tokens:**
- `--primary: #5b3fd9` (purple), `--primary-strong: #4025b0`
- `--accent-warm: #ff6a3c` (orange), `--accent-teal: #00c9a7`, `--accent-gold: #FFB547`
- `--bg: #f6f5ff`, `--surface: #ffffff`, `--text-main: #1d1436`, `--text-muted: #787194`

**Gradient classes per profile:**
- `grad-hills` (green) — balanced/mountains
- `grad-budget` (blue) — value/beach
- `grad-comfort` (gold) — comfort/historical
- `grad-spiritual` (red/maroon), `grad-purple`, `grad-city` (dark)

**Badge classes:** `badge-best` (purple) · `badge-value` (teal) · `badge-comfort` (gold)

**Tradeoff box classes:** `tradeoff-blue` · `tradeoff-teal` · `tradeoff-warm`

**Page structure (page.tsx):** sticky header → hero (2-col: copy + search card) → stats bar → results section (live or sample) → how-it-works + Budget Engine sidebar → social proof → cities grid → footer CTA → footer

**SearchForm defaults:** origin=Lucknow, budget=₹8,000, vibe=spiritual, dates=next weekend

## 9. Deployment

### Cloudflare Pages

| Setting | Value |
|---|---|
| Build command | `npx @cloudflare/next-on-pages@1` |
| Output directory | `.vercel/output/static` |
| Framework preset | Next.js |
| Node version | 20 |

**Why `npx` not devDependency:** `@cloudflare/next-on-pages` has peer dep conflict with Next.js 16. CF Pages invokes it via npx at build time.

**Why `runtime = "edge"`:** CF Workers uses V8 isolates. `groq-sdk` is pure fetch — no native binaries — so Edge + `nodejs_compat` flag works fine.

### Environment Variables

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Groq API key — throws explicit 500 if missing (fail-loud) |
| `NODE_VERSION` | `20` — set in CF Pages dashboard |

### Auto-Deploy

Every `git push origin main` triggers a new Cloudflare Pages deployment automatically.

## 10. GOVERNANCE Rules

1. **`export const runtime = "edge"`** on all API routes
2. **ENV VARS FAIL LOUD:** `groq-client.ts` throws explicit error if `GROQ_API_KEY` missing
3. **MINIMAL CONFIG:** `next.config.ts` starts empty — no `setupDevPlatform`
4. **STRUCTURED GENERATION ONLY:** LLM (Musafir) writes narrative only — never prices, routes, or logistics
5. **No worktree edits** — always edit directly in the repo directory
6. **Unicode in JSX:** use `\uXXXX` for ₹, curly quotes, apostrophes inside template literals (Turbopack issue with Next.js 16)
7. **Specific git add** — never `git add -A`; list files explicitly
8. **Build check before push** — `npm run build` must pass clean

## 11. Coding Standards

- **TypeScript strict mode** via tsconfig. Path alias `@/*` → project root.
- **`"use client"`** on all interactive components (`SearchForm`, `ItineraryCard`, `page.tsx`)
- **No Tailwind utility classes in JSX** for layout — use CSS custom classes from `globals.css`

## 12. Current State

### What Is Working (as of 2026-04-05)
- Full website live at `vibepath.pages.dev`
- **DISCOVERY mode:** 33-destination catalog, 5-factor scoring (VibeDepth+TripFit+Freshness+RouteQuality+SeasonalBoost), Ayodhya correctly surfaces for spiritual from Lucknow
- **DESTINATION mode:** "Already have a destination in mind?" toggle with combobox, deep local-expert itinerary for chosen destination
- **Local Intelligence:** 13 destinations have curated food/gems/warnings injected into Groq prompts — Musafir references real specific places
- **Freshness:** localStorage tracks last 5 sessions, anti-repetition penalty in scorer
- **Beach vibe:** greyed out with "SOON" badge, tooltip lists upcoming destinations
- **60+ transport routes** covering all new destinations including Ayodhya, Mathura, Orchha, Ujjain, Bodh Gaya, Ranthambore, Pachmarchi etc.
- 3-card guarantee — never fewer than 3 results
- Cloudflare Pages CI/CD via GitHub

### Known Limitations / Pending Items
- `saveShownDestinations()` exported from `SearchForm` but **not yet wired** in `app/page.tsx` — freshness data not actually being persisted after search results arrive
- No real-time train availability (prices are static estimates)
- No user accounts, no saved itineraries, no WhatsApp share
- Budget Engine sidebar (How It Works) shows static demo data, not live allocation
- No custom domain yet — `vibepath.pages.dev` subdomain

## 13. Rolling Version Log

| Date | Commit | Summary |
|---|---|---|
| 2026-04-05 | `655a197` | feat: implement all 6 recommendation improvements (Rec 1-6) — 33 destinations, 5-factor scorer, local intelligence, destination mode, beach pill SOON, freshness anti-repetition, 60+ transport routes |
| 2026-04-03 | `13793a4` | feat: rename Arjun → Musafir persona throughout |
| 2026-04-03 | `56a3889` | fix: use npx for @cloudflare/next-on-pages |
| 2026-04-03 | `30d031f` | fix: simplify next.config.ts |
| 2026-04-03 | `2a95412` | feat: VibePath MVP — opus UI + Cloudflare Pages deploy config |
| 2026-04-03 | `09f8209` | Initial commit from Create Next App |

## 14. Agent Operating Instructions

1. **Never use worktrees.** Edit files directly in `/Users/mohdtalhamasood/Downloads/VibePath(itinerary)/vibepath-app/`.
2. **Node commands** prefix with `PATH="$HOME/.nvm/versions/node/v20.20.1/bin:$PATH"` if nvm not active.
3. **Definition of Done:** files edited → `npm run build` passes → `git add <specific files>` → commit → `git push origin main` → CF Pages auto-deploys.
4. **Adding a new origin city:** add to `SUPPORTED_ORIGINS` in `route.ts`, add `FIRST_MILE`/`LAST_MILE` in `transport-data.ts`, add at least one route entry.
5. **Adding a new destination:** add to `DESTINATIONS` array in `destination-matcher.ts` with full interface (including `primaryVibe`, `vibeStrength`, `discovery`), add transport routes in `transport-data.ts`, optionally add local intelligence in `local-intelligence.ts`.
6. **Adding a new vibe:** add to `Vibe` union in `types/index.ts`, to `VALID_VIBES` in `route.ts`, add pill in `SearchForm.tsx`, add gradient in `globals.css` and `VIBE_GRADIENTS` in `ItineraryCard.tsx`.
7. **Unicode in JSX:** use `\uXXXX` for curly quotes (`\u201c`, `\u201d`), apostrophes (`\u2019`), and ₹ (`\u20b9`) inside template literals.
8. **Build check before push:** `npm run build` must pass clean.
9. **Scorer tweak:** to change how a destination ranks for a vibe, adjust `vibeStrength` values in `destination-matcher.ts` for that destination. Primary vibe should be 0.9+, secondary 0.4–0.7, unrelated vibes 0.0–0.2.
10. **Local intelligence:** if adding a new destination to local-intelligence.ts, use `area:` (not `where:`) for `streetFood[]` items and `mustEat[]` items. Use `where:` for `shopping[]` items. `knownFor` is optional in `LocalFood`.

---

*This document is the single source of truth for the VibePath project. Update it when architecture, data, or key decisions change.*
