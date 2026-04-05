"use client";

import type { GeneratedItinerary } from "@/types";

const PROFILE_CONFIG = {
  value: {
    badge: "badge-value",
    badgeLabel: "Best Value",
    gradient: "grad-budget",
    tradeoffClass: "tradeoff-teal",
    tradeoffIcon: "\ud83d\udcb0",
    tradeoffLabel: "Smart Save",
    budgetColor: "var(--accent-teal)",
  },
  balanced: {
    badge: "badge-best",
    badgeLabel: "Best Match",
    gradient: "grad-hills",
    tradeoffClass: "tradeoff-blue",
    tradeoffIcon: "\ud83d\udca1",
    tradeoffLabel: "Smart Move",
    budgetColor: "var(--primary)",
  },
  comfort: {
    badge: "badge-comfort",
    badgeLabel: "Comfort",
    gradient: "grad-comfort",
    tradeoffClass: "tradeoff-warm",
    tradeoffIcon: "\u2702\ufe0f",
    tradeoffLabel: "Pro Tip",
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
  const gradient =
    itinerary.profile === "balanced"
      ? (VIBE_GRADIENTS[vibe] ?? "grad-hills")
      : cfg.gradient;

  const { transport: tCost, accommodation: aCost, food: fCost, activities: actCost } = itinerary.allocation;
  const totalSpent = tCost + aCost + fCost + actCost;
  const utilizationPct = itinerary.allocation.utilizationPct;

  // Stacked bar segment widths as percentage of totalSpent
  const tPct   = totalSpent > 0 ? Math.round((tCost   / totalSpent) * 100) : 0;
  const aPct   = totalSpent > 0 ? Math.round((aCost   / totalSpent) * 100) : 0;
  const fPct   = totalSpent > 0 ? Math.round((fCost   / totalSpent) * 100) : 0;
  const actPct = totalSpent > 0 ? Math.round((actCost / totalSpent) * 100) : 0;

  const dayPlanLines = itinerary.dayPlan
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const train = itinerary.transport.train;
  const bus   = itinerary.transport.bus;

  const transportDetail = train
    ? `${train.trainName} \xb7 ${train.departure}\u2013${train.arrival}`
    : bus
    ? `${bus.operatorType} \xb7 ~${bus.durationHours}h`
    : "Transport details";

  const frequencyLabel = train?.frequency ?? null;
  const isNotDaily = frequencyLabel && frequencyLabel !== "Daily";

  // Structured last mile per profile
  const lmd = itinerary.transport.lastMileData;
  const lastMileDisplay = lmd
    ? (itinerary.profile === "comfort" ? lmd.comfort : lmd.budget)
    : itinerary.transport.lastMile;

  return (
    <article
      className="itinerary-card fade-up"
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
            {`\u20b9${totalSpent.toLocaleString("en-IN")}`}<br />{utilizationPct}%
          </div>
        </div>

        {/* Stacked budget bar */}
        <div aria-label="Budget breakdown">
          <div
            className="budget-stack"
            title={`Transport \u20b9${tCost.toLocaleString("en-IN")} \xb7 Stay \u20b9${aCost.toLocaleString("en-IN")} \xb7 Food \u20b9${fCost.toLocaleString("en-IN")} \xb7 Activities \u20b9${actCost.toLocaleString("en-IN")}`}
          >
            {tPct   > 0 && <div className="budget-stack-seg bseg-transport"   style={{ width: `${tPct}%`   }} />}
            {aPct   > 0 && <div className="budget-stack-seg bseg-stay"        style={{ width: `${aPct}%`   }} />}
            {fPct   > 0 && <div className="budget-stack-seg bseg-food"        style={{ width: `${fPct}%`   }} />}
            {actPct > 0 && <div className="budget-stack-seg bseg-activities"  style={{ width: `${actPct}%` }} />}
          </div>
          <div className="budget-stack-legend">
            <span className="bleg"><span className="bleg-dot" style={{ background: "var(--primary)" }} />{`\ud83d\ude82 \u20b9${tCost.toLocaleString("en-IN")}`}</span>
            <span className="bleg"><span className="bleg-dot" style={{ background: "var(--accent-warm)" }} />{`\ud83c\udfe8 \u20b9${aCost.toLocaleString("en-IN")}`}</span>
            <span className="bleg"><span className="bleg-dot" style={{ background: "var(--accent-teal)" }} />{`\ud83c\udf5c \u20b9${fCost.toLocaleString("en-IN")}`}</span>
            <span className="bleg"><span className="bleg-dot" style={{ background: "var(--accent-gold)" }} />{`\ud83c\udfaf \u20b9${actCost.toLocaleString("en-IN")}`}</span>
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
          {isNotDaily && (
            <span className={`freq-pill not-daily`} title="This train doesn\u2019t run daily \u2014 check your travel date">
              {"\u26a0\ufe0f"} {frequencyLabel}
            </span>
          )}
          {frequencyLabel === "Daily" && (
            <span className="freq-pill">{"\u2705 Daily"}</span>
          )}
          {train?.overnight && (
            <span className="route-pill">
              <span className="route-dot" />
              {"Overnight \xb7 saves a hotel night"}
            </span>
          )}
          <span className="route-pill">
            <span className="route-dot" />
            {itinerary.nights}N in {itinerary.allocation.accommodationType}
          </span>
        </div>

        {/* Structured last mile */}
        {lmd && (
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-soft)", marginBottom: "0.2rem" }}>
              {`Station \u2192 ${itinerary.destination.name} (${lmd.duration})`}
            </div>
            <div className="last-mile-row">
              <span className="last-mile-chip budget-chip">{`\ud83d\udeb2 ${lmd.budget}`}</span>
              <span className="last-mile-chip comfort-chip">{`\ud83d\ude95 ${lmd.comfort}`}</span>
            </div>
          </div>
        )}

        {/* Monsoon warning */}
        {itinerary.monsoonWarning && (
          <div className="monsoon-warning">
            <span className="monsoon-warning-icon">{"\u26a0\ufe0f"}</span>
            <span>{itinerary.monsoonWarning}</span>
          </div>
        )}

        {/* Live alert — Gemini Search Grounding (only shown when an alert exists) */}
        {itinerary.liveAlert && (
          <div className="live-alert">
            <span className="live-alert-badge">{"🔴 Live Check"}</span>
            <span className="live-alert-text">{itinerary.liveAlert.text}</span>
            {itinerary.liveAlert.source && (
              <span className="live-alert-source">{"via "}{itinerary.liveAlert.source}</span>
            )}
          </div>
        )}

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

        {/* Tradeoff — with "Smart Move / Smart Save / Pro Tip" label */}
        {itinerary.tradeoffs.length > 0 && (
          <div className={`tradeoff-box ${cfg.tradeoffClass}`}>
            <span className="tradeoff-icon">{cfg.tradeoffIcon}</span>
            <div>
              <div className="tradeoff-label">{cfg.tradeoffLabel}</div>
              <span>{itinerary.tradeoffs[0]}</span>
            </div>
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
              {"Book on IRCTC \u2192"}
            </button>
          </div>
          <div className="card-footnote">
            {"Prices estimated \xb7 verify before booking"}
          </div>
        </div>
      </div>
    </article>
  );
}
