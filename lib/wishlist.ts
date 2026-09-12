import type { ProductListItem, WishlistItem } from "./types";

// Pure wishlist rules. The Zustand store in store/wishlist.ts delegates here
// so this logic can be unit-tested without localStorage or React.
//
// Each entry is a snapshot of the product at save time, so its price/stock can
// drift from the catalog. That is fine for a list; checkout re-reads the DB
// and its 409 path reconciles anything that changed.

/**
 * Explicit field pick so a full PDP `Product` (description, images) never
 * leaks into localStorage.
 */
export function toWishlistItem(product: ProductListItem, now = new Date()): WishlistItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    priceCents: product.priceCents,
    listPriceCents: product.listPriceCents,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    thumbnail: product.thumbnail,
    featured: product.featured,
    addedAt: now.toISOString(),
  };
}

export function isSaved(items: WishlistItem[], productId: string): boolean {
  return items.some((item) => item.id === productId);
}

/** Remove the product when it is already saved, otherwise add it at the top (newest first). */
export function toggleItem(items: WishlistItem[], item: WishlistItem): WishlistItem[] {
  if (isSaved(items, item.id)) {
    return removeItem(items, item.id);
  }
  return [item, ...items];
}

export function removeItem(items: WishlistItem[], productId: string): WishlistItem[] {
  return items.filter((item) => item.id !== productId);
}
