import { NextResponse } from "next/server";
import { PAGE_SIZE, parseCatalogQuery } from "@/lib/catalog";
import { getCatalogPage } from "@/lib/products";
import type { CatalogResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/products?k=&category=&minPrice=&maxPrice=&sort=&page=&deals=true
// Same URL contract as the /s page (see lib/catalog.ts). `featured=true` is
// kept as an alias for `deals=true` since F2 documented it.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = Object.fromEntries(searchParams);
  if (raw.featured === "true") raw.deals = "true";

  const query = parseCatalogQuery(raw);
  const { products, total } = await getCatalogPage(query);

  const body: CatalogResponse = { products, total, page: query.page, pageSize: PAGE_SIZE };
  return NextResponse.json(body);
}
