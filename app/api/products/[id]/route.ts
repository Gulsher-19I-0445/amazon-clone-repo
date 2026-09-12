import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ErrorResponse = {
  error: string;
};

// GET /api/products/[id] — the full product (description + gallery images).
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const product = await getProductById(id);

  if (product === null) {
    const body: ErrorResponse = { error: "Product not found" };
    return NextResponse.json(body, { status: 404 });
  }

  const body: Product = product;
  return NextResponse.json(body);
}
