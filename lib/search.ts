import type { ProductListItem } from "./types";

export type SearchFilters = {
  /** Free-text query; matched case-insensitively against name and category. */
  query?: string;
  /** Category slug; empty string / undefined means "All". */
  category?: string;
};

/**
 * Client-side substring search. Relevance ranking is intentionally out of
 * scope (see feature_list.json S3); a plain filter is the documented mitigation.
 */
export function filterProducts<T extends Pick<ProductListItem, "name" | "category">>(
  products: T[],
  { query = "", category = "" }: SearchFilters,
): T[] {
  const needle = query.trim().toLowerCase();

  return products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }
    if (!needle) {
      return true;
    }
    const haystack = `${product.name} ${product.category.replace(/-/g, " ")}`.toLowerCase();
    return haystack.includes(needle);
  });
}
