import { describe, expect, it } from "vitest";
import {
  buildProductOrderBy,
  buildProductWhere,
  catalogHref,
  PAGE_SIZE,
  pageCount,
  parseCatalogQuery,
  type CatalogQuery,
} from "./catalog";

const base: CatalogQuery = {
  query: "",
  category: "",
  sort: "featured",
  page: 1,
  deals: false,
};

describe("parseCatalogQuery", () => {
  it("falls back to defaults for an empty URL", () => {
    expect(parseCatalogQuery({})).toEqual({
      ...base,
      minPrice: undefined,
      maxPrice: undefined,
      invalidPriceRange: undefined,
    });
  });

  it("reads and trims every supported param", () => {
    const q = parseCatalogQuery({
      k: "  phone ",
      category: "laptops",
      minPrice: "10",
      maxPrice: "99.5",
      sort: "price-desc",
      page: "3",
      deals: "true",
    });
    expect(q).toMatchObject({
      query: "phone",
      category: "laptops",
      minPrice: 10,
      maxPrice: 99.5,
      sort: "price-desc",
      page: 3,
      deals: true,
    });
  });

  it("takes the first value when a param is repeated", () => {
    expect(parseCatalogQuery({ category: ["tablets", "laptops"] }).category).toBe("tablets");
  });

  it("ignores unknown categories and sorts", () => {
    const q = parseCatalogQuery({ category: "not-a-category", sort: "bogus" });
    expect(q.category).toBe("");
    expect(q.sort).toBe("featured");
  });

  it("drops blank, non-numeric and negative prices", () => {
    expect(parseCatalogQuery({ minPrice: "", maxPrice: "" })).toMatchObject({
      minPrice: undefined,
      maxPrice: undefined,
    });
    expect(parseCatalogQuery({ minPrice: "abc", maxPrice: "-5" })).toMatchObject({
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("flags min > max and drops both bounds", () => {
    const q = parseCatalogQuery({ minPrice: "100", maxPrice: "50" });
    expect(q.minPrice).toBeUndefined();
    expect(q.maxPrice).toBeUndefined();
    expect(q.invalidPriceRange).toEqual({ min: 100, max: 50 });
  });

  it("reads an id to exclude and drops a blank one", () => {
    expect(parseCatalogQuery({ exclude: "abc123" }).excludeId).toBe("abc123");
    expect(parseCatalogQuery({ exclude: "  " }).excludeId).toBeUndefined();
  });

  it("clamps the page to a positive integer", () => {
    expect(parseCatalogQuery({ page: "0" }).page).toBe(1);
    expect(parseCatalogQuery({ page: "-2" }).page).toBe(1);
    expect(parseCatalogQuery({ page: "2.5" }).page).toBe(1);
    expect(parseCatalogQuery({ page: "abc" }).page).toBe(1);
  });
});

describe("buildProductWhere", () => {
  it("is empty for the default query", () => {
    expect(buildProductWhere(base)).toEqual({});
  });

  it("converts dollar bounds to inclusive cents", () => {
    expect(buildProductWhere({ ...base, minPrice: 25, maxPrice: 49.99 })).toEqual({
      priceCents: { gte: 2500, lte: 4999 },
    });
    expect(buildProductWhere({ ...base, minPrice: 200 })).toEqual({ priceCents: { gte: 20000 } });
  });

  it("combines category, deals and a case-insensitive text match", () => {
    const where = buildProductWhere({ ...base, query: "mens shirts", category: "mens-shirts", deals: true });
    expect(where.category).toBe("mens-shirts");
    expect(where.featured).toBe(true);
    expect(where.OR).toEqual([
      { name: { contains: "mens shirts", mode: "insensitive" } },
      { category: { contains: "mens-shirts", mode: "insensitive" } },
    ]);
  });

  it("leaves out the excluded product (related-products query)", () => {
    expect(buildProductWhere({ ...base, category: "beauty", excludeId: "abc123" })).toEqual({
      category: "beauty",
      id: { not: "abc123" },
    });
  });
});

describe("buildProductOrderBy", () => {
  it("orders by the requested field and always ends on id", () => {
    expect(buildProductOrderBy({ ...base, sort: "price-asc" })).toEqual([{ priceCents: "asc" }, { id: "asc" }]);
    expect(buildProductOrderBy({ ...base, sort: "price-desc" })).toEqual([{ priceCents: "desc" }, { id: "asc" }]);
    expect(buildProductOrderBy({ ...base, sort: "rating-desc" })[0]).toEqual({ rating: "desc" });
    expect(buildProductOrderBy(base)[0]).toEqual({ featured: "desc" });
  });
});

describe("catalogHref", () => {
  it("omits defaults entirely", () => {
    expect(catalogHref(base)).toBe("/s");
  });

  it("serialises only the non-default fields", () => {
    const q: CatalogQuery = {
      ...base,
      query: "phone",
      category: "smartphones",
      minPrice: 100,
      sort: "price-asc",
      page: 2,
      deals: true,
    };
    expect(catalogHref(q)).toBe("/s?k=phone&category=smartphones&minPrice=100&sort=price-asc&deals=true&page=2");
  });

  it("keeps the page when only the page changes, and resets it otherwise", () => {
    const onPage3 = { ...base, category: "groceries", page: 3 };
    expect(catalogHref(onPage3, { page: 4 })).toBe("/s?category=groceries&page=4");
    expect(catalogHref(onPage3, { sort: "price-asc" })).toBe("/s?category=groceries&sort=price-asc");
    expect(catalogHref(onPage3, { category: "" })).toBe("/s");
  });

  it("can clear a price bound with an explicit undefined", () => {
    expect(catalogHref({ ...base, minPrice: 25, maxPrice: 50 }, { minPrice: undefined, maxPrice: undefined })).toBe(
      "/s",
    );
  });
});

describe("pageCount", () => {
  it("never drops below one page", () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(1)).toBe(1);
    expect(pageCount(PAGE_SIZE)).toBe(1);
    expect(pageCount(PAGE_SIZE + 1)).toBe(2);
    expect(pageCount(194)).toBe(9);
  });
});
