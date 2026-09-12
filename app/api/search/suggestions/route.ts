import { NextResponse } from "next/server";
import { getSuggestionIndex } from "@/lib/products";
import type { SuggestionsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/search/suggestions — the whole catalog as lightweight rows. The
// header fetches this once and filters in the browser as the user types, so
// the response is safe to cache aggressively; each deploy purges the CDN copy.
export async function GET() {
  const suggestions = await getSuggestionIndex();

  const body: SuggestionsResponse = { suggestions };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
