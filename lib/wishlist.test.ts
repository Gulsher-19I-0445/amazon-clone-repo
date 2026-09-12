import { describe, expect, it } from "vitest";
import type { Product } from "./types";
import { isSaved, removeItem, toggleItem, toWishlistItem } from "./wishlist";

const phone: Product = {
  id: "p1",
  slug: "phone",
  name: "Phone",
  description: "A long description that must not be persisted.",
  category: "smartphones",
  priceCents: 49999,
  listPriceCents: null,
  rating: 4.5,
  reviewCount: 120,
  stock: 10,
  images: ["a.jpg", "b.jpg"],
  thumbnail: "thumb.jpg",
  featured: false,
};
const cable = { ...phone, id: "p2", slug: "cable", name: "Cable" };

const at = new Date("2026-09-12T10:00:00Z");

describe("toWishlistItem", () => {
  it("keeps the list fields, stamps addedAt, and drops PDP-only fields", () => {
    const item = toWishlistItem(phone, at);
    expect(item.addedAt).toBe("2026-09-12T10:00:00.000Z");
    expect(item.name).toBe("Phone");
    expect(item).not.toHaveProperty("description");
    expect(item).not.toHaveProperty("images");
  });
});

describe("toggleItem", () => {
  it("adds an unsaved product to the top of the list", () => {
    const items = toggleItem(toggleItem([], toWishlistItem(phone, at)), toWishlistItem(cable, at));
    expect(items.map((i) => i.id)).toEqual(["p2", "p1"]);
  });

  it("removes a product that is already saved", () => {
    const saved = toggleItem([], toWishlistItem(phone, at));
    expect(toggleItem(saved, toWishlistItem(phone, at))).toEqual([]);
  });
});

describe("isSaved / removeItem", () => {
  const items = [toWishlistItem(phone, at), toWishlistItem(cable, at)];

  it("reports whether a product is on the list", () => {
    expect(isSaved(items, "p1")).toBe(true);
    expect(isSaved(items, "nope")).toBe(false);
  });

  it("removes only the named product", () => {
    expect(removeItem(items, "p1").map((i) => i.id)).toEqual(["p2"]);
  });
});
