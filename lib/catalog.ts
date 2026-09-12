import type { Prisma } from "@prisma/client";
import { CATEGORIES } from "./categories";

// Everything the product listing page (/s) needs to turn URL search params
// into a Prisma query and back into links. Kept free of runtime Prisma imports
// because client components import `catalogHref` from here.

export const PAGE_SIZE = 24;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Avg. Customer Review" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: SortOption = "featured";

/** Amazon-style price shortcuts, in dollars. `max` undefined = "& above". */
export const PRICE_BUCKETS: { label: string; min?: number; max?: number }[] = [
  { label: "Under $25", max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 to $200", min: 100, max: 200 },
  { label: "$200 & Above", min: 200 },
];

export type CatalogQuery = {
  /** Free-text search, already trimmed. Empty string = no query. */
  query: string;
  /** Category slug, or empty string for "Any Department". */
  category: string;
  /** Price bounds in whole dollars (inclusive). */
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  page: number;
  /** Restrict to the curated "Today's Deals" set (Product.featured). */
  deals: boolean;
  /** Set when min > max was requested; both bounds are dropped so the UI can explain. */
  invalidPriceRange?: { min: number; max: number };
  /**
   * Product id to leave out (`?exclude=`), used by the PDP's related-products
   * query. API-only: it is never a listing-page filter, so catalogHref ignores it.
   */
  excludeId?: string;
};

/** Shape Next hands to `page.tsx` as `searchParams`; repeated keys arrive as arrays. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function parseDollars(value: string): number | undefined {
  if (value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseCatalogQuery(raw: RawSearchParams): CatalogQuery {
  const category = first(raw.category);
  const sort = first(raw.sort);
  const page = Number(first(raw.page));

  let minPrice = parseDollars(first(raw.minPrice));
  let maxPrice = parseDollars(first(raw.maxPrice));
  let invalidPriceRange: CatalogQuery["invalidPriceRange"];
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    invalidPriceRange = { min: minPrice, max: maxPrice };
    minPrice = undefined;
    maxPrice = undefined;
  }

  return {
    query: first(raw.k),
    category: CATEGORIES.some((c) => c.slug === category) ? category : "",
    minPrice,
    maxPrice,
    sort: isSortOption(sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    deals: first(raw.deals) === "true",
    invalidPriceRange,
    excludeId: first(raw.exclude) || undefined,
  };
}

export function buildProductWhere(q: CatalogQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (q.query) {
    // Substring match only; relevance ranking is out of scope (feature_list S3).
    where.OR = [
      { name: { contains: q.query, mode: "insensitive" } },
      { category: { contains: q.query.replace(/\s+/g, "-"), mode: "insensitive" } },
    ];
  }
  if (q.category) where.category = q.category;
  if (q.deals) where.featured = true;
  if (q.excludeId) where.id = { not: q.excludeId };

  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    where.priceCents = {
      ...(q.minPrice !== undefined && { gte: Math.round(q.minPrice * 100) }),
      ...(q.maxPrice !== undefined && { lte: Math.round(q.maxPrice * 100) }),
    };
  }

  return where;
}

// Every ordering ends on id so pages never overlap between requests.
export function buildProductOrderBy(q: CatalogQuery): Prisma.ProductOrderByWithRelationInput[] {
  switch (q.sort) {
    case "price-asc":
      return [{ priceCents: "asc" }, { id: "asc" }];
    case "price-desc":
      return [{ priceCents: "desc" }, { id: "asc" }];
    case "rating-desc":
      return [{ rating: "desc" }, { reviewCount: "desc" }, { id: "asc" }];
    case "featured":
      return [{ featured: "desc" }, { rating: "desc" }, { id: "asc" }];
  }
}

/**
 * Builds a /s URL for the given query. Defaults are omitted so links stay
 * short, and any change other than the page itself starts back at page 1.
 */
export function catalogHref(q: CatalogQuery, overrides: Partial<CatalogQuery> = {}): string {
  const onlyPageChanged = Object.keys(overrides).every((key) => key === "page");
  const next: CatalogQuery = { ...q, ...overrides, page: onlyPageChanged ? (overrides.page ?? q.page) : 1 };

  const params = new URLSearchParams();
  if (next.query) params.set("k", next.query);
  if (next.category) params.set("category", next.category);
  if (next.minPrice !== undefined) params.set("minPrice", String(next.minPrice));
  if (next.maxPrice !== undefined) params.set("maxPrice", String(next.maxPrice));
  if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
  if (next.deals) params.set("deals", "true");
  if (next.page > 1) params.set("page", String(next.page));

  const qs = params.toString();
  return qs ? `/s?${qs}` : "/s";
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}
