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

/** Every field the checkout address form collects. Country is fixed to the US. */
export type ShippingAddress = {
  email: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

/** POST /api/orders body. Prices are deliberately absent: the server re-reads them. */
export type CreateOrderRequest = {
  address: ShippingAddress;
  paymentMethodId: string;
  items: { productId: string; qty: number }[];
};

export type CreateOrderResponse = {
  orderId: string;
};

export type OrderItemDto = {
  productId: string;
  name: string;
  thumbnail: string;
  unitPriceCents: number;
  qty: number;
};

/** GET /api/orders/[id] and the confirmation page. */
export type OrderDto = {
  id: string;
  address: ShippingAddress;
  payment: { brand: string; last4: string };
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  /** ISO timestamp — Dates never cross the network. */
  createdAt: string;
  items: OrderItemDto[];
};

/** Error body shared by the order endpoints. `items` names the lines a 409 is about. */
export type OrderErrorResponse = {
  error: string;
  items?: { productId: string; name: string; available: number }[];
};
