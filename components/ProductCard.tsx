import Image from "next/image";
import Link from "next/link";
import { formatPrice, splitPrice } from "@/lib/format";
import type { ProductListItem } from "@/lib/types";
import { StarRating } from "./StarRating";
import { WishlistButton } from "./WishlistButton";

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = splitPrice(product.priceCents);
  const href = `/product/${product.id}`;

  return (
    <article className="flex h-full flex-col rounded-md bg-white p-4 shadow-sm">
      {/* The heart sits beside the image link, not inside it, so a tap never navigates. */}
      <div className="relative">
        <Link href={href} className="relative block aspect-square w-full bg-neutral-50">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain"
          />
        </Link>
        <WishlistButton variant="heart" product={product} />
      </div>

      <Link
        href={href}
        className="mt-3 line-clamp-2 text-base leading-snug text-neutral-900 hover:text-amz-link-hover"
      >
        {product.name}
      </Link>

      <StarRating rating={product.rating} reviewCount={product.reviewCount} />

      <div className="mt-1 flex items-baseline gap-2">
        <span className="flex items-start text-neutral-900" aria-label={formatPrice(product.priceCents)}>
          <span className="mt-[3px] text-xs">$</span>
          <span className="text-2xl font-medium leading-none">{price.dollars}</span>
          <span className="mt-[3px] text-xs">{price.cents}</span>
        </span>
        {product.listPriceCents !== null && product.listPriceCents > product.priceCents && (
          <span className="text-xs text-neutral-500">
            List: <s>{formatPrice(product.listPriceCents)}</s>
          </span>
        )}
      </div>

      {product.stock === 0 ? (
        <p className="mt-auto pt-2 text-sm text-amz-price">Currently unavailable</p>
      ) : (
        <p className="mt-auto pt-2 text-xs text-neutral-600">
          FREE delivery <span className="font-bold">Tomorrow</span>
        </p>
      )}
    </article>
  );
}
