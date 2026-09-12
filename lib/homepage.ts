// Static homepage content. Category slugs must match Product.category
// (see lib/categories.ts); the tiles pull real product thumbnails at runtime.

export type HeroSlide = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  /** Tailwind gradient classes for the slide background. */
  background: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Deals on the latest tech",
    subtitle: "Smartphones, laptops and tablets at their lowest prices of the season.",
    ctaLabel: "Shop electronics",
    href: "/s?category=smartphones",
    background: "bg-gradient-to-r from-[#0f2a3f] via-[#1c4966] to-[#37a2c6]",
  },
  {
    title: "New season, new look",
    subtitle: "Fresh arrivals in dresses, shirts, shoes and bags.",
    ctaLabel: "Shop fashion",
    href: "/s?category=womens-dresses",
    background: "bg-gradient-to-r from-[#5b2a3c] via-[#a13d5e] to-[#f2a7bb]",
  },
  {
    title: "Everything for your home",
    subtitle: "Furniture, decor and kitchen essentials delivered tomorrow.",
    ctaLabel: "Shop home",
    href: "/s?category=furniture",
    background: "bg-gradient-to-r from-[#2f4a2a] via-[#4f7a3f] to-[#b9d98a]",
  },
];

export type CategoryTileConfig = {
  title: string;
  /** One to four category slugs; products from these fill the 2x2 quadrants. */
  categories: string[];
  /** Where "See more" goes. */
  href: string;
};

export const CATEGORY_TILES: CategoryTileConfig[] = [
  {
    title: "Shop deals in Electronics",
    categories: ["smartphones", "laptops", "tablets", "mobile-accessories"],
    href: "/s?category=smartphones",
  },
  {
    title: "Fashion trends you like",
    categories: ["womens-dresses", "mens-shirts", "womens-shoes", "womens-bags"],
    href: "/s?category=womens-dresses",
  },
  {
    title: "Beauty & personal care",
    categories: ["beauty", "fragrances", "skin-care"],
    href: "/s?category=beauty",
  },
  {
    title: "Refresh your space",
    categories: ["furniture", "home-decoration", "kitchen-accessories"],
    href: "/s?category=furniture",
  },
  {
    title: "Gear up for sports",
    categories: ["sports-accessories"],
    href: "/s?category=sports-accessories",
  },
  {
    title: "Watches & jewellery",
    categories: ["mens-watches", "womens-watches", "womens-jewellery"],
    href: "/s?category=mens-watches",
  },
  {
    title: "Stock up on groceries",
    categories: ["groceries"],
    href: "/s?category=groceries",
  },
  {
    title: "Wheels & rides",
    categories: ["vehicle", "motorcycle"],
    href: "/s?category=vehicle",
  },
];

export const QUADRANTS_PER_TILE = 4;

/** Minimum a product needs to be shown as a tile quadrant. */
export type TileQuadrantProduct = {
  id: string;
  category: string;
  name: string;
  thumbnail: string;
};

export type CategoryTileData<P extends TileQuadrantProduct> = CategoryTileConfig & {
  quadrants: P[];
};

/**
 * Picks up to four products per tile, round-robin across the tile's
 * categories so a tile with fewer categories than quadrants still fills up
 * (e.g. one category contributes all four). Products are consumed in the
 * order given, so pass them pre-sorted by whatever should surface first.
 */
export function pickTileProducts<P extends TileQuadrantProduct>(
  tiles: CategoryTileConfig[],
  products: P[],
): CategoryTileData<P>[] {
  const byCategory = new Map<string, P[]>();
  for (const product of products) {
    const bucket = byCategory.get(product.category) ?? [];
    bucket.push(product);
    byCategory.set(product.category, bucket);
  }

  return tiles.map((tile) => {
    const queues = tile.categories.map((slug) => [...(byCategory.get(slug) ?? [])]);
    const quadrants: P[] = [];

    let exhausted = false;
    while (quadrants.length < QUADRANTS_PER_TILE && !exhausted) {
      exhausted = true;
      for (const queue of queues) {
        const next = queue.shift();
        if (next === undefined) continue;
        exhausted = false;
        quadrants.push(next);
        if (quadrants.length === QUADRANTS_PER_TILE) break;
      }
    }

    return { ...tile, quadrants };
  });
}
