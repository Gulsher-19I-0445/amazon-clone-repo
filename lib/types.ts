// JSON-safe DTOs shared by API routes and client components.
// Deliberately not derived from Prisma's generated type so `createdAt: Date`
// never leaks into a shape that crosses the network as a string.

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceCents: number;
  listPriceCents: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  thumbnail: string;
  featured: boolean;
};

/** Lighter shape returned by list endpoints (grid cards, search, carousels). */
export type ProductListItem = Omit<Product, "description" | "images">;

export type ProductListResponse = {
  products: ProductListItem[];
};

/** GET /api/products — one page of the filtered catalog. */
export type CatalogResponse = ProductListResponse & {
  total: number;
  page: number;
  pageSize: number;
};

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  thumbnail: string;
  stock: number;
  qty: number;
};
