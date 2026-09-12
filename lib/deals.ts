import type { ProductListItem } from "./types";

/** Whole-number percent off the list price; 0 when there is no discount. */
export function discountPercent(priceCents: number, listPriceCents: number | null): number {
  if (listPriceCents === null || listPriceCents <= priceCents) return 0;
  return Math.round(((listPriceCents - priceCents) / listPriceCents) * 100);
}

/** Biggest discount first; ties broken on id so the order is stable. */
export function rankByDiscount(products: ProductListItem[]): ProductListItem[] {
  return [...products].sort((a, b) => {
    const diff =
      discountPercent(b.priceCents, b.listPriceCents) - discountPercent(a.priceCents, a.listPriceCents);
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}
