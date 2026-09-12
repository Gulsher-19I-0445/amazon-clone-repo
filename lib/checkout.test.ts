import { describe, expect, it } from "vitest";
import {
  calculateTotals,
  emptyAddress,
  ESTIMATED_TAX_RATE,
  estimatedDeliveryWindow,
  isAddressValid,
  validateAddress,
} from "./checkout";
import type { ShippingAddress } from "./types";

const valid: ShippingAddress = {
  email: "jane@example.com",
  fullName: "Jane Doe",
  phone: "(206) 555-0100",
  addressLine1: "410 Terry Ave N",
  addressLine2: "",
  city: "Seattle",
  state: "WA",
  postalCode: "98109",
};

describe("validateAddress", () => {
  it("accepts a complete US address", () => {
    expect(validateAddress(valid)).toEqual({});
    expect(isAddressValid(valid)).toBe(true);
  });

  it("flags every required field when the form is blank", () => {
    const errors = validateAddress(emptyAddress());
    expect(Object.keys(errors).sort()).toEqual(
      ["addressLine1", "city", "email", "fullName", "phone", "postalCode", "state"].sort(),
    );
  });

  it("treats whitespace-only values as missing", () => {
    expect(validateAddress({ ...valid, fullName: "   " })).toHaveProperty("fullName");
  });

  it("rejects malformed email, short phone, unknown state and bad ZIP", () => {
    expect(validateAddress({ ...valid, email: "jane@" })).toHaveProperty("email");
    expect(validateAddress({ ...valid, phone: "555-0100" })).toHaveProperty("phone");
    expect(validateAddress({ ...valid, state: "ZZ" })).toHaveProperty("state");
    expect(validateAddress({ ...valid, postalCode: "9810" })).toHaveProperty("postalCode");
  });

  it("accepts ZIP+4 and an empty second address line", () => {
    expect(validateAddress({ ...valid, postalCode: "98109-1234", addressLine2: "" })).toEqual({});
  });
});

describe("calculateTotals", () => {
  it("adds free shipping and rounded estimated tax", () => {
    const totals = calculateTotals(12345);
    expect(totals.shippingCents).toBe(0);
    expect(totals.taxCents).toBe(Math.round(12345 * ESTIMATED_TAX_RATE));
    expect(totals.totalCents).toBe(12345 + totals.taxCents);
  });

  it("is all zeros for an empty subtotal", () => {
    expect(calculateTotals(0)).toEqual({ subtotalCents: 0, shippingCents: 0, taxCents: 0, totalCents: 0 });
  });
});

describe("estimatedDeliveryWindow", () => {
  it("spans 3 to 5 days after the order was placed", () => {
    const placed = new Date("2026-09-12T10:00:00Z");
    const { from, to } = estimatedDeliveryWindow(placed);
    expect(from.toISOString()).toBe("2026-09-15T10:00:00.000Z");
    expect(to.toISOString()).toBe("2026-09-17T10:00:00.000Z");
  });
});
