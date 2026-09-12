import type { ProductSuggestion } from "./types";

// Header search autocomplete. The whole (small) catalog is fetched once and
// filtered here in the browser, so no Prisma imports in this file.

export const MAX_SUGGESTIONS = 8;

/**
 * Products whose name contains `query`, case-insensitively. Names that start
 * with the query come first; within each group the index order is kept.
 * Plain substring matching only — relevance ranking is out of scope (S3).
 */
export function matchSuggestions(
  index: ProductSuggestion[],
  query: string,
  category: string,
  limit = MAX_SUGGESTIONS,
): ProductSuggestion[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const startsWith: ProductSuggestion[] = [];
  const contains: ProductSuggestion[] = [];

  for (const product of index) {
    if (category && product.category !== category) continue;

    const position = product.name.toLowerCase().indexOf(needle);
    if (position === 0) startsWith.push(product);
    else if (position > 0) contains.push(product);

    if (startsWith.length >= limit) break;
  }

  return [...startsWith, ...contains].slice(0, limit);
}

export type MatchParts = {
  before: string;
  match: string;
  after: string;
};

/**
 * Splits `name` around the first case-insensitive occurrence of `query` so
 * the row can bold the typed part. When there is no match, everything lands
 * in `before`.
 */
export function splitMatch(name: string, query: string): MatchParts {
  const needle = query.trim().toLowerCase();
  const position = needle ? name.toLowerCase().indexOf(needle) : -1;
  if (position === -1) return { before: name, match: "", after: "" };

  const end = position + needle.length;
  return {
    before: name.slice(0, position),
    match: name.slice(position, end),
    after: name.slice(end),
  };
}
