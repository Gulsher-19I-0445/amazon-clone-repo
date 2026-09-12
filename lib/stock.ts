// Pure stock/quantity rules for the product detail page. The buy box and the
// add-to-cart panel read from here so their messages agree with lib/cart.ts.

/** Amazon caps the quantity dropdown at 10 per add. */
export const MAX_QTY_PER_ADD = 10;

/** Below this many units the buy box switches to "Only N left in stock". */
export const LOW_STOCK_THRESHOLD = 10;

export type StockStatus =
  | { kind: "in_stock"; label: string }
  | { kind: "low"; label: string }
  | { kind: "out"; label: string };

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return { kind: "out", label: "Currently unavailable." };
  }
  if (stock < LOW_STOCK_THRESHOLD) {
    return { kind: "low", label: `Only ${stock} left in stock - order soon.` };
  }
  return { kind: "in_stock", label: "In Stock" };
}

/**
 * 1..min(stock, cap); empty when nothing can be bought. The cart page raises
 * `cap` to the line's current quantity so repeated adds (which can push a line
 * past MAX_QTY_PER_ADD) still appear in its dropdown.
 */
export function quantityOptions(stock: number, cap = MAX_QTY_PER_ADD): number[] {
  const max = Math.min(Math.floor(stock), Math.floor(cap));
  return Array.from({ length: Math.max(0, max) }, (_, i) => i + 1);
}

export type AddableQuantity = {
  /** How many can actually be added right now (0 when the cart is already full). */
  qty: number;
  /** True when `qty` is less than what was requested. */
  capped: boolean;
};

/**
 * How much of a requested quantity fits on top of what the cart already holds.
 * The cart store clamps too (lib/cart.ts); this exists so the UI can explain
 * the clamp before/after it happens.
 */
export function addableQuantity(requested: number, stock: number, inCart: number): AddableQuantity {
  const remaining = Math.max(0, stock - inCart);
  const qty = Math.max(0, Math.min(Math.floor(requested), remaining));
  return { qty, capped: qty < requested };
}
