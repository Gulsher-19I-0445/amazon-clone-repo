import { describe, expect, it } from "vitest";
import { addableQuantity, MAX_QTY_PER_ADD, quantityOptions, stockStatus } from "./stock";

describe("stockStatus", () => {
  it("is out of stock at zero (or below)", () => {
    expect(stockStatus(0).kind).toBe("out");
    expect(stockStatus(-1).kind).toBe("out");
  });

  it("warns when fewer than ten remain, naming the count", () => {
    expect(stockStatus(1)).toEqual({ kind: "low", label: "Only 1 left in stock - order soon." });
    expect(stockStatus(9).kind).toBe("low");
  });

  it("is plainly in stock from ten up", () => {
    expect(stockStatus(10)).toEqual({ kind: "in_stock", label: "In Stock" });
    expect(stockStatus(99).kind).toBe("in_stock");
  });
});

describe("quantityOptions", () => {
  it("counts up to the stock when it is under the per-add cap", () => {
    expect(quantityOptions(3)).toEqual([1, 2, 3]);
  });

  it("never offers more than the per-add cap", () => {
    expect(quantityOptions(99)).toHaveLength(MAX_QTY_PER_ADD);
    expect(quantityOptions(99).at(-1)).toBe(MAX_QTY_PER_ADD);
  });

  it("is empty when nothing can be bought", () => {
    expect(quantityOptions(0)).toEqual([]);
  });
});

describe("addableQuantity", () => {
  it("allows the full request when there is room", () => {
    expect(addableQuantity(2, 10, 3)).toEqual({ qty: 2, capped: false });
  });

  it("caps to what is left after the cart's existing quantity", () => {
    expect(addableQuantity(5, 4, 2)).toEqual({ qty: 2, capped: true });
  });

  it("allows nothing once the cart already holds all the stock", () => {
    expect(addableQuantity(1, 3, 3)).toEqual({ qty: 0, capped: true });
    expect(addableQuantity(1, 3, 7)).toEqual({ qty: 0, capped: true });
  });
});
