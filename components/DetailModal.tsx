"use client";

import { useEffect, useRef } from "react";
import type { GeneratedItinerary } from "@/types";

interface Props {
  itinerary: GeneratedItinerary;
  onClose: () => void;
}

const PROFILE_CONFIG = {
  value:    { label: "Best Value",  color: "var(--accent-teal)",  icon: "💰" },
  balanced: { label: "Best Match",  color: "var(--primary)",       icon: "✨" },
  comfort:  { label: "Comfort",     color: "var(--accent-warm)",   icon: "🏨" },
} as const;

export default function DetailModal({ itinerary, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cfg = PROFILE_CONFIG[itinerary.profile];
  const intel = itinerary.localIntelligence;

  const { transport: tCost, accommodation: aCost, food: fCost, activities: actCost } = itinerary.allocation;
  const totalSpent = tCost + aCost + fCost + actCost;

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  const train = itinerary.transport.train;

  return (
    <div
      ref={overlayRef}
      className="detail-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Full plan for ${itinerary.destination.name}`}
    >
      <div className="detail-sheet">

        {/* ── STICKY HEADER ── */}
        <div className="detail-header">
          <div className="detail-header-left">
            <span className="detail-dest">{itinerary.destination.name}</span>
            {itinerary.destination.state && itinerary.destination.state !== "India" && (
              <span className="detail-state">{itinerary.destination.state}</span>
            )}
          </div>
          <div className="detail-header-right">
            <span className="detail-profile-badge" style={{ background: cfg.color }}>
              {cfg.icon} {cfg.label}
            </span>
            {itinerary.isAIEstimated && (
              <span className="detail-ai-badge">{"≈ AI-estimated"}</span>
            )}
            <button
              className="detail-close-btn"
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              {"✕"}
            </button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="detail-body">

          {/* ── Budget summary strip ── */}
          <div className="detail-budget-strip">
            <div className="detail-budget-item">
              <span className="detail-budget-icon">{"🚂"}</span>
              <div>
                <div className="detail-budget-label">Transport</div>
                <div className="detail-budget-val">{`\u20b9${tCost.toLocaleString("en-IN")}`}</div>
              </div>
            </div>
            <div className="detail-budget-item">
              <span className="detail-budget-icon">{"🏨"}</span>
              <div>
                <div className="detail-budget-label">Stay ({itinerary.nights}N)</div>
                <div className="detail-budget-val">{`\u20b9${aCost.toLocaleString("en-IN")}`}</div>
              </div>
            </div>
            <div className="detail-budget-item">
              <span className="detail-budget-icon">{"🍜"}</span>
              <div>
                <div className="detail-budget-label">Food</div>
                <div className="detail-budget-val">{`\u20b9${fCost.toLocaleString("en-IN")}`}</div>
              </div>
            </div>
            <div className="detail-budget-item">
              <span className="detail-budget-icon">{"🎯"}</span>
              <div>
                <div className="detail-budget-label">Activities</div>
                <div className="detail-budget-val">{`\u20b9${actCost.toLocaleString("en-IN")}`}</div>
              </div>
            </div>
            <div className="detail-budget-total">
              <div className="detail-budget-label">Total</div>
              <div className="detail-budget-total-val" style={{ color: cfg.color }}>
                {itinerary.isAIEstimated ? "~" : ""}{`\u20b9${totalSpent.toLocaleString("en-IN")}`}
              </div>
              <div className="detail-budget-pct">{itinerary.allocation.utilizationPct}% of budget</div>
            </div>
          </div>

          {/* Transport info */}
          <div className="detail-transport-row">
            {train ? (
              <>
                <span className="detail-transport-pill">
                  {"🚂"} {train.trainName} {"\u00b7"} {train.departure}{"\u2013"}{train.arrival}
                  {train.overnight && " \u00b7 overnight"}
                </span>
                <span className="detail-transport-pill">
                  {itinerary.allocation.trainClass.toUpperCase()} class
                </span>
                {train.frequency !== "Daily" && (
                  <span className="detail-transport-pill" style={{ color: "var(--accent-warm)" }}>
                    {"⚠️"} {train.frequency}
                  </span>
                )}
              </>
            ) : itinerary.isAIEstimated && itinerary.allocation.tradeoffNote ? (
              <span className="detail-transport-pill">
                {"🚌"} {itinerary.allocation.tradeoffNote}
              </span>
            ) : (
              <span className="detail-transport-pill">
                {"🚌"} Bus route
              </span>
            )}
            <span className="detail-transport-pill">
              {"🏨"} {itinerary.allocation.accommodationType} {"\u00b7"} {itinerary.nights} night{itinerary.nights > 1 ? "s" : ""}
            </span>
          </div>

          {/* Live alert */}
          {itinerary.liveAlert && (
            <div className="detail-live-alert">
              <span className="live-alert-badge">{"🔴 Live Check"}</span>
              <span>{itinerary.liveAlert.text}</span>
              {itinerary.liveAlert.source && (
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  via {itinerary.liveAlert.source}
                </span>
              )}
            </div>
          )}

          {/* Monsoon warning */}
          {itinerary.monsoonWarning && (
            <div className="monsoon-warning" style={{ margin: "0 0 1rem" }}>
              <span className="monsoon-warning-icon">{"⚠️"}</span>
              <span>{itinerary.monsoonWarning}</span>
            </div>
          )}

          {/* Narrative */}
          {itinerary.narrative && (
            <div className="detail-narrative">
              <p>{itinerary.narrative}</p>
            </div>
          )}

          {/* ── DAY-BY-DAY PLAN ── */}
          <section className="detail-section">
            <h2 className="detail-section-title">{"🗺️ Day-by-Day Itinerary"}</h2>
            {itinerary.detailedDays.length > 0 ? (
              itinerary.detailedDays.map((day) => (
                <div key={day.day} className="detail-day-card">
                  <div className="detail-day-header">
                    <span className="detail-day-num">Day {day.day}</span>
                    <span className="detail-day-theme">{day.theme}</span>
                  </div>

                  <div className="detail-day-sections">
                    <div className="detail-day-block">
                      <span className="detail-day-block-icon">{"🌅"}</span>
                      <div>
                        <div className="detail-day-block-label">Morning</div>
                        <p className="detail-day-block-text">{day.morning}</p>
                      </div>
                    </div>
                    <div className="detail-day-block">
                      <span className="detail-day-block-icon">{"☀️"}</span>
                      <div>
                        <div className="detail-day-block-label">Afternoon</div>
                        <p className="detail-day-block-text">{day.afternoon}</p>
                      </div>
                    </div>
                    <div className="detail-day-block">
                      <span className="detail-day-block-icon">{"🌙"}</span>
                      <div>
                        <div className="detail-day-block-label">Evening</div>
                        <p className="detail-day-block-text">{day.evening}</p>
                      </div>
                    </div>
                  </div>

                  {/* Eat row */}
                  <div className="detail-eat-row">
                    <span className="detail-eat-icon">{"🍽️"}</span>
                    <span className="detail-eat-text">{day.eat}</span>
                  </div>

                  {/* Hidden gem */}
                  {day.hiddenGem && (
                    <div className="detail-gem-row">
                      <span className="detail-gem-icon">{"💎"}</span>
                      <span className="detail-gem-text">{day.hiddenGem}</span>
                    </div>
                  )}

                  {/* Tip */}
                  {day.tip && (
                    <div className="detail-tip-row">
                      <span className="detail-tip-icon">{"💡"}</span>
                      <span className="detail-tip-text">{day.tip}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              itinerary.dayPlan.split("\n").filter(Boolean).map((line, i) => (
                <div key={i} className="detail-day-card">
                  <p style={{ margin: 0, fontSize: "0.88rem" }}>{line}</p>
                </div>
              ))
            )}
          </section>

          {/* ── LOCAL INTELLIGENCE (for catalog destinations) ── */}
          {intel && (
            <>
              {intel.mustEat.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🍽️ Must Eat"}</h2>
                  <div className="detail-intel-grid">
                    {intel.mustEat.map((f, i) => (
                      <div key={i} className="detail-intel-card">
                        <div className="detail-intel-name">{f.name}</div>
                        <div className="detail-intel-area">{f.area}</div>
                        {f.knownFor && <div className="detail-intel-sub">{f.knownFor}</div>}
                        <div className="detail-intel-price">{f.price}</div>
                        {f.tip && <div className="detail-intel-tip">{"💡 "}{f.tip}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {intel.streetFood.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🌮 Street Food"}</h2>
                  <div className="detail-intel-grid">
                    {intel.streetFood.map((f, i) => (
                      <div key={i} className="detail-intel-card">
                        <div className="detail-intel-name">{f.name}</div>
                        <div className="detail-intel-area">{f.area}</div>
                        {f.knownFor && <div className="detail-intel-sub">{f.knownFor}</div>}
                        <div className="detail-intel-price">{f.price}</div>
                        {f.tip && <div className="detail-intel-tip">{"💡 "}{f.tip}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {intel.hiddenGems.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"💎 Hidden Gems"}</h2>
                  {intel.hiddenGems.map((g, i) => (
                    <div key={i} className="detail-gem-card">
                      <div className="detail-gem-card-name">{g.name}</div>
                      <div className="detail-gem-card-what">{g.what}</div>
                      <div className="detail-gem-card-why">{g.why}</div>
                      {g.bestTime && (
                        <div className="detail-gem-card-time">{"🕒 Best time: "}{g.bestTime}</div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {intel.timingTips.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"⏰ Timing Tips"}</h2>
                  <div className="detail-tips-list">
                    {intel.timingTips.map((t, i) => (
                      <div key={i} className="detail-timing-row">
                        <strong>{t.activity}</strong>
                        {" \u2014 Best: "}{t.bestTime}
                        {t.tip && <>. {t.tip}</>}
                        {t.avoidTime && (
                          <span style={{ color: "var(--accent-warm)" }}>{" Avoid: "}{t.avoidTime}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {intel.shopping.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🛍️ Shopping"}</h2>
                  <div className="detail-intel-grid">
                    {intel.shopping.map((s, i) => (
                      <div key={i} className="detail-intel-card">
                        <div className="detail-intel-name">{s.what}</div>
                        <div className="detail-intel-area">{s.where}</div>
                        <div className="detail-intel-price">{s.priceRange}</div>
                        {s.tip && <div className="detail-intel-tip">{"💡 "}{s.tip}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {intel.knowBeforeYouGo.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🧳 Know Before You Go"}</h2>
                  <ul className="detail-kbyg-list">
                    {intel.knowBeforeYouGo.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </section>
              )}

              {intel.localTransport && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🚌 Getting Around"}</h2>
                  <p className="detail-local-transport">{intel.localTransport}</p>
                </section>
              )}

              {intel.stayAreas && intel.stayAreas.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"🏨 Where to Stay"}</h2>
                  <div className="detail-intel-grid">
                    {intel.stayAreas.map((a, i) => (
                      <div key={i} className="detail-intel-card">
                        <div className="detail-intel-name">{a.area}</div>
                        <div className="detail-intel-sub">{a.why}</div>
                        <div className="detail-intel-tip">{"Best for: "}{a.bestFor}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {intel.avoid.length > 0 && (
                <section className="detail-section">
                  <h2 className="detail-section-title">{"⚠️ Tourist Traps to Avoid"}</h2>
                  <ul className="detail-avoid-list">
                    {intel.avoid.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {/* ── Tradeoffs ── */}
          {itinerary.tradeoffs.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">
                {"⚖️ "}{itinerary.profile === "value" ? "Smart Save" : itinerary.profile === "comfort" ? "Pro Tips" : "Smart Move"}
              </h2>
              <div className="detail-tradeoffs">
                {itinerary.tradeoffs.map((t, i) => (
                  <div key={i} className="detail-tradeoff-item">
                    <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.icon}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Estimated disclaimer */}
          {itinerary.isAIEstimated && (
            <div className="detail-ai-disclaimer">
              <strong>{"≈ AI-estimated itinerary"}</strong>
              <p>
                {itinerary.destination.name} is not yet in our verified database. All transport costs,
                accommodation prices, and budget figures are AI estimates based on typical Indian travel prices
                (2025). Verify actual fares on{" "}
                <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">IRCTC</a>
                {" "}and{" "}
                <a href="https://www.redbus.in" target="_blank" rel="noopener noreferrer">RedBus</a>
                {" "}before booking.
              </p>
            </div>
          )}

          {/* ── Footer CTAs ── */}
          <div className="detail-footer">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => window.open("https://www.irctc.co.in/nget/train-search", "_blank")}
            >
              {"Book on IRCTC \u2192"}
            </button>
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Back to results
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
