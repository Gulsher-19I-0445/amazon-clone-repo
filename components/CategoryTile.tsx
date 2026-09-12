import Image from "next/image";
import Link from "next/link";
import { categoryLabel } from "@/lib/categories";
import type { CategoryTileData, TileQuadrantProduct } from "@/lib/homepage";

type CategoryTileProps = {
  tile: CategoryTileData<TileQuadrantProduct>;
};

// Amazon-style card: a title, a 2x2 grid of product photos each labelled with
// its category, and a "See more" link.
export function CategoryTile({ tile }: CategoryTileProps) {
  return (
    <article className="flex h-full flex-col bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold leading-tight">{tile.title}</h2>

      <ul className="mt-3 grid flex-1 grid-cols-2 gap-x-3 gap-y-2">
        {tile.quadrants.map((product) => (
          <li key={product.id}>
            <Link href={`/s?category=${product.category}`} className="group block">
              <div className="relative aspect-[1/0.9] w-full bg-neutral-50">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 11vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-1 truncate text-xs text-neutral-800 group-hover:text-amz-link-hover">
                {categoryLabel(product.category)}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={tile.href}
        className="mt-3 text-sm text-amz-link hover:text-amz-link-hover hover:underline"
      >
        See more
      </Link>
    </article>
  );
}
