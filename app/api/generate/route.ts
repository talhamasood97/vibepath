/**
 * POST /api/generate
 *
 * Receives TripInput, runs the full pipeline, returns 3 GeneratedItineraries.
 *
 * GOVERNANCE rules applied:
 * - NODE RUNTIME: native Groq SDK + file system access require Node, not Edge
 * - ENV VARS FAIL LOUD: GROQ_API_KEY checked in groq-client.ts — will throw 500 with clear message
 * - VERIFY BEFORE CODING: Groq free tier confirmed (14,400 RPD), static data confirmed reliable
 */

// CLOUDFLARE PAGES: groq-sdk uses fetch() only — no native binaries. Safe for Edge + nodejs_compat.
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

  if (!b.origin || typeof b.origin !== "string") {
    return { error: "origin is required (e.g. 'Kanpur').", code: "INVALID_INPUT" };
  }

  // Normalise to title case and validate
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

  if (!b.budget || typeof b.budget !== "number" || b.budget < 2000) {
    return {
      error: "budget must be a number ≥ ₹2,000.",
      code: "INVALID_INPUT",
    };
  }

  if (!b.vibe || !VALID_VIBES.includes(b.vibe as Vibe)) {
    return {
      error: `vibe must be one of: ${VALID_VIBES.join(", ")}.`,
      code: "INVALID_INPUT",
    };
  }

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

  return {
    origin: matchedOrigin,
    budget: b.budget as number,
    startDate: b.startDate as string,
    endDate: b.endDate as string,
    vibe: b.vibe as Vibe,
    travelers: typeof b.travelers === "number" ? b.travelers : 1,
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

  try {
    const itineraries = await buildItineraries(input);

    const response: GenerateResponse = {
      itineraries,
      origin: input.origin,
      generatedAt: new Date().toISOString(),
      provider: "groq",
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // GROQ_API_KEY missing — explicit 500 with clear message (not silent undefined)
    if (message.includes("GROQ_API_KEY")) {
      return NextResponse.json<GenerateError>(
        { error: message, code: "MISSING_KEY" },
        { status: 500 }
      );
    }

    // No routes found
    if (message.includes("No routes found") || message.includes("Budget too tight")) {
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
