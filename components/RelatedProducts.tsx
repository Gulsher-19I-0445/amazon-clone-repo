import { getRelatedProducts } from "@/lib/products";
import type { ProductListItem } from "@/lib/types";
import { HomeSectionError } from "./HomeSectionError";
import { ProductCarousel } from "./ProductCarousel";

type RelatedProductsProps = {
  category: string;
  /** The product being viewed, left out of the rail. */
  productId: string;
};

// Server component: same-category rail under the PDP. Renders nothing when
// the product is alone in its category rather than an empty carousel.
export async function RelatedProducts({ category, productId }: RelatedProductsProps) {
  let products: ProductListItem[];
  try {
    products = await getRelatedProducts(category, productId);
  } catch (error) {
    console.error("RelatedProducts: failed to load products", error);
    return <HomeSectionError />;
  }

  if (products.length === 0) return null;

  return (
    <ProductCarousel
      title="Products related to this item"
      products={products}
      seeAllHref={`/s?category=${category}`}
    />
  );
}
