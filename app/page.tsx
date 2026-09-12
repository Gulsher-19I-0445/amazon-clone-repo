import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTileGrid, CategoryTileGridSkeleton } from "@/components/CategoryTileGrid";
import { HeroBanner } from "@/components/HeroBanner";
import { HomeProductRail } from "@/components/HomeProductRail";
import { ProductCarouselSkeleton } from "@/components/ProductCarousel";
import { rankByDiscount } from "@/lib/deals";
import { CATEGORY_TILES } from "@/lib/homepage";
import { getFeaturedProducts, getTopRatedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Amazon.com clone: Spend less. Smile more.",
};

// Rendered per request: the sections below read Neon at request time and
// stream in behind their skeletons instead of being frozen at build time.
export const dynamic = "force-dynamic";

const RAIL_SIZE = 12;

const topTiles = CATEGORY_TILES.slice(0, 4);
const bottomTiles = CATEGORY_TILES.slice(4);

async function loadDeals() {
  return rankByDiscount(await getFeaturedProducts()).slice(0, RAIL_SIZE);
}

function loadTopPicks() {
  return getTopRatedProducts(RAIL_SIZE);
}

export default function HomePage() {
  return (
    <main className="flex-1 pb-8">
      <HeroBanner />

      {/* `relative` so this stacks above the (positioned) hero it overlaps. */}
      <div className="relative mx-auto -mt-28 flex max-w-[1500px] flex-col gap-5 px-4 lg:-mt-[300px]">
        <Suspense fallback={<CategoryTileGridSkeleton />}>
          <CategoryTileGrid tiles={topTiles} />
        </Suspense>

        <Suspense fallback={<ProductCarouselSkeleton />}>
          <HomeProductRail title="Today's Deals" seeAllHref="/s" variant="deals" loadProducts={loadDeals} />
        </Suspense>

        <Suspense fallback={<ProductCarouselSkeleton />}>
          <HomeProductRail title="Top picks for you" seeAllHref="/s" loadProducts={loadTopPicks} />
        </Suspense>

        <Suspense fallback={<CategoryTileGridSkeleton />}>
          <CategoryTileGrid tiles={bottomTiles} />
        </Suspense>
      </div>
    </main>
  );
}
