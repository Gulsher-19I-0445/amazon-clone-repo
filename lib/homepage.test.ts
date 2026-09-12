import { describe, expect, it } from "vitest";
import { pickTileProducts, type CategoryTileConfig, type TileQuadrantProduct } from "./homepage";

function product(id: string, category: string): TileQuadrantProduct {
  return { id, category, name: id, thumbnail: "" };
}

const tile = (categories: string[]): CategoryTileConfig => ({
  title: "Tile",
  categories,
  href: "/s",
});

describe("pickTileProducts", () => {
  it("takes one product per category in turn for a four-category tile", () => {
    const products = [
      product("a1", "a"),
      product("a2", "a"),
      product("b1", "b"),
      product("c1", "c"),
      product("d1", "d"),
    ];
    const [result] = pickTileProducts([tile(["a", "b", "c", "d"])], products);
    expect(result.quadrants.map((p) => p.id)).toEqual(["a1", "b1", "c1", "d1"]);
  });

  it("fills all four quadrants from a single category", () => {
    const products = ["g1", "g2", "g3", "g4", "g5"].map((id) => product(id, "groceries"));
    const [result] = pickTileProducts([tile(["groceries"])], products);
    expect(result.quadrants.map((p) => p.id)).toEqual(["g1", "g2", "g3", "g4"]);
  });

  it("keeps cycling when categories run out unevenly", () => {
    const products = [product("a1", "a"), product("a2", "a"), product("a3", "a"), product("b1", "b")];
    const [result] = pickTileProducts([tile(["a", "b"])], products);
    expect(result.quadrants.map((p) => p.id)).toEqual(["a1", "b1", "a2", "a3"]);
  });

  it("returns fewer quadrants when there are not enough products", () => {
    const [result] = pickTileProducts([tile(["a", "missing"])], [product("a1", "a")]);
    expect(result.quadrants.map((p) => p.id)).toEqual(["a1"]);
  });

  it("returns an empty quadrant list for a tile with no products", () => {
    const [result] = pickTileProducts([tile(["nothing"])], []);
    expect(result.quadrants).toEqual([]);
  });
});
