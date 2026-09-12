import Image from "next/image";
import Link from "next/link";
import { discountPercent } from "@/lib/deals";
import { formatPrice, splitPrice } from "@/lib/format";
import type { ProductListItem } from "@/lib/types";
import { StarRating } from "./StarRating";

export type CarouselVariant = "deals" | "default";

type CarouselProductCardProps = {
  product: ProductListItem;
  variant: CarouselVariant;
};

// Compact card for horizontal rails. Fixed width so the rail's scrollWidth is
// known before images load (ProductCarousel relies on that to decide whether
// to show its arrows).
export function CarouselProductCard({ product, variant }: CarouselProductCardProps) {
  const href = `/product/${product.id}`;
  const price = splitPrice(product.priceCents);
  const percentOff = discountPercent(product.priceCents, product.listPriceCents);
  const showDeal = variant === "deals" && percentOff > 0;

  return (
    <article className="w-[180px] shrink-0 snap-start sm:w-[210px]">
      <Link href={href} className="relative block aspect-square w-full bg-neutral-50">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="210px"
          className="object-contain"
        />
      </Link>

      {showDeal && (
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-sm bg-amz-price px-1.5 py-0.5 text-xs font-bold text-white">
            {percentOff}% off
          </span>
          <span className="text-xs font-bold text-amz-price">Limited time deal</span>
        </div>
      )}

      <div className="mt-1 flex items-baseline gap-2">
        <span className="flex items-start text-neutral-900" aria-label={formatPrice(product.priceCents)}>
          <span className="mt-[2px] text-xs">$</span>
          <span className="text-xl font-medium leading-none">{price.dollars}</span>
          <span className="mt-[2px] text-xs">{price.cents}</span>
        </span>
        {product.listPriceCents !== null && product.listPriceCents > product.priceCents && (
          <span className="text-xs text-neutral-500">
            List: <s>{formatPrice(product.listPriceCents)}</s>
          </span>
        )}
      </div>

      <Link href={href} className="mt-1 line-clamp-2 text-sm leading-snug hover:text-amz-link-hover">
        {product.name}
      </Link>

      {variant === "default" && <StarRating rating={product.rating} reviewCount={product.reviewCount} />}
    </article>
  );
}
