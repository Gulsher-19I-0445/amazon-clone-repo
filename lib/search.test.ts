import { describe, expect, it } from "vitest";
import { filterProducts } from "./search";

const products = [
  { name: "iPhone 15 Pro", category: "smartphones" },
  { name: "Galaxy Tab S9", category: "tablets" },
  { name: "Blue Cotton Shirt", category: "mens-shirts" },
];

describe("filterProducts", () => {
  it("returns everything for an empty or whitespace query", () => {
    expect(filterProducts(products, { query: "" })).toHaveLength(3);
    expect(filterProducts(products, { query: "   " })).toHaveLength(3);
    expect(filterProducts(products, {})).toHaveLength(3);
  });

  it("matches case-insensitively on name", () => {
    expect(filterProducts(products, { query: "IPHONE" }).map((p) => p.name)).toEqual([
      "iPhone 15 Pro",
    ]);
  });

  it("matches on category words (slug dashes treated as spaces)", () => {
    expect(filterProducts(products, { query: "mens shirts" }).map((p) => p.name)).toEqual([
      "Blue Cotton Shirt",
    ]);
  });

  it("narrows by category slug and combines with the query", () => {
    expect(filterProducts(products, { category: "tablets" })).toHaveLength(1);
    expect(filterProducts(products, { category: "tablets", query: "iphone" })).toHaveLength(0);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterProducts(products, { query: "zzzz" })).toEqual([]);
  });
});
