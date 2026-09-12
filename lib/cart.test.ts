import { describe, expect, it } from "vitest";
import { addItem, itemCount, removeItem, subtotalCents, updateQuantity } from "./cart";
import type { CartItem } from "./types";

const phone = { productId: "p1", name: "Phone", priceCents: 49999, thumbnail: "", stock: 10 };
const cable = { productId: "p2", name: "Cable", priceCents: 999, thumbnail: "", stock: 2 };

describe("addItem", () => {
  it("adds a new line with qty 1 by default", () => {
    const items = addItem([], phone);
    expect(items).toEqual([{ ...phone, qty: 1 }]);
  });

  it("merges into an existing line for the same product", () => {
    const items = addItem(addItem([], phone, 2), phone, 3);
    expect(items).toHaveLength(1);
    expect(items[0]?.qty).toBe(5);
  });

  it("clamps to available stock", () => {
    const items = addItem(addItem([], cable), cable, 5);
    expect(items[0]?.qty).toBe(2);
  });

  it("does not mutate the input array", () => {
    const original: CartItem[] = [];
    addItem(original, phone);
    expect(original).toEqual([]);
  });
});

describe("updateQuantity", () => {
  const cart = addItem(addItem([], phone), cable);

  it("sets the quantity of the matching line only", () => {
    const items = updateQuantity(cart, "p1", 4);
    expect(items.find((l) => l.productId === "p1")?.qty).toBe(4);
    expect(items.find((l) => l.productId === "p2")?.qty).toBe(1);
  });

  it("removes the line when quantity is set to 0", () => {
    const items = updateQuantity(cart, "p1", 0);
    expect(items.map((l) => l.productId)).toEqual(["p2"]);
  });

  it("clamps to stock", () => {
    const items = updateQuantity(cart, "p2", 99);
    expect(items.find((l) => l.productId === "p2")?.qty).toBe(2);
  });
});

describe("removeItem", () => {
  it("removes the matching line and leaves others", () => {
    const cart = addItem(addItem([], phone), cable);
    expect(removeItem(cart, "p2")).toEqual([{ ...phone, qty: 1 }]);
  });

  it("is a no-op for an unknown product", () => {
    const cart = addItem([], phone);
    expect(removeItem(cart, "nope")).toEqual(cart);
  });
});

describe("totals", () => {
  it("itemCount sums quantities, subtotal sums price × qty", () => {
    const cart = addItem(addItem([], phone, 2), cable);
    expect(itemCount(cart)).toBe(3);
    expect(subtotalCents(cart)).toBe(49999 * 2 + 999);
  });

  it("are zero for an empty cart", () => {
    expect(itemCount([])).toBe(0);
    expect(subtotalCents([])).toBe(0);
  });
});
