"use client";

import { useState, useRef, useEffect } from "react";
import type { GeneratedItinerary, TripInput, Vibe, GenerateResponse, GenerateError } from "@/types";
import SearchForm, { saveShownDestinations } from "@/components/SearchForm";
import ItineraryCard from "@/components/ItineraryCard";
import DetailModal from "@/components/DetailModal";

// ── Logo SVG ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="logo-mark"
    >
      <rect x="4" y="4" width="64" height="64" rx="16" fill="url(#lgPage)" />
      <circle cx="20" cy="52" r="5" fill="white" />
      <path d="M20 52C24 44 28 36 52 16" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
      <path d="M20 52C28 44 36 38 54 32" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M20 52C28 48 38 48 54 48" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      <circle cx="52" cy="16" r="4.5" fill="#FFB547" />
      <circle cx="54" cy="32" r="3.5" fill="#FF6A3C" opacity="0.85" />
      <circle cx="54" cy="48" r="3" fill="white" opacity="0.6" />
      <defs>
        <linearGradient id="lgPage" x1="4" y1="4" x2="68" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B3FD9" />
          <stop offset="1" stopColor="#3D1F8E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Step-by-step loading display ─────────────────────────────────────────────
const LOADING_STEPS = [
  { icon: "\ud83d\ude82", text: "Finding trains and buses\u2026",     sub: "Checking routes from your city" },
  { icon: "\ud83d\uddfa\ufe0f", text: "Scoring 33 destinations\u2026", sub: "Vibe, season, distance, freshness" },
  { icon: "\ud83d\udcb0", text: "Allocating your budget\u2026",       sub: "Transport \xb7 Stay \xb7 Food \xb7 Activities" },
  { icon: "\u270d\ufe0f", text: "Musafir is writing your plan\u2026",  sub: "Almost there, dost" },
];

function LoadingSteps({ origin }: { origin?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1800, 3500, 5500]; // advance at 1.8s, 3.5s, 5.5s
    const timers = timings.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const current = LOADING_STEPS[Math.min(step, LOADING_STEPS.length - 1)];

  return (
    <div className="cards-grid" style={{ gridColumn: "1 / -1" }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <div className="loading-steps">
          <div className="loading-step-icon">{current.icon}</div>
          <div className="loading-step-text">
            {step === 0 && origin ? `Finding trains from ${origin}\u2026` : current.text}
          </div>
          <div className="loading-step-sub">{current.sub}</div>
          <div className="loading-progress" aria-hidden="true">
            {LOADING_STEPS.map((_, i) => (
              <div key={i} className={`loading-dot${i <= step ? " active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Budget Engine sidebar ─────────────────────────────────────────────────────
function BudgetEngineCard() {
  return (
    <aside id="budget" className="budget-card" aria-label="Liquid Budget Engine demo">
      <div className="budget-card-tag">Liquid Budget Engine</div>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
        See where every rupee actually goes.
      </h3>
      <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
        Instead of "hotels under ₹3,000", you see a live split of your budget across categories —
        with suggestions when something is out of balance.
      </p>
      <div className="budget-bars" aria-label="Budget allocation example">
        {[
          { label: "🚂 Transport",   cls: "bar-transport", pct: 42, val: "₹3,360" },
          { label: "🏨 Stay",        cls: "bar-stay",      pct: 36, val: "₹2,880" },
          { label: "🍜 Food",        cls: "bar-food",      pct: 12, val: "₹960"   },
          { label: "🎯 Activities",  cls: "bar-exp",       pct: 10, val: "₹800"   },
        ].map((row) => (
          <div key={row.label} className="budget-bar-row">
            <span>{row.label}</span>
            <div className="budget-bar-shell-mini">
              <div className={`budget-bar-mini-fill ${row.cls}`} style={{ width: `${row.pct}%` }} />
            </div>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{row.val}</span>
          </div>
        ))}
      </div>
      <div className="budget-tip">
        <div className="budget-tip-label">💡 Trade-off available</div>
        <div className="budget-tip-text">
          Take a <strong>later train</strong> (overnight) → save{" "}
          <strong style={{ color: "var(--accent-teal)" }}>₹900</strong>. Reallocate to a quieter
          stay or keep the savings.
        </div>
      </div>
    </aside>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState<string | null>(null);
  const [itineraries,      setItineraries]      = useState<GeneratedItinerary[]>([]);
  const [lastVibe,         setLastVibe]         = useState<string>("adventure");
  const [lastOrigin,       setLastOrigin]       = useState<string | undefined>(undefined);
  const [prefill,          setPrefill]          = useState<{ vibe?: Vibe; budget?: number } | null>(null);
  const [showSticky,       setShowSticky]       = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<GeneratedItinerary | null>(null);

  const resultsRef = useRef<HTMLElement | null>(null);
  const searchRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onScroll() {
      setShowSticky(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleSampleCardClick(vibe: Vibe, budget: number) {
    setPrefill({ vibe, budget });
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleSearch(input: TripInput) {
    setLoading(true);
    setError(null);
    setLastVibe(input.vibe);
    setLastOrigin(input.origin);

    try {
      const res = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(input),
      });
      const data: GenerateResponse | GenerateError = await res.json();

      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : "Something went wrong. Try again.");
        setItineraries([]);
      } else {
        const result = (data as GenerateResponse).itineraries;
        setItineraries(result);
        // Wire saveShownDestinations — persists to localStorage for freshness anti-repetition
        saveShownDestinations(result.map((it) => it.destination.name));
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          100
        );
      }
    } catch {
      setError("Network error — check your connection and try again.");
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = itineraries.length > 0;

  return (
    <>
      {/* ── STICKY PLAN CTA ── */}
      <div className={`sticky-plan-btn${showSticky ? " visible" : ""}`}>
        <button type="button" onClick={scrollToSearch}>
          Plan a weekend ↑
        </button>
      </div>

      {/* ── HEADER ── */}
      <header>
        <div className="page-shell nav" aria-label="Primary navigation">
          <div className="brand" onClick={scrollToSearch} style={{ cursor: "pointer" }}>
            <LogoMark />
            <div>
              <div className="logo-text-main">
                Vibe<span className="accent">Path</span>
              </div>
              <div className="logo-text-tagline">Smart weekends from any city</div>
            </div>
          </div>
          <nav className="nav-links" aria-label="Site sections">
            <a href="#results">Sample trips</a>
            <a href="#how-it-works">How it works</a>
            <a href="#budget">Liquid Budget</a>
            <a href="#cities">Cities</a>
          </nav>
          <div className="nav-cta-group">
            <button className="btn btn-ghost" type="button">Log in</button>
            <button className="btn btn-primary" type="button" onClick={scrollToSearch}>
              Plan a weekend
            </button>
          </div>
        </div>
      </header>

      <main id="main">

        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="page-shell hero-layout">

            {/* Left: copy */}
            <div>
              <div className="hero-eyebrow fade-up">
                For weekend trips across India · Tier 2, Tier 3 & beyond
              </div>
              <h1 className="hero-title fade-up fade-up-d1" id="hero-heading">
                One form. Three itineraries.<br />Zero tab chaos.
              </h1>
              <p className="hero-sub fade-up fade-up-d2">
                Tell us your city, budget, and vibe. We search trains, buses, and stays together
                and return three opinionated options with clear trade-offs — not a wall of filters.
              </p>
              <div className="hero-badges fade-up fade-up-d3" aria-label="Highlights">
                <span className="hero-badge">⚡ Built for short breaks – 2–4 days</span>
                <span className="hero-badge">🇮🇳 Works from any Indian city</span>
                <span className="hero-badge">💰 Budget as a slider, not a guess</span>
              </div>
              <div className="hero-primary-cta fade-up fade-up-d3">
                <button className="btn btn-primary" type="button" onClick={scrollToSearch}>
                  Start with a ₹8,000 weekend →
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() =>
                    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See a sample itinerary
                </button>
              </div>
              <p className="hero-note fade-up fade-up-d4">
                <span>Free forever:</span> Groq-powered AI, static train data, zero paywalls.
              </p>
            </div>

            {/* Right: search card */}
            <aside className="hero-right fade-up fade-up-d2" aria-label="Trip search">
              <div ref={searchRef}>
                <SearchForm onSubmit={handleSearch} loading={loading} prefill={prefill} />
              </div>
            </aside>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="page-shell">
          <div className="stats-bar" aria-label="Key numbers">
            <div className="stat-block">
              <div className="stat-number"><span className="highlight">10</span>+</div>
              <div className="stat-desc">Tier 2/3 origins</div>
            </div>
            <div className="stat-block">
              <div className="stat-number"><span className="warm">60</span>s</div>
              <div className="stat-desc">To full itinerary</div>
            </div>
            <div className="stat-block">
              <div className="stat-number"><span className="highlight">3</span></div>
              <div className="stat-desc">Options, not 300</div>
            </div>
            <div className="stat-block">
              <div className="stat-number">₹2k–<span className="warm">25k</span></div>
              <div className="stat-desc">Budget range</div>
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <section
          className="results-section"
          id="results"
          aria-labelledby="results-heading"
          ref={resultsRef}
        >
          <div className="page-shell">
            <div className="section-heading">
              <div>
                <h2 id="results-heading">
                  {hasResults
                    ? `Your ${lastVibe} itineraries`
                    : "Sample weekend: North Indian city → hills under ₹8,000"}
                </h2>
                <p>
                  {hasResults
                    ? "Three options. Clear trade-offs. Pick one and book."
                    : `Here's how VibePath responds to "\u20b98k, mountains, this weekend" from a Tier 2 city.`}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box" style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Couldn't build itineraries</p>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{error}</p>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  style={{ marginTop: "0.75rem" }}
                  onClick={scrollToSearch}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Cards */}
            <div className="cards-grid" aria-label="Three itinerary options">
              {loading ? (
                <LoadingSteps origin={lastOrigin} />
              ) : hasResults ? (
                itineraries.map((it, i) => (
                  <ItineraryCard key={`${it.destination.name}-${it.profile}`} itinerary={it} index={i} vibe={lastVibe} onViewDetails={setSelectedItinerary} />
                ))
              ) : (
                /* Static sample cards */
                <>
                  <article className="itinerary-card" data-featured="true">
                    <div className="card-image">
                      <div className="card-image-gradient grad-hills">
                        <span className="dest-name">Rishikesh</span>
                      </div>
                      <span className="card-badge badge-best">Best Match</span>
                    </div>
                    <div className="card-body">
                      <div className="card-header-row">
                        <h3 className="card-title">Morning bus, shared rooms, maximum experiences</h3>
                        <div className="budget-number">₹7,520<br />94%</div>
                      </div>
                      <div className="budget-line">
                        <span style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Budget usage</span>
                        <div className="budget-bar-shell"><div className="budget-bar-fill" style={{ width: "94%" }} /></div>
                      </div>
                      <p className="card-desc">Rafting at Shivpuri, Laxman Jhula walk, camp under the stars. The evening bus gets you there overnight — more time in the hills.</p>
                      <div className="route-pills">
                        <span className="route-pill" data-tip="~7h overnight bus from Lucknow · saves a hotel night · arrive early morning"><span className="route-dot" />Fri: Evening bus → Rishikesh</span>
                        <span className="route-pill" data-tip="Shivpuri rapids Grade 3–4 · ₹600–800 per person · 16km stretch"><span className="route-dot" />Sat: Rafting + cafes</span>
                        <span className="route-pill" data-tip="Last bus back ~4pm · reach Lucknow by midnight"><span className="route-dot" />Sun: Late-afternoon return</span>
                      </div>
                      <div className="tradeoff-box tradeoff-blue">
                        <span className="tradeoff-icon">💡</span>
                        <span>Leave Friday after work, return Sunday night. You trade sleep for one full extra day in the destination.</span>
                      </div>
                      <div className="card-footer">
                        <button className="btn btn-outline btn-sm" type="button" onClick={() => handleSampleCardClick("mountains", 8000)}>{"Try this vibe \u2192"}</button>
                        <div className="card-footnote">{"Sample data \xb7 search for live results"}</div>
                      </div>
                      <div className="sample-card-cta-hint">{"↑ Click to pre-fill your search"}</div>
                    </div>
                  </article>

                  <article className="itinerary-card">
                    <div className="card-image">
                      <div className="card-image-gradient grad-budget">
                        <span className="dest-name">Nainital</span>
                      </div>
                      <span className="card-badge badge-value">Best Value</span>
                    </div>
                    <div className="card-body">
                      <div className="card-header-row">
                        <h3 className="card-title">Sleeper train, hostel dorm, street food trail</h3>
                        <div className="budget-number" style={{ color: "var(--accent-teal)" }}>{"\u20b96,180"}<br />77%</div>
                      </div>
                      <div className="budget-line">
                        <span style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Budget usage</span>
                        <div className="budget-bar-shell"><div className="budget-bar-fill" style={{ width: "77%" }} /></div>
                      </div>
                      <p className="card-desc">{"You under-spend. VibePath suggests upgrades \u2014 better stay or an extra activity \u2014 instead of leaving money idle."}</p>
                      <div className="route-pills">
                        <span className="route-pill" data-tip="Overnight Sleeper (SL) · ~₹300 one way · ~9h · saves Friday hotel"><span className="route-dot" style={{ background: "var(--accent-teal)" }} />Sleeper train both ways</span>
                        <span className="route-pill" data-tip="Mallital or Tallital area · ₹400–600/night dorm · walking distance to Mall Road"><span className="route-dot" style={{ background: "var(--accent-teal)" }} />Hostel in main market</span>
                      </div>
                      <div className="tradeoff-box tradeoff-teal">
                        <span className="tradeoff-icon">{"\ud83d\udcb0"}</span>
                        <div>
                          <div className="tradeoff-label">Smart Save</div>
                          <span>{"Shift \u20b91,000 from transport savings into a quieter stay or one marquee activity."}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button className="btn btn-outline btn-sm" type="button" onClick={() => handleSampleCardClick("relaxing", 6000)}>{"Try this vibe \u2192"}</button>
                        <div className="card-footnote">Good for students.</div>
                      </div>
                      <div className="sample-card-cta-hint">{"↑ Click to pre-fill your search"}</div>
                    </div>
                  </article>

                  <article className="itinerary-card">
                    <div className="card-image">
                      <div className="card-image-gradient grad-comfort">
                        <span className="dest-name">Mussoorie</span>
                      </div>
                      <span className="card-badge badge-comfort">Comfort</span>
                    </div>
                    <div className="card-body">
                      <div className="card-header-row">
                        <h3 className="card-title">Morning Volvo, boutique stay, slower pace</h3>
                        <div className="budget-number" style={{ color: "var(--accent-warm)" }}>{"\u20b98,450"}<br />106%</div>
                      </div>
                      <div className="budget-line">
                        <span style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Budget usage</span>
                        <div className="budget-bar-shell"><div className="budget-bar-fill" style={{ width: "100%", background: "linear-gradient(90deg,var(--accent-warm),#FFB547)" }} /></div>
                      </div>
                      <p className="card-desc">Gently overshoots budget. VibePath calls it out and shows exactly what to drop to return within budget.</p>
                      <div className="route-pills">
                        <span className="route-pill" data-tip="Volvo/AC sleeper · ~₹700 one way · departs 6am · scenic route via Dehradun"><span className="route-dot" style={{ background: "var(--accent-gold)" }} />AC bus both ways</span>
                        <span className="route-pill" data-tip="Landour or Library Road area · ₹1,800–2,500/night · quieter than mall zone"><span className="route-dot" style={{ background: "var(--accent-gold)" }} />Boutique homestay</span>
                      </div>
                      <div className="tradeoff-box tradeoff-warm">
                        <span className="tradeoff-icon">{"\u2702\ufe0f"}</span>
                        <div>
                          <div className="tradeoff-label">Pro Tip</div>
                          <span>{"Drop one paid experience \u2192 save ~\u20b91,200 \u2192 back within budget without touching comfort."}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button className="btn btn-outline btn-sm" type="button" onClick={() => handleSampleCardClick("city", 10000)}>{"Try this vibe \u2192"}</button>
                        <div className="card-footnote">For comfort-first travelers.</div>
                      </div>
                      <div className="sample-card-cta-hint">{"↑ Click to pre-fill your search"}</div>
                    </div>
                  </article>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS + BUDGET ENGINE ── */}
        <section className="how-section" id="how-it-works" aria-labelledby="how-heading">
          <div className="page-shell how-layout">
            <div>
              <h2 className="how-title" id="how-heading">
                Unlike generic travel sites, VibePath starts from your budget and vibe.
              </h2>
              <p className="how-sub">
                We don't ask you to juggle 15 filters. We ask four things and move the complexity
                into our side of the screen.
              </p>
              <ol className="steps-list">
                {[
                  {
                    n: 1,
                    title: "You share origin, weekend window & vibe",
                    body: "Origin city, dates, budget, and one vibe — that's all. Four inputs, done.",
                  },
                  {
                    n: 2,
                    title: "We search trains, buses & stays together",
                    body: "Multi-modal legs, realistic first–last mile, and stay options that actually fit your budget range.",
                  },
                  {
                    n: 3,
                    title: "You see 3 opinionated itineraries",
                    body: "Each one spells out trade-offs in simple language so a group can decide in one conversation, not 300 screenshots.",
                  },
                ].map((s) => (
                  <li key={s.n} className="step-item">
                    <div className="step-number">{s.n}</div>
                    <div>
                      <div className="step-title">{s.title}</div>
                      <p className="step-body">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <BudgetEngineCard />
          </div>
        </section>

        {/* ── SOCIAL PROOF ── */}
        <section className="proof-section" aria-labelledby="proof-heading">
          <div className="page-shell" style={{ textAlign: "center" }}>
            <h2 id="proof-heading">What early testers are saying.</h2>
            <p className="proof-sub">
              From IIT Kanpur campuses to NIT WhatsApp groups — the problem is real.
            </p>
            <div className="proof-grid">
              {[
                {
                  quote: "\u201cI spent 3 hours planning my Shimla trip last semester. With VibePath it took 40 seconds and the train option it found was better than what I\u2019d booked manually.\u201d",
                  name: "Priya S.", meta: "MBA\u201925, IIT Kanpur", av: "av-1", init: "P", stars: "\u2605\u2605\u2605\u2605\u2605",
                },
                {
                  quote: "\u201cThe trade-off tip saved me \u20b91,400 on a Rishikesh trip by suggesting I leave Friday night. I used that to upgrade to a riverside camp.\u201d",
                  name: "Rohit M.", meta: "B.Tech\u201926, NIT Allahabad", av: "av-2", init: "R", stars: "\u2605\u2605\u2605\u2605\u2605",
                },
                {
                  quote: "\u201cFinally something that knows I\u2019m in Lucknow, not Delhi. It found a train route I\u2019d never have found on IRCTC and the trip was within my \u20b96k budget.\u201d",
                  name: "Anika T.", meta: "Working professional, Lucknow", av: "av-3", init: "A", stars: "\u2605\u2605\u2605\u2605\u2606",
                },
              ].map((p) => (
                <div key={p.name} className="proof-card">
                  <div className="proof-stars">{p.stars}</div>
                  <div className="proof-quote">{p.quote}</div>
                  <div className="proof-author">
                    <div className={`proof-avatar ${p.av}`}>{p.init}</div>
                    <div style={{ textAlign: "left" }}>
                      <div className="proof-name">{p.name}</div>
                      <div className="proof-meta-badge">{p.meta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CITIES ── */}
        <section className="cities-section" id="cities" aria-labelledby="cities-heading">
          <div className="page-shell" style={{ textAlign: "center" }}>
            <h2 id="cities-heading" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
              Designed for the way India actually travels.
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              Tuned for weekend patterns from non-metro cities, not just "Delhi–Goa" clichés.
            </p>
            <div className="cities-grid" aria-label="Sample routes">
              {[
                "Kanpur → Rishikesh", "Lucknow → Nainital", "Varanasi → Bodhgaya",
                "Jaipur → Pushkar",   "Indore → Mandu",     "Nagpur → Pench",
                "Bhopal → Pachmarhi", "Patna → Rajgir",     "Agra → Mathura",
                "Prayagraj → Chitrakoot",
              ].map((r) => (
                <button key={r} className="city-pill" type="button" onClick={scrollToSearch}>
                  {r}
                </button>
              ))}
              <span className="city-pill" style={{ opacity: 0.5, cursor: "default" }}>
                + more coming
              </span>
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="footer-cta" aria-labelledby="footer-cta-heading">
          <div className="page-shell">
            <div className="footer-card">
              <h2 id="footer-cta-heading">
                Help us shape the trip planner you wish existed in college.
              </h2>
              <p>
                We're validating VibePath with real weekend travelers across campuses and
                first-job cities. Share one trip you struggled to plan — we'll recreate it
                with our engine.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn btn-white" type="button" onClick={scrollToSearch}>
                  Try the engine now →
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="page-shell footer-row">
          <span>
            © {new Date().getFullYear()} VibePath · Built from India, for how India travels on weekends.
          </span>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>

      {/* ── DETAIL MODAL ── */}
      {selectedItinerary && (
        <DetailModal
          itinerary={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
    </>
  );
}
