import { NextResponse } from "next/server";
import { parseCreateOrderRequest } from "@/lib/orderInput";
import { createOrder } from "@/lib/orders";
import type { CreateOrderResponse, OrderErrorResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

function errorResponse(body: OrderErrorResponse, status: number) {
  return NextResponse.json(body, { status });
}

// POST /api/orders — create an Order + OrderItems from the visitor's cart.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse({ error: "Request body must be JSON." }, 400);
  }

  const order = parseCreateOrderRequest(body);
  if (order === null) {
    return errorResponse({ error: "Check your address and cart items and try again." }, 400);
  }

  try {
    const result = await createOrder(order);
    switch (result.kind) {
      case "ok": {
        const created: CreateOrderResponse = { orderId: result.orderId };
        return NextResponse.json(created, { status: 201 });
      }
      case "unknown_payment_method":
        return errorResponse({ error: "Select a payment method." }, 400);
      case "unavailable":
        return errorResponse({ error: "Some items in your cart are no longer available." }, 400);
      case "insufficient_stock":
        return errorResponse({ error: "Some items in your cart exceed the quantity in stock.", items: result.items }, 409);
    }
  } catch (error: unknown) {
    console.error("POST /api/orders failed", error);
    return errorResponse({ error: "We couldn't place your order. Please try again." }, 500);
  }
}
