import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import type { TileQuadrantProduct } from "./homepage";
import type { ProductListItem } from "./types";

// Columns that make up a ProductListItem. Shared by every list-style read so
// route handlers and server components return the same shape.
export const productListSelect = {
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
} satisfies Prisma.ProductSelect;

export function getFeaturedProducts(): Promise<ProductListItem[]> {
  return db.product.findMany({
    where: { featured: true },
    orderBy: { name: "asc" },
    select: productListSelect,
  });
}

// Ties broken on reviewCount then id so the rail is stable between requests.
export function getTopRatedProducts(take: number): Promise<ProductListItem[]> {
  return db.product.findMany({
    orderBy: [{ rating: "desc" }, { reviewCount: "desc" }, { id: "asc" }],
    take,
    select: productListSelect,
  });
}

/** Thumbnail-sized rows for the homepage category tiles, best rated first. */
export function getProductsInCategories(slugs: string[]): Promise<TileQuadrantProduct[]> {
  return db.product.findMany({
    where: { category: { in: slugs } },
    orderBy: [{ rating: "desc" }, { id: "asc" }],
    select: { id: true, category: true, name: true, thumbnail: true },
  });
}
