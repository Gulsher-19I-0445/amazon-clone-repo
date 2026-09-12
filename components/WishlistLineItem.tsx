"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NewCartItem } from "@/lib/cart";
import { formatLongDate, formatPrice, splitPrice } from "@/lib/format";
import { addableQuantity, stockStatus } from "@/lib/stock";
import type { WishlistItem } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { HoverPrefetchLink } from "./HoverPrefetchLink";
import { StarRating } from "./StarRating";

type WishlistLineItemProps = {
  item: WishlistItem;
  onRemove: () => void;
};

type AddResult = "added" | "already_in_cart";

const stockClass = {
  in_stock: "text-green-700",
  low: "text-amz-price",
  out: "text-amz-price",
} as const;

// One saved product: thumbnail, title, rating, price, stock and the
// "Add to Cart" / "Delete" actions, laid out like a cart row.
export function WishlistLineItem({ item, onRemove }: WishlistLineItemProps) {
  const href = `/product/${item.id}`;
  const status = stockStatus(item.stock);
  const price = splitPrice(item.priceCents);

  const addItem = useCartStore((s) => s.addItem);
  // This component only renders after hydration (WishlistContents gates it),
  // so the persisted cart is safe to read directly.
  const inCart = useCartStore((s) => s.items.find((line) => line.productId === item.id)?.qty ?? 0);
  const [result, setResult] = useState<AddResult | null>(null);

  const handleAddToCart = () => {
    const addable = addableQuantity(1, item.stock, inCart);
    if (addable.qty === 0) {
      setResult("already_in_cart");
      return;
    }
    const cartItem: NewCartItem = {
      productId: item.id,
      name: item.name,
      priceCents: item.priceCents,
      thumbnail: item.thumbnail,
      stock: item.stock,
    };
    addItem(cartItem, 1);
    setResult("added");
  };

  return (
    <li className="flex gap-3 border-b border-amz-border py-4 last:border-b-0 sm:gap-4">
      <HoverPrefetchLink href={href} className="relative block h-24 w-24 shrink-0 bg-neutral-50 sm:h-40 sm:w-40">
        <Image src={item.thumbnail} alt={item.name} fill sizes="(min-width: 640px) 160px, 96px" className="object-contain" />
      </HoverPrefetchLink>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <HoverPrefetchLink
          href={href}
          className="line-clamp-3 text-base font-medium leading-snug hover:text-amz-link-hover sm:text-lg"
        >
          {item.name}
        </HoverPrefetchLink>
        <StarRating rating={item.rating} reviewCount={item.reviewCount} />

        <div className="flex items-baseline gap-2">
          <span className="flex items-start text-neutral-900" aria-label={formatPrice(item.priceCents)}>
            <span className="mt-[3px] text-xs">$</span>
            <span className="text-2xl font-medium leading-none">{price.dollars}</span>
            <span className="mt-[3px] text-xs">{price.cents}</span>
          </span>
          {item.listPriceCents !== null && item.listPriceCents > item.priceCents && (
            <span className="text-xs text-neutral-500">
              List: <s>{formatPrice(item.listPriceCents)}</s>
            </span>
          )}
        </div>

        <p className={`text-xs ${stockClass[status.kind]}`}>{status.label}</p>
        <p className="text-xs text-neutral-600">Added {formatLongDate(new Date(item.addedAt))}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={status.kind === "out"}
            className="rounded-full bg-amz-yellow px-5 py-1.5 shadow-sm hover:bg-amz-yellow-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
          <span className="text-amz-border" aria-hidden="true">
            |
          </span>
          <button type="button" onClick={onRemove} className="py-1 text-amz-link hover:text-amz-link-hover hover:underline">
            Delete
          </button>
        </div>

        <p aria-live="polite" className="text-sm">
          {result === "added" ? (
            <span className="text-green-700">Added to cart. </span>
          ) : result === "already_in_cart" ? (
            <span className="text-amz-price">Your cart already has all {item.stock} in stock. </span>
          ) : null}
          {result !== null && (
            <Link href="/cart" className="text-amz-link hover:text-amz-link-hover hover:underline">
              View cart
            </Link>
          )}
        </p>
      </div>
    </li>
  );
}
