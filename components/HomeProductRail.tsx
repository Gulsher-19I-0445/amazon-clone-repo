import type { ProductListItem } from "@/lib/types";
import type { CarouselVariant } from "./CarouselProductCard";
import { HomeSectionError } from "./HomeSectionError";
import { ProductCarousel } from "./ProductCarousel";

type HomeProductRailProps = {
  title: string;
  seeAllHref: string;
  variant?: CarouselVariant;
  loadProducts: () => Promise<ProductListItem[]>;
};

// Server component: runs one product query and hands the result to the
// client-side carousel. Only the query is guarded so render bugs still surface.
export async function HomeProductRail({ title, seeAllHref, variant, loadProducts }: HomeProductRailProps) {
  let products: ProductListItem[];
  try {
    products = await loadProducts();
  } catch (error) {
    console.error(`HomeProductRail "${title}": failed to load products`, error);
    return <HomeSectionError />;
  }

  return <ProductCarousel title={title} products={products} seeAllHref={seeAllHref} variant={variant} />;
}
