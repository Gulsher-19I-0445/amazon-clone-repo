import type { Prisma } from "@prisma/client";
import { calculateTotals, emptyAddress, isAddressValid, trimAddress } from "./checkout";
import type { PaymentMethod } from "./payment";
import type { CreateOrderRequest, ShippingAddress } from "./types";

// Pure half of order creation: turning an untrusted request body into a typed
// request, and turning validated cart lines into the Prisma write. Kept free
// of server-only imports so it can be unit-tested (lib/orders.ts does the I/O).

const ADDRESS_KEYS: (keyof ShippingAddress)[] = [
  "email",
  "fullName",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "postalCode",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAddress(value: unknown): ShippingAddress | null {
  if (!isRecord(value)) return null;
  const address = emptyAddress();
  for (const key of ADDRESS_KEYS) {
    const field = value[key];
    if (typeof field !== "string") return null;
    address[key] = field;
  }
  return isAddressValid(address) ? trimAddress(address) : null;
}

function parseItems(value: unknown): CreateOrderRequest["items"] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const items: CreateOrderRequest["items"] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (!isRecord(entry)) return null;
    const { productId, qty } = entry;
    if (typeof productId !== "string" || productId === "" || seen.has(productId)) return null;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) return null;
    seen.add(productId);
    items.push({ productId, qty });
  }
  return items;
}

/**
 * Narrow a JSON body from the public endpoint into a CreateOrderRequest, or
 * null when anything is missing, malformed, or fails address validation.
 */
export function parseCreateOrderRequest(body: unknown): CreateOrderRequest | null {
  if (!isRecord(body)) return null;
  const address = parseAddress(body.address);
  const items = parseItems(body.items);
  const { paymentMethodId } = body;
  if (address === null || items === null || typeof paymentMethodId !== "string") return null;
  return { address, paymentMethodId, items };
}

/** What the server knows about a product when it prices an order line. */
export type PricedProduct = {
  id: string;
  name: string;
  thumbnail: string;
  priceCents: number;
};

export type OrderLine = {
  product: PricedProduct;
  qty: number;
};

/**
 * Build the nested Prisma write for one order. Product name, thumbnail and
 * price are copied onto each line so the order reads the same forever, even
 * after the catalog changes.
 */
export function buildOrderCreateInput(
  address: ShippingAddress,
  payment: PaymentMethod,
  lines: OrderLine[],
): Prisma.OrderCreateInput {
  const subtotalCents = lines.reduce((sum, line) => sum + line.product.priceCents * line.qty, 0);
  const totals = calculateTotals(subtotalCents);

  return {
    email: address.email,
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 === "" ? null : address.addressLine2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    paymentBrand: payment.brand,
    paymentLast4: payment.last4,
    ...totals,
    items: {
      create: lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        thumbnail: line.product.thumbnail,
        unitPriceCents: line.product.priceCents,
        qty: line.qty,
      })),
    },
  };
}
