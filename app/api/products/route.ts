import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { productListSelect } from "@/lib/products";
import type { ProductListResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/products            -> whole catalog
// GET /api/products?featured=true -> curated homepage subset
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get("featured") === "true";

  const products = await db.product.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    orderBy: { name: "asc" },
    select: productListSelect,
  });

  const body: ProductListResponse = { products };
  return NextResponse.json(body);
}
