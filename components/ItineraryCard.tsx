"use client";

import type { GeneratedItinerary } from "@/types";

const PROFILE_CONFIG = {
  value: {
    badge: "badge-value",
    badgeLabel: "Best Value",
    gradient: "grad-budget",
    tradeoffClass: "tradeoff-teal",
    tradeoffIcon: "💰",
    budgetColor: "var(--accent-teal)",
  },
  balanced: {
    badge: "badge-best",
    badgeLabel: "Best Match",
    gradient: "grad-hills",
    tradeoffClass: "tradeoff-blue",
    tradeoffIcon: "💡",
    budgetColor: "var(--primary)",
  },
  comfort: {
    badge: "badge-comfort",
    badgeLabel: "Comfort",
    gradient: "grad-comfort",
    tradeoffClass: "tradeoff-warm",
    tradeoffIcon: "✂️",
    budgetColor: "var(--accent-warm)",
  },
} as const;

const VIBE_GRADIENTS: Record<string, string> = {
  mountains:  "grad-hills",
  beach:      "grad-budget",
  historical: "grad-comfort",
  adventure:  "grad-hills",
  spiritual:  "grad-spiritual",
  relaxing:   "grad-purple",
  city:       "grad-city",
};

interface Props {
  itinerary: GeneratedItinerary;
  index: number;
  vibe: string;
}

export default function ItineraryCard({ itinerary, index, vibe }: Props) {
  const cfg = PROFILE_CONFIG[itinerary.profile];
  // For gradient: use vibe for "balanced" (best match), profile-specific for others
  const gradient =
    itinerary.profile === "balanced"
      ? (VIBE_GRADIENTS[vibe] ?? "grad-hills")
      : cfg.gradient;

  const totalSpent =
    itinerary.allocation.transport +
    itinerary.allocation.accommodation +
    itinerary.allocation.food +
    itinerary.allocation.activities;

  const utilizationPct = itinerary.allocation.utilizationPct;

  const dayPlanLines = itinerary.dayPlan
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const transportDetail = itinerary.transport.train
    ? `${itinerary.transport.train.trainName} · ${itinerary.transport.train.departure}–${itinerary.transport.train.arrival}`
    : itinerary.transport.bus
    ? `${itinerary.transport.bus.operatorType} · ~${itinerary.transport.bus.durationHours}h`
    : "Transport details";

  return (
    <article
      className={`itinerary-card fade-up`}
      style={{ animationDelay: `${index * 0.12}s`, animationFillMode: "both" }}
      data-featured={itinerary.profile === "balanced" ? "true" : "false"}
    >
      {/* Image / gradient header */}
      <div className="card-image">
        <div className={`card-image-gradient ${gradient}`}>
          <span className="dest-name">{itinerary.destination.name}</span>
        </div>
        <span className={`card-badge ${cfg.badge}`}>{cfg.badgeLabel}</span>
      </div>

      <div className="card-body">
        {/* Title + spend */}
        <div className="card-header-row">
          <h3 className="card-title">{itinerary.headline}</h3>
          <div
            className="budget-number"
            style={{ color: utilizationPct > 100 ? "var(--accent-warm)" : cfg.budgetColor }}
          >
            ₹{totalSpent.toLocaleString("en-IN")}<br />{utilizationPct}%
          </div>
        </div>

        {/* Budget bar */}
        <div className="budget-line" aria-label="Budget utilization">
          <span style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Budget used</span>
          <div className="budget-bar-shell">
            <div
              className="budget-bar-fill"
              style={{
                width: `${Math.min(utilizationPct, 100)}%`,
                ...(utilizationPct > 100
                  ? { background: "linear-gradient(90deg, var(--accent-warm), #FFB547)" }
                  : {}),
              }}
            />
          </div>
        </div>

        {/* Narrative */}
        {itinerary.narrative && (
          <p className="card-desc">{itinerary.narrative}</p>
        )}

        {/* Route pills */}
        <div className="route-pills">
          <span className="route-pill">
            <span className="route-dot" />
            {transportDetail}
          </span>
          {itinerary.transport.train?.overnight && (
            <span className="route-pill">
              <span className="route-dot" />
              Overnight · saves a hotel night
            </span>
          )}
          <span className="route-pill">
            <span className="route-dot" />
            {itinerary.nights}N in {itinerary.allocation.accommodationType}
          </span>
        </div>

        {/* Day plan */}
        {dayPlanLines.length > 0 && (
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
            {dayPlanLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Activities */}
        <div className="route-pills">
          {itinerary.activities.map((a, i) => (
            <span key={i} className="route-pill">{a}</span>
          ))}
        </div>

        {/* Tradeoff */}
        {itinerary.tradeoffs.length > 0 && (
          <div className={`tradeoff-box ${cfg.tradeoffClass}`}>
            <span className="tradeoff-icon">{cfg.tradeoffIcon}</span>
            <span>{itinerary.tradeoffs[0]}</span>
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={() =>
                window.open("https://www.irctc.co.in/nget/train-search", "_blank")
              }
            >
              Book on IRCTC →
            </button>
          </div>
          <div className="card-footnote">
            Prices estimated · verify before booking
          </div>
        </div>
      </div>
    </article>
  );
}
