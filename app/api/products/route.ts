import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ProductListResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      priceCents: true,
      listPriceCents: true,
      rating: true,
      reviewCount: true,
      stock: true,
      thumbnail: true,
      featured: true,
    },
  });

  const body: ProductListResponse = { products };
  return NextResponse.json(body);
}
