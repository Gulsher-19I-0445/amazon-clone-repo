import type { CartItem } from "./types";

// Pure cart math. The Zustand store in store/cart.ts delegates here so this
// logic can be unit-tested without localStorage or React.

export type NewCartItem = Omit<CartItem, "qty">;

/** Never let a line exceed available stock (and never go below 1 while present). */
export function clampQuantity(qty: number, stock: number): number {
  return Math.max(1, Math.min(Math.floor(qty), stock));
}

/**
 * Add `qty` of a product; merges into an existing line for the same product.
 * The incoming item's price/stock win over the persisted line's so a cart
 * saved days ago follows what the product page currently shows.
 */
export function addItem(items: CartItem[], item: NewCartItem, qty = 1): CartItem[] {
  const existing = items.find((line) => line.productId === item.productId);
  if (!existing) {
    return [...items, { ...item, qty: clampQuantity(qty, item.stock) }];
  }
  return items.map((line) =>
    line.productId === item.productId
      ? { ...line, ...item, qty: clampQuantity(line.qty + qty, item.stock) }
      : line,
  );
}

/** Set a line's quantity. A quantity of 0 (or less) removes the line. */
export function updateQuantity(items: CartItem[], productId: string, qty: number): CartItem[] {
  if (qty <= 0) {
    return removeItem(items, productId);
  }
  return items.map((line) =>
    line.productId === productId ? { ...line, qty: clampQuantity(qty, line.stock) } : line,
  );
}

export function removeItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((line) => line.productId !== productId);
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((sum, line) => sum + line.qty, 0);
}

export function subtotalCents(items: CartItem[]): number {
  return items.reduce((sum, line) => sum + line.priceCents * line.qty, 0);
}

/** Amazon's non-Prime free shipping threshold ($35). Cosmetic: no shipping is ever charged. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 3500;

/** How much more must be added to qualify for free shipping; 0 once qualified. */
export function freeShippingGapCents(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
}
