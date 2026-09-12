import { useEffect, useState } from "react";
import type { ProductSuggestion, SuggestionsResponse } from "@/lib/types";

// One in-flight/settled request per page load. The header renders two
// SearchBars (desktop + mobile slots), and both should share a single fetch.
let indexPromise: Promise<ProductSuggestion[]> | null = null;

async function fetchSuggestionIndex(): Promise<ProductSuggestion[]> {
  const response = await fetch("/api/search/suggestions");
  if (!response.ok) throw new Error(`Suggestions request failed: ${response.status}`);
  const body: SuggestionsResponse = await response.json();
  return body.suggestions;
}

function loadSuggestionIndex(): Promise<ProductSuggestion[]> {
  if (!indexPromise) {
    indexPromise = fetchSuggestionIndex().catch((error: unknown) => {
      // Forget the failure so the next focus retries instead of staying broken.
      indexPromise = null;
      throw error;
    });
  }
  return indexPromise;
}

/**
 * Product rows for the search dropdown, or `null` until they have loaded.
 * Nothing is fetched until `enabled` is true (first focus of the search box).
 * A failed fetch leaves the value `null`: the dropdown simply never opens and
 * submitting the form still searches server-side.
 */
export function useSuggestionIndex(enabled: boolean): ProductSuggestion[] | null {
  const [index, setIndex] = useState<ProductSuggestion[] | null>(null);

  useEffect(() => {
    if (!enabled || index !== null) return;

    let cancelled = false;
    loadSuggestionIndex()
      .then((rows) => {
        if (!cancelled) setIndex(rows);
      })
      .catch(() => {
        // Stay null; see the doc comment above.
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, index]);

  return index;
}
