import { describe, expect, it } from "vitest";
import { MAX_SUGGESTIONS, matchSuggestions, splitMatch } from "./suggestions";
import type { ProductSuggestion } from "./types";

function product(name: string, category = "smartphones"): ProductSuggestion {
  return { id: name.toLowerCase().replace(/\s+/g, "-"), name, category, thumbnail: "/x.jpg" };
}

const index: ProductSuggestion[] = [
  product("Apple iPhone 15"),
  product("iPhone 13 Pro"),
  product("iPhone Charger", "mobile-accessories"),
  product("Samsung Galaxy S24"),
  product("Apple MacBook Pro", "laptops"),
];

describe("matchSuggestions", () => {
  it("returns nothing for an empty or whitespace query", () => {
    expect(matchSuggestions(index, "", "")).toEqual([]);
    expect(matchSuggestions(index, "   ", "")).toEqual([]);
  });

  it("matches case-insensitively anywhere in the name", () => {
    const names = matchSuggestions(index, "GALAXY", "").map((p) => p.name);
    expect(names).toEqual(["Samsung Galaxy S24"]);
  });

  it("lists prefix matches before substring matches, keeping index order within each", () => {
    const names = matchSuggestions(index, "iphone", "").map((p) => p.name);
    expect(names).toEqual(["iPhone 13 Pro", "iPhone Charger", "Apple iPhone 15"]);
  });

  it("restricts to the selected category", () => {
    const names = matchSuggestions(index, "iphone", "mobile-accessories").map((p) => p.name);
    expect(names).toEqual(["iPhone Charger"]);
  });

  it("caps the result at the limit", () => {
    const big = Array.from({ length: 20 }, (_, i) => product(`Widget ${i}`));
    expect(matchSuggestions(big, "widget", "")).toHaveLength(MAX_SUGGESTIONS);
    expect(matchSuggestions(big, "widget", "", 3)).toHaveLength(3);
  });

  it("returns nothing when no name matches", () => {
    expect(matchSuggestions(index, "zzzz", "")).toEqual([]);
  });
});

describe("splitMatch", () => {
  it("splits around the first case-insensitive occurrence", () => {
    expect(splitMatch("Apple iPhone 15", "IPHONE")).toEqual({
      before: "Apple ",
      match: "iPhone",
      after: " 15",
    });
  });

  it("puts the whole name in `before` when there is no match", () => {
    expect(splitMatch("Apple iPhone 15", "pixel")).toEqual({ before: "Apple iPhone 15", match: "", after: "" });
    expect(splitMatch("Apple iPhone 15", "")).toEqual({ before: "Apple iPhone 15", match: "", after: "" });
  });
});
