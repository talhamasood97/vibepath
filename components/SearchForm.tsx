"use client";

import { useState } from "react";
import type { TripInput, Vibe } from "@/types";

const ORIGINS = [
  "Kanpur", "Lucknow", "Varanasi", "Jaipur", "Indore",
  "Nagpur", "Bhopal", "Patna", "Agra", "Prayagraj",
];

const VIBES: { value: Vibe; label: string; emoji: string }[] = [
  { value: "mountains",  label: "Mountains",  emoji: "⛰️" },
  { value: "adventure",  label: "Adventure",  emoji: "🏄" },
  { value: "historical", label: "Historical", emoji: "🏛️" },
  { value: "spiritual",  label: "Spiritual",  emoji: "🙏" },
  { value: "relaxing",   label: "Chill",      emoji: "🌿" },
  { value: "city",       label: "City",       emoji: "🌆" },
  { value: "beach",      label: "Beach",      emoji: "🏖️" },
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

interface Props {
  onSubmit: (input: TripInput) => void;
  loading: boolean;
}

export default function SearchForm({ onSubmit, loading }: Props) {
  const nextWeekend = getNextWeekend();
  const [origin,    setOrigin]    = useState("Kanpur");
  const [budget,    setBudget]    = useState(8000);
  const [startDate, setStartDate] = useState(nextWeekend.start);
  const [endDate,   setEndDate]   = useState(nextWeekend.end);
  const [vibe,      setVibe]      = useState<Vibe>("adventure");

  const nights = Math.max(
    0,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ origin, budget, startDate, endDate, vibe, travelers: 1 });
  }

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
              Budget per person &nbsp;
              <strong style={{ color: "var(--primary)" }}>
                ₹{budget.toLocaleString("en-IN")}
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
              <span>₹2,000</span>
              <span>₹25,000</span>
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
                  · {nights}N/{nights + 1}D
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

        {/* Vibe pills — full width */}
        <div className="field-group" style={{ marginBottom: "0.85rem" }}>
          <span className="field-label">Vibe</span>
          <div className="vibe-pills" role="group" aria-label="Choose a vibe">
            {VIBES.map((v) => (
              <button
                key={v.value}
                type="button"
                className="pill"
                data-active={vibe === v.value ? "true" : "false"}
                onClick={() => setVibe(v.value)}
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="search-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || nights < 1}
            style={{ width: "100%", padding: "0.7rem 1.5rem", fontSize: "0.92rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Building your itineraries…
              </span>
            ) : (
              "Give me 3 options →"
            )}
          </button>
        </div>

        <p className="search-hint">
          Results show 3 trade-offs across budget, comfort &amp; timing.
        </p>
      </form>
    </div>
  );
}
