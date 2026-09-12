import "server-only";
import { cache } from "react";
import { db } from "./db";
import { buildOrderCreateInput, type OrderLine } from "./orderInput";
import { findPaymentMethod } from "./payment";
import type { CreateOrderRequest, OrderDto } from "./types";

// Order I/O against Neon. Prices and stock come from the database, never from
// the request, so a stale or edited cart can't buy at the wrong price.

export type CreateOrderResult =
  | { kind: "ok"; orderId: string }
  | { kind: "unknown_payment_method" }
  | { kind: "unavailable"; productIds: string[] }
  | { kind: "insufficient_stock"; items: { productId: string; name: string; available: number }[] };

export async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResult> {
  const payment = findPaymentMethod(request.paymentMethodId);
  if (payment === null) {
    return { kind: "unknown_payment_method" };
  }

  const products = await db.product.findMany({
    where: { id: { in: request.items.map((item) => item.productId) } },
    select: { id: true, name: true, thumbnail: true, priceCents: true, stock: true },
  });
  const byId = new Map(products.map((product) => [product.id, product]));

  const missing = request.items.filter((item) => !byId.has(item.productId)).map((item) => item.productId);
  if (missing.length > 0) {
    return { kind: "unavailable", productIds: missing };
  }

  const lines: OrderLine[] = [];
  const short: { productId: string; name: string; available: number }[] = [];
  for (const item of request.items) {
    const product = byId.get(item.productId);
    if (product === undefined) continue; // already reported above
    if (item.qty > product.stock) {
      short.push({ productId: product.id, name: product.name, available: product.stock });
    } else {
      lines.push({ product, qty: item.qty });
    }
  }
  if (short.length > 0) {
    return { kind: "insufficient_stock", items: short };
  }

  // Nested create: the order and all its items land in one statement, so a
  // failure part-way never leaves an order without lines.
  const order = await db.order.create({
    data: buildOrderCreateInput(request.address, payment, lines),
    select: { id: true },
  });
  return { kind: "ok", orderId: order.id };
}

/**
 * One order with its lines, or null when the id is unknown. React-cached so
 * generateMetadata and the confirmation page share a single read.
 */
export const getOrderById = cache(async (id: string): Promise<OrderDto | null> => {
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (order === null) return null;

  return {
    id: order.id,
    address: {
      email: order.email,
      fullName: order.fullName,
      phone: order.phone,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2 ?? "",
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
    },
    payment: { brand: order.paymentBrand, last4: order.paymentLast4 },
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      thumbnail: item.thumbnail,
      unitPriceCents: item.unitPriceCents,
      qty: item.qty,
    })),
  };
});
