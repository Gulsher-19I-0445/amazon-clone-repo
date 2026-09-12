import { describe, expect, it } from "vitest";
import { discountPercent, rankByDiscount } from "./deals";
import type { ProductListItem } from "./types";

function product(id: string, priceCents: number, listPriceCents: number | null): ProductListItem {
  return {
    id,
    slug: id,
    name: id,
    category: "smartphones",
    priceCents,
    listPriceCents,
    rating: 4,
    reviewCount: 10,
    stock: 5,
    thumbnail: "",
    featured: true,
  };
}

describe("discountPercent", () => {
  it("rounds to a whole percent", () => {
    expect(discountPercent(7500, 10000)).toBe(25);
    expect(discountPercent(999, 1116)).toBe(10);
  });

  it("is 0 without a list price or when the list price is not higher", () => {
    expect(discountPercent(1000, null)).toBe(0);
    expect(discountPercent(1000, 1000)).toBe(0);
    expect(discountPercent(1000, 900)).toBe(0);
  });
});

describe("rankByDiscount", () => {
  it("puts the biggest discount first and breaks ties on id", () => {
    const ranked = rankByDiscount([
      product("b", 5000, 10000), // 50%
      product("c", 9000, 10000), // 10%
      product("a", 5000, 10000), // 50%
      product("d", 1000, null), // 0%
    ]);
    expect(ranked.map((p) => p.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("does not mutate the input", () => {
    const input = [product("x", 9000, 10000), product("y", 5000, 10000)];
    rankByDiscount(input);
    expect(input.map((p) => p.id)).toEqual(["x", "y"]);
  });
});
