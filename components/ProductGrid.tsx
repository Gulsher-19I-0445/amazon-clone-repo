import type { ProductListItem } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: ProductListItem[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

/** Same footprint as the grid, shown while products load. */
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading products"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="animate-pulse rounded-md bg-white p-4 shadow-sm">
          <div className="aspect-square w-full rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-5/6 rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200" />
          <div className="mt-3 h-6 w-1/3 rounded bg-neutral-200" />
        </li>
      ))}
    </ul>
  );
}
