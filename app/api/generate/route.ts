/**
 * POST /api/generate
 *
 * Receives TripInput, runs the full pipeline, returns 3 GeneratedItineraries.
 *
 * GOVERNANCE:
 * - EDGE RUNTIME: groq-sdk uses fetch() only — safe for CF Pages + nodejs_compat
 * - ENV VARS FAIL LOUD: GROQ_API_KEY checked in groq-client.ts
 * - Supports both DISCOVERY mode (vibe-based) and DESTINATION mode (destinationOverride)
 */

export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, GenerateResponse, GenerateError, Vibe } from "@/types";
import { buildItineraries } from "@/lib/itinerary-builder";

const VALID_VIBES: Vibe[] = [
  "mountains", "beach", "historical", "adventure", "spiritual", "relaxing", "city",
];

const SUPPORTED_ORIGINS = [
  "Kanpur", "Lucknow", "Varanasi", "Jaipur", "Indore",
  "Nagpur", "Bhopal", "Patna", "Agra", "Prayagraj",
];

function validateInput(body: unknown): GenerateRequest | GenerateError {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object.", code: "INVALID_INPUT" };
  }

  const b = body as Record<string, unknown>;

  // Origin
  if (!b.origin || typeof b.origin !== "string") {
    return { error: "origin is required (e.g. 'Lucknow').", code: "INVALID_INPUT" };
  }
  const origin = (b.origin as string).trim();
  const matchedOrigin = SUPPORTED_ORIGINS.find(
    (o) => o.toLowerCase() === origin.toLowerCase()
  );
  if (!matchedOrigin) {
    return {
      error: `Origin '${origin}' not yet supported. Available: ${SUPPORTED_ORIGINS.join(", ")}.`,
      code: "INVALID_INPUT",
    };
  }

  // Budget
  if (!b.budget || typeof b.budget !== "number" || b.budget < 2000) {
    return { error: "budget must be a number \u2265 \u20b92,000.", code: "INVALID_INPUT" };
  }

  // Vibe — only required when NOT in destination override mode
  const hasDestOverride = typeof b.destinationOverride === "string" && (b.destinationOverride as string).trim().length > 0;
  if (!hasDestOverride) {
    if (!b.vibe || !VALID_VIBES.includes(b.vibe as Vibe)) {
      return {
        error: `vibe must be one of: ${VALID_VIBES.join(", ")}.`,
        code: "INVALID_INPUT",
      };
    }
  }

  // Dates
  if (!b.startDate || !b.endDate) {
    return { error: "startDate and endDate are required (YYYY-MM-DD).", code: "INVALID_INPUT" };
  }
  const start = new Date(b.startDate as string);
  const end = new Date(b.endDate as string);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { error: "Invalid date format. Use YYYY-MM-DD.", code: "INVALID_INPUT" };
  }
  if (end <= start) {
    return { error: "endDate must be after startDate.", code: "INVALID_INPUT" };
  }

  // recentlyShown (optional array of strings for freshness scoring)
  const recentlyShown =
    Array.isArray(b.recentlyShown)
      ? (b.recentlyShown as unknown[]).filter((s) => typeof s === "string") as string[]
      : [];

  return {
    origin: matchedOrigin,
    budget: b.budget as number,
    startDate: b.startDate as string,
    endDate: b.endDate as string,
    vibe: (b.vibe as Vibe) ?? "relaxing",
    travelers: typeof b.travelers === "number" ? b.travelers : 1,
    destinationOverride: hasDestOverride
      ? (b.destinationOverride as string).trim()
      : undefined,
    recentlyShown,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<GenerateError>(
      { error: "Invalid JSON body.", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  const validated = validateInput(body);
  if ("code" in validated && validated.code === "INVALID_INPUT") {
    return NextResponse.json<GenerateError>(validated, { status: 400 });
  }

  const input = validated as GenerateRequest;
  const mode = input.destinationOverride ? "destination" : "discovery";

  try {
    const itineraries = await buildItineraries(input);

    const response: GenerateResponse = {
      itineraries,
      origin: input.origin,
      generatedAt: new Date().toISOString(),
      provider: "groq",
      mode,
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("GROQ_API_KEY")) {
      return NextResponse.json<GenerateError>(
        { error: message, code: "MISSING_KEY" },
        { status: 500 }
      );
    }

    if (
      message.includes("No routes found") ||
      message.includes("Budget too tight") ||
      message.includes("No direct transport") ||
      message.includes("doesn\u2019t appear to be a travel destination")
    ) {
      return NextResponse.json<GenerateError>(
        { error: message, code: "NO_ROUTES" },
        { status: 422 }
      );
    }

    console.error("[/api/generate] Unhandled error:", err);
    return NextResponse.json<GenerateError>(
      { error: "Itinerary generation failed. Please try again.", code: "LLM_ERROR" },
      { status: 500 }
    );
  }
}
