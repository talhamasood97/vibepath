"use client";

import { useState, useEffect, useRef } from "react";
import type { TripInput, Vibe, TravelerType } from "@/types";

const ORIGINS = [
  "Kanpur", "Lucknow", "Varanasi", "Jaipur", "Indore",
  "Nagpur", "Bhopal", "Patna", "Agra", "Prayagraj",
];

// Destinations available for the "I know where I'm going" mode
const KNOWN_DESTINATIONS = [
  "Ayodhya", "Mathura", "Rishikesh", "Haridwar", "Varanasi",
  "Agra", "Jaipur", "Orchha", "Khajuraho", "Gwalior",
  "Sanchi", "Bundi", "Udaipur", "Jodhpur", "Mandu",
  "Mussoorie", "Nainital", "Shimla", "Lansdowne", "Pachmarchi",
  "Ranthambore", "Pench", "Jabalpur", "Delhi",
  "Ujjain", "Pushkar", "Bodh Gaya", "Rajgir", "Chitrakoot",
];

// Rec 6: localStorage key for recently shown destinations
const RECENTLY_SHOWN_KEY = "vp_recently_shown";
const MAX_RECENT_SESSIONS = 5;

const VIBES: { value: Vibe; label: string; emoji: string; comingSoon?: boolean }[] = [
  { value: "mountains",  label: "Mountains",  emoji: "\u26f0\ufe0f" },
  { value: "adventure",  label: "Adventure",  emoji: "\ud83c\udfc4" },
  { value: "historical", label: "Historical", emoji: "\ud83c\udfdb\ufe0f" },
  { value: "spiritual",  label: "Spiritual",  emoji: "\ud83d\ude4f" },
  { value: "relaxing",   label: "Chill",      emoji: "\ud83c\udf3f" },
  { value: "city",       label: "City",       emoji: "\ud83c\udf06" },
  { value: "beach",      label: "Beach",      emoji: "\ud83c\udfd6\ufe0f", comingSoon: true },
];

const TRAVELER_TYPES: { value: TravelerType; label: string; emoji: string }[] = [
  { value: "solo-male",   label: "Solo",         emoji: "\ud83d\udeb6" },
  { value: "solo-female", label: "Solo \u2640\ufe0f",   emoji: "\ud83d\udeb6\u200d\u2640\ufe0f" },
  { value: "couple",      label: "Couple",       emoji: "\ud83d\udc8c" },
  { value: "friends",     label: "Friends",      emoji: "\ud83e\udd1d" },
  { value: "family",      label: "Family",       emoji: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67" },
];

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextWeekend(): { start: string; end: string } {
  const today = new Date();
  const day = today.getDay();
  const daysToSat = (6 - day + 7) % 7 || 7;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return {
    start: sat.toISOString().split("T")[0],
    end:   sun.toISOString().split("T")[0],
  };
}

// Rec 6: Load recently shown destinations from localStorage
function loadRecentlyShown(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_SHOWN_KEY);
    if (!raw) return [];
    const sessions: string[][] = JSON.parse(raw);
    // Flatten sessions into a unique list, most recent first
    return [...new Set(sessions.flat())];
  } catch {
    return [];
  }
}

// Rec 6: Save shown destinations to localStorage after a search
export function saveShownDestinations(destinationNames: string[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RECENTLY_SHOWN_KEY);
    const sessions: string[][] = raw ? JSON.parse(raw) : [];
    sessions.unshift(destinationNames); // Most recent first
    localStorage.setItem(
      RECENTLY_SHOWN_KEY,
      JSON.stringify(sessions.slice(0, MAX_RECENT_SESSIONS))
    );
  } catch {
    // localStorage not available — no-op
  }
}

interface Props {
  onSubmit: (input: TripInput) => void;
  loading: boolean;
  prefill?: { vibe?: Vibe; budget?: number } | null;
}

export default function SearchForm({ onSubmit, loading, prefill }: Props) {
  const nextWeekend = getNextWeekend();
  const [origin,       setOrigin]       = useState("Lucknow");
  const [budget,       setBudget]       = useState(8000);
  const [startDate,    setStartDate]    = useState(nextWeekend.start);
  const [endDate,      setEndDate]      = useState(nextWeekend.end);
  const [vibe,         setVibe]         = useState<Vibe>("spiritual");
  const [travelerType, setTravelerType] = useState<TravelerType>("friends");

  // Rec 4: Destination override state
  const [destMode, setDestMode]       = useState(false);
  const [destInput, setDestInput]     = useState("");
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  // Rec 6: Recently shown
  const [recentlyShown, setRecentlyShown] = useState<string[]>([]);

  useEffect(() => {
    setRecentlyShown(loadRecentlyShown());
  }, []);

  // Apply prefill values from parent (e.g. sample card clicks)
  useEffect(() => {
    if (!prefill) return;
    if (prefill.vibe) setVibe(prefill.vibe);
    if (prefill.budget) setBudget(prefill.budget);
  }, [prefill]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nights = Math.max(
    0,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  function handleDestInputChange(val: string) {
    setDestInput(val);
    if (val.length >= 2) {
      // Show known destinations as suggestions — but allow ANY free-text destination
      const matches = KNOWN_DESTINATIONS.filter((d) =>
        d.toLowerCase().includes(val.toLowerCase())
      );
      setDestSuggestions(matches.slice(0, 6));
      setShowSuggestions(matches.length > 0);
    } else {
      setDestSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleDestSelect(dest: string) {
    setDestInput(dest);
    setShowSuggestions(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      origin,
      budget,
      startDate,
      endDate,
      vibe: vibe,
      travelers: 1,
      travelerType,
      destinationOverride: destMode && destInput.trim() ? destInput.trim() : undefined,
      recentlyShown,
      // Always send the actual vibe even in dest mode — used for alternative suggestions if dest is uncurated
    });
  }

  const canSubmit = !loading && nights >= 1 && (!destMode || destInput.trim().length >= 2);

  return (
    <div className="search-card">
      <div className="search-label">Trip Search</div>
      <form onSubmit={handleSubmit} aria-label="Plan a weekend trip">
        <div className="search-form-grid">
          {/* Origin */}
          <div className="field-group">
            <label className="field-label" htmlFor="originSelect">Leaving from</label>
            <select
              id="originSelect"
              className="field-select"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              {ORIGINS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="field-group">
            <label className="field-label" htmlFor="budgetRange">
              Budget per person&nbsp;
              <strong style={{ color: "var(--primary)" }}>
                {`\u20b9${budget.toLocaleString("en-IN")}`}
              </strong>
            </label>
            <input
              id="budgetRange"
              type="range"
              min={2000}
              max={25000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ accentColor: "var(--primary)", width: "100%", marginTop: "0.45rem" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-soft)" }}>
              <span>{"\u20b92,000"}</span>
              <span>{"\u20b925,000"}</span>
            </div>
          </div>

          {/* From date */}
          <div className="field-group">
            <label className="field-label" htmlFor="startDate">From</label>
            <input
              id="startDate"
              type="date"
              className="field-input"
              value={startDate}
              min={getTodayStr()}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* To date */}
          <div className="field-group">
            <label className="field-label" htmlFor="endDate">
              To {nights > 0 && (
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                  {"\xb7"} {nights}N/{nights + 1}D
                </span>
              )}
            </label>
            <input
              id="endDate"
              type="date"
              className="field-input"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Vibe pills — hidden in destination mode */}
        {!destMode && (
          <div className="field-group" style={{ marginBottom: "0.85rem" }}>
            <span className="field-label">Vibe</span>
            <div className="vibe-pills" role="group" aria-label="Choose a vibe">
              {VIBES.map((v) =>
                v.comingSoon ? (
                  // Rec 5: Beach pill grayed out with tooltip
                  <div
                    key={v.value}
                    title="Coming soon \u2014 adding Goa, Pondicherry, Gokarna & more"
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <button
                      type="button"
                      className="pill"
                      disabled
                      style={{
                        opacity: 0.38,
                        cursor: "not-allowed",
                        position: "relative",
                      }}
                      aria-label={`${v.label} \u2014 coming soon`}
                    >
                      {v.emoji} {v.label}
                      <span style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        fontSize: "0.5rem",
                        background: "var(--accent-teal)",
                        color: "#fff",
                        borderRadius: "4px",
                        padding: "1px 4px",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        lineHeight: 1.4,
                        pointerEvents: "none",
                      }}>SOON</span>
                    </button>
                  </div>
                ) : (
                  <button
                    key={v.value}
                    type="button"
                    className="pill"
                    data-active={vibe === v.value ? "true" : "false"}
                    data-vibe={v.value}
                    onClick={() => setVibe(v.value)}
                  >
                    {v.emoji} {v.label}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Traveler type */}
        <div className="field-group" style={{ marginBottom: "0.85rem" }}>
          <span className="field-label">{"Who\u2019s going?"}</span>
          <div className="traveler-pills" role="group" aria-label="Who is traveling">
            {TRAVELER_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                className="pill"
                data-active={travelerType === t.value ? "true" : "false"}
                onClick={() => setTravelerType(t.value)}
                aria-pressed={travelerType === t.value}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rec 4: Destination override toggle + input */}
        <div style={{ marginBottom: "0.9rem" }}>
          <button
            type="button"
            onClick={() => {
              setDestMode(!destMode);
              setDestInput("");
              setShowSuggestions(false);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: destMode ? "var(--primary)" : "var(--text-muted)",
              fontSize: "0.82rem",
              fontWeight: destMode ? 600 : 400,
              transition: "color 0.2s",
            }}
          >
            <span style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: `2px solid ${destMode ? "var(--primary)" : "var(--text-muted)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "border-color 0.2s",
            }}>
              {destMode && (
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                }} />
              )}
            </span>
            Already have a destination in mind? Get a personalised plan.
          </button>

          {destMode && (
            <div
              ref={destRef}
              style={{ position: "relative", marginTop: "0.6rem" }}
            >
              <input
                type="text"
                className="field-input"
                placeholder="e.g. Rishikesh, Varanasi, Jaipur, Udaipur, Orchha..."
                value={destInput}
                onChange={(e) => handleDestInputChange(e.target.value)}
                onFocus={() => destInput.length >= 2 && setShowSuggestions(true)}
                autoComplete="off"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              {showSuggestions && destSuggestions.length > 0 && (
                <ul style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  listStyle: "none",
                  margin: 0,
                  padding: "0.4rem 0",
                  zIndex: 50,
                  maxHeight: "220px",
                  overflowY: "auto",
                }}>
                  {destSuggestions.map((d) => (
                    <li
                      key={d}
                      onClick={() => handleDestSelect(d)}
                      style={{
                        padding: "0.55rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        color: "var(--text-main)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                {KNOWN_DESTINATIONS.some((d) => d.toLowerCase() === destInput.trim().toLowerCase())
                  ? "\u2705 Verified destination \u2014 real train routes, curated local intel, no estimates."
                  : destInput.trim().length >= 2
                  ? "\u26a0\ufe0f Not in our verified network yet \u2014 we\u2019ll suggest the closest alternatives."
                  : "Only verified destinations get a full itinerary. We\u2019ll suggest alternatives if yours isn\u2019t listed."
                }
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="search-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
            style={{ width: "100%", padding: "0.7rem 1.5rem", fontSize: "0.92rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {destMode ? "Building your personalised plan\u2026" : "Building your itineraries\u2026"}
              </span>
            ) : (
              destMode
                ? `Plan my ${destInput.trim() || "trip"} \u2192`
                : "Give me 3 options \u2192"
            )}
          </button>
        </div>

        <p className="search-hint">
          {destMode
            ? "Musafir will give you Value, Balanced, and Comfort plans for your destination."
            : "Results show 3 trade-offs across budget, comfort & timing."
          }
        </p>
      </form>
    </div>
  );
}
