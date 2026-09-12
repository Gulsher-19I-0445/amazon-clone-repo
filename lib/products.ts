import "server-only";
import type { Prisma } from "@prisma/client";
import { cache } from "react";
import { buildProductOrderBy, buildProductWhere, PAGE_SIZE, type CatalogQuery } from "./catalog";
import { db } from "./db";
import type { TileQuadrantProduct } from "./homepage";
import type { Product, ProductListItem } from "./types";

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

/** Everything a ProductListItem has plus the long-form fields the PDP shows. */
export const productDetailSelect = {
  ...productListSelect,
  description: true,
  images: true,
} satisfies Prisma.ProductSelect;

/**
 * Single product for the PDP, or null when the id is unknown. Wrapped in
 * React's cache so generateMetadata and the page share one database read.
 */
export const getProductById = cache((id: string): Promise<Product | null> => {
  return db.product.findUnique({ where: { id }, select: productDetailSelect });
});

/** Best-rated products in the same category, leaving out the one being viewed. */
export function getRelatedProducts(category: string, excludeId: string, take = 12): Promise<ProductListItem[]> {
  return db.product.findMany({
    where: { category, id: { not: excludeId } },
    orderBy: [{ rating: "desc" }, { reviewCount: "desc" }, { id: "asc" }],
    take,
    select: productListSelect,
  });
}

export type CatalogPage = {
  products: ProductListItem[];
  /** Total rows matching the filters, across all pages. */
  total: number;
};

/** One page of the listing page (/s): filtered, sorted and paginated in Postgres. */
export async function getCatalogPage(q: CatalogQuery): Promise<CatalogPage> {
  const where = buildProductWhere(q);
  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: buildProductOrderBy(q),
      skip: (q.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: productListSelect,
    }),
    db.product.count({ where }),
  ]);
  return { products, total };
}

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
