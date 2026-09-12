import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";
import type { OrderDto, OrderErrorResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/orders/[id] — a placed order with its lines, as the confirmation page shows it.
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (order === null) {
    const body: OrderErrorResponse = { error: "Order not found" };
    return NextResponse.json(body, { status: 404 });
  }

  const body: OrderDto = order;
  return NextResponse.json(body);
}
