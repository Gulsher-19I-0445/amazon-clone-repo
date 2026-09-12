import type { NewCartItem } from "@/lib/cart";
import { stockStatus } from "@/lib/stock";
import type { Product } from "@/lib/types";
import { AddToCartPanel } from "./AddToCartPanel";
import { PriceBlock } from "./PriceBlock";

type BuyBoxProps = {
  product: Product;
};

const stockClass = {
  in_stock: "text-green-700",
  low: "text-amz-price",
  out: "text-amz-price",
} as const;

// Right-hand purchase column. Server component: it narrows the product down
// to the plain cart item the client-side panel needs.
export function BuyBox({ product }: BuyBoxProps) {
  const status = stockStatus(product.stock);
  const cartItem: NewCartItem = {
    productId: product.id,
    name: product.name,
    priceCents: product.priceCents,
    thumbnail: product.thumbnail,
    stock: product.stock,
  };

  return (
    <div className="rounded-md border border-amz-border p-4">
      <PriceBlock priceCents={product.priceCents} listPriceCents={product.listPriceCents} size="md" />

      {status.kind !== "out" && (
        <p className="mt-3 text-sm">
          FREE delivery <span className="font-bold">Tomorrow</span>
        </p>
      )}

      <p className={`mt-3 text-lg font-medium ${stockClass[status.kind]}`}>{status.label}</p>

      {status.kind === "out" ? (
        <p className="mt-1 text-sm text-neutral-700">
          We don&apos;t know when or if this item will be back in stock.
        </p>
      ) : (
        <div className="mt-4">
          <AddToCartPanel item={cartItem} />
        </div>
      )}

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-neutral-600">
        <dt>Ships from</dt>
        <dd>Amazon.com clone</dd>
        <dt>Sold by</dt>
        <dd>Amazon.com clone</dd>
        <dt>Returns</dt>
        <dd>30-day refund / replacement</dd>
      </dl>
    </div>
  );
}
