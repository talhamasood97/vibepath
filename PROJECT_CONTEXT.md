# PROJECT_CONTEXT.md — VibePath

> Single source of truth for the VibePath codebase. Every fact below is derived from actual code inspection.
> Last updated: 2026-04-03

---

## 1. Project Identity

| Field | Value |
|---|---|
| Name | VibePath |
| Tagline | Weekend trip planning without 5 open tabs |
| Live URL | https://vibepath.pages.dev |
| GitHub | https://github.com/talhamasood97/vibepath |
| Package Name | `vibepath-app` v0.1.0 |
| Local Dev Port | 3001 |
| Cloudflare Account | Masoodtalha95@gmail.com |

## 2. Product Summary

VibePath is a constraint-based weekend trip planner for Tier 2/3 India. User provides origin city, budget (₹2k–25k), travel dates, and one vibe. System returns **exactly 3 opinionated itineraries** — Value, Balanced, Comfort — with real train prices, budget breakdowns, trade-off notes, and IRCTC booking links. No wall of filters. No paid APIs. Zero monthly infra cost until ~2,000 MAU.

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

The LLM **only writes narrative**. All prices, routes, timings, and logistics come from deterministic static data. This guarantees accuracy and prevents hallucinated prices.

```
TripInput (origin, budget, dates, vibe)
    │
    ▼
destination-matcher.ts
  → filter DESTINATIONS catalogue by vibe compatibility + route existence + budget feasibility
  → return top 3 Destination objects (fills to 3 using multi-profile same-destination if <3 match)
    │
    ▼
transport-data.ts
  → getTransportOptions(origin, destination) → TrainRoute[] + BusRoute[] from static maps
    │
    ▼
budget-allocator.ts
  → allocateAllProfiles(dest, transport, budget, nights) → 3 BudgetAllocation objects
  → Value = sleeper + hostel | Balanced = 3AC + budget hotel | Comfort = 2AC + midrange
  → generates tradeoffNote per profile
    │
    ▼
itinerary-builder.ts
  → orchestrates above, builds ItineraryContext[] for LLM
  → always produces 3 StructuredItinerary objects (guaranteed)
    │
    ▼
groq-client.ts
  → generateAllNarratives(contexts[]) via Promise.allSettled (parallel)
  → model: llama-3.1-8b-instant, response_format: { type: "json_object" }
  → persona: "Arjun" — smart friend, NOT corporate agent
  → strict constraint: LLM must not alter any prices, train names, timings, distances
    │
    ▼
POST /api/generate → GenerateResponse { itineraries: GeneratedItinerary[3] }
```

### 3-Card Guarantee

`itinerary-builder.ts` always returns 3 cards. If fewer than 3 destinations match, the best destination is reused with different profiles (Value → Balanced → Comfort). This prevents empty results for narrow vibes/origins.

### Transport Data Key Format

`TRAIN_ROUTES` and `BUS_ROUTES` keyed as `"ORIGIN_DESTINATION"` uppercase, e.g. `"KANPUR_RISHIKESH"`. No API dependency — static curated data, always available.

### First/Last Mile

Every `TransportOption` includes `firstMile` (e.g. "Auto/Ola to Kanpur Central (~₹80, 20 min)") and `lastMile` (e.g. "Shared taxi to Rishikesh (~₹120, 45 min)") strings for door-to-destination routing.

## 5. Data & Schemas

### Supported Origins (10)

`Kanpur`, `Lucknow`, `Varanasi`, `Jaipur`, `Indore`, `Nagpur`, `Bhopal`, `Patna`, `Agra`, `Prayagraj`

Validation in `route.ts` — returns 400 with full list if origin not matched.

### Destination Catalogue (11, in `lib/destination-matcher.ts`)

| Destination | State | Vibes |
|---|---|---|
| Rishikesh | Uttarakhand | adventure, spiritual, mountains, relaxing |
| Agra | Uttar Pradesh | historical, city |
| Varanasi | Uttar Pradesh | spiritual, historical, city |
| Jaipur | Rajasthan | historical, city, relaxing |
| Mussoorie | Uttarakhand | mountains, relaxing, adventure |
| Nainital | Uttarakhand | mountains, relaxing, adventure |
| Delhi | Delhi | historical, city, relaxing |
| Haridwar | Uttarakhand | spiritual, relaxing |
| Orchha | Madhya Pradesh | historical, relaxing |
| Khajuraho | Madhya Pradesh | historical |
| Pushkar | Rajasthan | spiritual, relaxing |

### Vibes (7)

`mountains` · `beach` · `historical` · `adventure` · `spiritual` · `relaxing` · `city`

### Budget Profiles (3)

| Profile | Train Class | Accommodation | Badge |
|---|---|---|---|
| `value` | sleeper | hostel | Best Value (teal) |
| `balanced` | 3AC | budget hotel | Best Match (purple, featured) |
| `comfort` | 2AC | midrange | Comfort (gold) |

### Key TypeScript Interfaces (`types/index.ts`)

**TripInput:** `origin: string`, `budget: number`, `startDate: string`, `endDate: string`, `vibe: Vibe`, `travelers: number`

**TrainRoute:** `trainName`, `trainNumber`, `departure/arrival` ("HH:MM"), `durationHours`, `overnight: boolean`, `price: { sleeper, ac3, ac2 }`, `frequency`, `note?`

**BudgetAllocation:** `profile`, `totalBudget`, `transport`, `accommodation`, `food`, `activities`, `buffer`, `utilizationPct`, `trainClass`, `accommodationType`, `tradeoffNote?`

**GeneratedItinerary extends StructuredItinerary:** adds `narrative: string`, `dayPlan: string`, `tradeoffs: string[]`

**GenerateError codes:** `MISSING_KEY` · `RATE_LIMIT` · `INVALID_INPUT` · `NO_ROUTES` · `LLM_ERROR`

## 6. File Map

```
vibepath-app/
├── app/
│   ├── layout.tsx              # Root layout: Inter font (next/font/google), imports globals.css
│   ├── page.tsx                # Full single-page app: header, hero, stats, results, how-it-works,
│   │                           # social proof, cities, footer CTA, footer. "use client".
│   ├── globals.css             # Full design system from vibepath_opus.html:
│   │                           # CSS vars (--primary #5b3fd9, --accent-warm #ff6a3c,
│   │                           # --accent-teal #00c9a7, --accent-gold #FFB547, --bg #f6f5ff)
│   │                           # All component classes: .btn, .search-card, .itinerary-card,
│   │                           # .card-image-gradient, .grad-*, .card-badge.badge-*,
│   │                           # .tradeoff-box.tradeoff-*, .stats-bar, .how-section,
│   │                           # .proof-section, .cities-section, .footer-card
│   └── api/generate/route.ts   # POST /api/generate. runtime = "edge" (groq-sdk is fetch-based,
│                               # safe for CF Workers + nodejs_compat).
│                               # Input validation → buildItineraries → GenerateResponse.
│
├── components/
│   ├── SearchForm.tsx          # "use client". Origin dropdown (10 cities), budget slider
│   │                           # (₹2k–25k, step 500), date pickers with night count display,
│   │                           # 7 vibe pills (data-active pattern), submit button with spinner.
│   └── ItineraryCard.tsx       # "use client". Gradient header per profile+vibe, badge,
│                               # budget bar (utilizationPct), route pills, day plan,
│                               # activities, tradeoff box, IRCTC CTA link.
│
├── lib/
│   ├── transport-data.ts       # Static TRAIN_ROUTES + BUS_ROUTES maps. Key: "ORIGIN_DESTINATION".
│   │                           # FIRST_MILE / LAST_MILE per city.
│   │                           # getTransportOptions(origin, dest) → TransportOption[]
│   ├── destination-matcher.ts  # DESTINATIONS catalogue (11 entries).
│   │                           # matchDestinations(input) → top 3 Destination[]
│   │                           # Filter: vibe → route existence → budget feasibility
│   ├── budget-allocator.ts     # allocateBudget({ profile, dest, transport, budget, nights })
│   │                           # allocateAllProfiles(...) → 3 BudgetAllocation[]
│   │                           # pickBestTransport(options, profile) → TransportOption
│   ├── groq-client.ts          # Fail-loud env check (throws if GROQ_API_KEY missing).
│   │                           # generateItineraryNarrative(ctx) → LLMResponse
│   │                           # generateAllNarratives(contexts[]) → parallel Promise.allSettled
│   │                           # Model: llama-3.1-8b-instant, response_format: json_object
│   │                           # Persona: "Arjun" — smart friend, desi phrases OK
│   └── itinerary-builder.ts    # buildItineraries(input) → GeneratedItinerary[]
│                               # Orchestrates: match → transport → allocate → LLM → merge
│                               # 3-card guarantee: fills gaps with multi-profile same destination
│
├── types/index.ts              # All shared types: Vibe, TripInput, TrainRoute, BusRoute,
│                               # TransportOption, Destination, BudgetAllocation, BudgetProfile,
│                               # StructuredItinerary, GeneratedItinerary, GenerateRequest,
│                               # GenerateResponse, GenerateError
│
├── wrangler.toml               # name=vibepath-app, compatibility_date=2024-09-23,
│                               # compatibility_flags=["nodejs_compat"],
│                               # pages_build_output_dir=.vercel/output/static
├── next.config.ts              # Minimal (empty config). No setupDevPlatform.
└── package.json                # scripts: dev, build, pages:build (npx @cloudflare/next-on-pages@1),
                                # deploy (pages:build + wrangler pages deploy)
```

## 7. API Contract

### POST /api/generate

**Request body:**
```json
{
  "origin": "Kanpur",
  "budget": 8000,
  "startDate": "2026-04-05",
  "endDate": "2026-04-07",
  "vibe": "adventure",
  "travelers": 1
}
```

**Success response (200):**
```json
{
  "itineraries": [ ...3x GeneratedItinerary... ],
  "origin": "Kanpur",
  "generatedAt": "2026-04-03T10:00:00.000Z",
  "provider": "groq"
}
```

**Error responses:**
| Code | HTTP | Trigger |
|---|---|---|
| `MISSING_KEY` | 500 | GROQ_API_KEY not set |
| `INVALID_INPUT` | 400 | Bad origin / budget / vibe / dates |
| `NO_ROUTES` | 422 | No transport data or budget too tight |
| `LLM_ERROR` | 500 | Groq request failed |

## 8. UI Design System

Design from `vibepath_opus.html` (reference file at `/Users/mohdtalhamasood/Downloads/vibepath_opus.html`).

**Color tokens:**
- `--primary: #5b3fd9` (purple), `--primary-strong: #4025b0`
- `--accent-warm: #ff6a3c` (orange), `--accent-teal: #00c9a7`, `--accent-gold: #FFB547`
- `--bg: #f6f5ff`, `--surface: #ffffff`, `--text-main: #1d1436`, `--text-muted: #787194`

**Gradient classes per profile:**
- `grad-hills` (green) — balanced/mountains
- `grad-budget` (blue) — value/beach
- `grad-comfort` (gold) — comfort/historical
- `grad-spiritual` (red), `grad-purple`, `grad-city` (dark)

**Badge classes:** `badge-best` (purple) · `badge-value` (teal) · `badge-comfort` (gold)

**Tradeoff box classes:** `tradeoff-blue` · `tradeoff-teal` · `tradeoff-warm`

**Page structure (page.tsx):** sticky header → hero (2-col: copy left + search card right) → stats bar → results section (sample or live) → how-it-works + Budget Engine sidebar → social proof → cities grid → footer CTA → footer

## 9. Deployment

### Cloudflare Pages

| Setting | Value |
|---|---|
| Build command | `npx @cloudflare/next-on-pages@1` |
| Output directory | `.vercel/output/static` |
| Framework preset | Next.js |
| Node version | 20 |

**Why `npx` not devDependency:** `@cloudflare/next-on-pages` has peer dep conflict with Next.js 16. CF Pages invokes it via npx at build time. Verified: `_worker.js/index.js` generates cleanly.

**Why `runtime = "edge"` not `"nodejs"`:** Cloudflare Workers uses V8 isolates (Edge runtime). `groq-sdk` is pure fetch — no native binaries — so Edge + `nodejs_compat` wrangler flag works fine. Original `"nodejs"` rule in GOVERNANCE was for `bcrypt`/`sharp` type packages.

### Environment Variables

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Groq API key — throws explicit 500 if missing (fail-loud) |
| `NODE_VERSION` | `20` — set in CF Pages dashboard |

No other env vars required. No database. No auth tokens. No Supabase.

### Auto-Deploy

Every `git push origin main` triggers a new Cloudflare Pages deployment automatically (GitHub integration via Cloudflare Workers and Pages App, installed at `github.com/settings/installations/120961428`).

## 10. GOVERNANCE Rules (from GOVERNANCE.md)

1. **`export const runtime = "edge"`** on all API routes for CF Pages (override: "nodejs" was original GOVERNANCE rule for native binaries — groq-sdk is fetch-only so edge is safe)
2. **ENV VARS FAIL LOUD:** `groq-client.ts` throws explicit error if `GROQ_API_KEY` missing — no silent undefined
3. **MINIMAL CONFIG:** `next.config.ts` starts empty — no `setupDevPlatform` (breaks build)
4. **VERIFY BEFORE CODING:** Use Groq (proven, 14,400 RPD free), static data (always available), no unproven APIs
5. **No worktree edits** — always edit directly in the repo directory
6. **Structured generation only:** LLM writes narrative; never prices, routes, or logistics

## 11. Coding Standards

- **TypeScript strict mode** via tsconfig. Path alias `@/*` → project root.
- **`"use client"`** on all interactive components (`SearchForm`, `ItineraryCard`, `page.tsx`)
- **No Tailwind utility classes in JSX** for layout — use CSS custom classes from `globals.css`
- **No `git add -A`** — always add specific files by name
- **Unicode in JSX strings** — use `\uXXXX` escape for curly quotes, ₹, etc. inside template literals to avoid Turbopack parsing errors (known issue with Next.js 16 + Turbopack)

## 12. Current State

### What Is Working
- Full website live at `vibepath.pages.dev`
- Hero with 2-col layout, sticky header, opus design system
- Search form: origin dropdown (10 cities), budget slider ₹2k–25k, date pickers, 7 vibe pills
- API generates real itineraries: 3 cards with Groq narrative + static prices
- 3-card guarantee — never fewer than 3 results
- Static sample cards shown before first search (Rishikesh / Nainital / Mussoorie)
- ItineraryCard: gradient headers, budget bars, route pills, tradeoff boxes, IRCTC deep-link
- How It Works + Liquid Budget Engine section
- Social proof, cities grid, footer CTA
- Cloudflare Pages CI/CD via GitHub

### Known Limitations / Next Steps
- Only 10 supported origin cities
- No real-time train availability (prices are static estimates from 2026 IRCTC data)
- No user accounts, no saved itineraries, no WhatsApp share
- LLM `dayPlan` returned as `string` from Groq JSON — split on `\n` in `ItineraryCard`
- Budget Engine sidebar (How It Works section) shows static demo data, not live allocation from search
- No backend (Render/FastAPI from PRD v2.1) — current architecture is pure Next.js monolith on CF Pages
- No Supabase, no flight search, no Google Maps integration (all planned for V2+ per PRD)
- No custom domain yet — `vibepath.pages.dev` subdomain (custom domain deferred until brand matters)

## 13. Rolling Version Log

| Date | Commit | Summary |
|---|---|---|
| 2026-04-03 | `56a3889` | fix: use npx for @cloudflare/next-on-pages — avoids peer dep conflict with Next 16 |
| 2026-04-03 | `30d031f` | fix: simplify next.config.ts — remove setupDevPlatform |
| 2026-04-03 | `2a95412` | feat: VibePath MVP — opus UI + Cloudflare Pages deploy config |
| 2026-04-03 | `09f8209` | Initial commit from Create Next App |

## 14. Agent Operating Instructions

1. **Never use worktrees.** Edit files directly in `/Users/mohdtalhamasood/Downloads/VibePath(itinerary)/vibepath-app/`.
2. **Node commands** prefix with `PATH="$HOME/.nvm/versions/node/v20.20.1/bin:$PATH"` if nvm not active.
3. **Definition of Done:** files edited → `npm run build` passes → `git add <specific files>` → commit → `git push origin main` → CF Pages auto-deploys.
4. **Adding a new origin city:** add to `SUPPORTED_ORIGINS` in `route.ts`, add `FIRST_MILE`/`LAST_MILE` entries in `transport-data.ts`, add at least one `TRAIN_ROUTES` or `BUS_ROUTES` entry for it.
5. **Adding a new destination:** add to `DESTINATIONS` array in `destination-matcher.ts` with full `Destination` interface, add matching transport routes in `transport-data.ts`.
6. **Adding a new vibe:** add to `Vibe` union in `types/index.ts`, add to `VALID_VIBES` in `route.ts`, add pill in `SearchForm.tsx`, add gradient class in `globals.css` and `VIBE_GRADIENTS` map in `ItineraryCard.tsx`.
7. **Unicode in JSX:** use `\uXXXX` for curly quotes (`\u201c`, `\u201d`), apostrophes (`\u2019`), and ₹ (`\u20b9`) inside template literals to avoid Turbopack parse errors.
8. **Build check before push:** `npm run build` must pass clean. Turbopack errors are not the same as tsc errors — test both.

---

*This document is the single source of truth for the VibePath project. Update it when architecture, data, or key decisions change.*
