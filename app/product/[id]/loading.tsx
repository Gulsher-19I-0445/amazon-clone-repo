import { ProductPageSkeleton } from "@/components/ProductPageSkeleton";

// Shown the moment a product link is followed, while page.tsx reads Neon.
export default function ProductLoading() {
  return <ProductPageSkeleton />;
}
