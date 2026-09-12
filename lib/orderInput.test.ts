import { describe, expect, it } from "vitest";
import { calculateTotals } from "./checkout";
import { buildOrderCreateInput, parseCreateOrderRequest } from "./orderInput";
import { MOCK_PAYMENT_METHODS } from "./payment";
import type { ShippingAddress } from "./types";

const address: ShippingAddress = {
  email: " jane@example.com ",
  fullName: "Jane Doe",
  phone: "2065550100",
  addressLine1: "410 Terry Ave N",
  addressLine2: "",
  city: "Seattle",
  state: "WA",
  postalCode: "98109",
};

const body = {
  address,
  paymentMethodId: "visa-4242",
  items: [
    { productId: "p1", qty: 2 },
    { productId: "p2", qty: 1 },
  ],
};

describe("parseCreateOrderRequest", () => {
  it("accepts a well-formed body and trims the address", () => {
    const parsed = parseCreateOrderRequest(body);
    expect(parsed).not.toBeNull();
    expect(parsed?.address.email).toBe("jane@example.com");
    expect(parsed?.items).toEqual(body.items);
    expect(parsed?.paymentMethodId).toBe("visa-4242");
  });

  it("rejects non-object bodies and missing sections", () => {
    expect(parseCreateOrderRequest(null)).toBeNull();
    expect(parseCreateOrderRequest("nope")).toBeNull();
    expect(parseCreateOrderRequest({ ...body, address: undefined })).toBeNull();
    expect(parseCreateOrderRequest({ ...body, paymentMethodId: 7 })).toBeNull();
  });

  it("rejects an invalid address", () => {
    expect(parseCreateOrderRequest({ ...body, address: { ...address, postalCode: "abc" } })).toBeNull();
  });

  it("rejects empty, non-integer, non-positive or duplicate items", () => {
    expect(parseCreateOrderRequest({ ...body, items: [] })).toBeNull();
    expect(parseCreateOrderRequest({ ...body, items: [{ productId: "p1", qty: 1.5 }] })).toBeNull();
    expect(parseCreateOrderRequest({ ...body, items: [{ productId: "p1", qty: 0 }] })).toBeNull();
    expect(parseCreateOrderRequest({ ...body, items: [{ productId: "p1", qty: "2" }] })).toBeNull();
    expect(
      parseCreateOrderRequest({
        ...body,
        items: [
          { productId: "p1", qty: 1 },
          { productId: "p1", qty: 1 },
        ],
      }),
    ).toBeNull();
  });
});

describe("buildOrderCreateInput", () => {
  const phone = { id: "p1", name: "Phone", thumbnail: "/phone.jpg", priceCents: 49999 };
  const cable = { id: "p2", name: "Cable", thumbnail: "/cable.jpg", priceCents: 999 };
  const visa = MOCK_PAYMENT_METHODS[0]!;

  const input = buildOrderCreateInput(address, visa, [
    { product: phone, qty: 2 },
    { product: cable, qty: 1 },
  ]);

  it("snapshots product name, thumbnail and unit price on each line", () => {
    expect(input.items).toEqual({
      create: [
        { productId: "p1", name: "Phone", thumbnail: "/phone.jpg", unitPriceCents: 49999, qty: 2 },
        { productId: "p2", name: "Cable", thumbnail: "/cable.jpg", unitPriceCents: 999, qty: 1 },
      ],
    });
  });

  it("sums price × qty into the stored totals", () => {
    const subtotal = 49999 * 2 + 999;
    expect(input).toMatchObject(calculateTotals(subtotal));
  });

  it("stores the payment snapshot and null for an empty second address line", () => {
    expect(input).toMatchObject({ paymentBrand: "Visa", paymentLast4: "4242", addressLine2: null, state: "WA" });
  });
});
