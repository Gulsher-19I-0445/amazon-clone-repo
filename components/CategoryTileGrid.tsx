import { pickTileProducts, type CategoryTileConfig, type TileQuadrantProduct } from "@/lib/homepage";
import { getProductsInCategories } from "@/lib/products";
import { CategoryTile } from "./CategoryTile";
import { HomeSectionError } from "./HomeSectionError";

type CategoryTileGridProps = {
  tiles: CategoryTileConfig[];
};

const gridClass = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4";

// Server component: one query for every category the tiles reference, then
// a pure split into 2x2 quadrants. Only the query is guarded so genuine
// render bugs still surface.
export async function CategoryTileGrid({ tiles }: CategoryTileGridProps) {
  const slugs = tiles.flatMap((tile) => tile.categories);

  let products: TileQuadrantProduct[];
  try {
    products = await getProductsInCategories(slugs);
  } catch (error) {
    console.error("CategoryTileGrid: failed to load products", error);
    return <HomeSectionError />;
  }

  return (
    <ul className={gridClass}>
      {pickTileProducts(tiles, products).map((tile) => (
        <li key={tile.title}>
          <CategoryTile tile={tile} />
        </li>
      ))}
    </ul>
  );
}

/** Same footprint as the grid, shown while the tiles stream in. */
export function CategoryTileGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul aria-busy="true" aria-label="Loading categories" className={gridClass}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="animate-pulse bg-white p-5 shadow-sm">
          <div className="h-6 w-3/4 rounded bg-neutral-200" />
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j}>
                <div className="aspect-[1/0.9] w-full rounded bg-neutral-200" />
                <div className="mt-1 h-3 w-2/3 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
          <div className="mt-3 h-4 w-1/4 rounded bg-neutral-200" />
        </li>
      ))}
    </ul>
  );
}
