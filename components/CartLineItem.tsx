"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { MAX_QTY_PER_ADD, quantityOptions, stockStatus } from "@/lib/stock";
import type { CartItem } from "@/lib/types";

type CartLineItemProps = {
  item: CartItem;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
};

const stockClass = {
  in_stock: "text-green-700",
  low: "text-amz-price",
  out: "text-amz-price",
} as const;

// One row of the cart: thumbnail, title + stock, quantity dropdown with
// Amazon's "0 (Delete)" first option, and the line total on the right.
export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const href = `/product/${item.productId}`;
  const status = stockStatus(item.stock);
  // The dropdown must still list the current quantity when repeated adds
  // pushed the line past the per-add cap.
  const options = quantityOptions(item.stock, Math.max(MAX_QTY_PER_ADD, item.qty));
  const selectId = `qty-${item.productId}`;

  return (
    <li className="flex gap-3 border-b border-amz-border py-4 last:border-b-0 sm:gap-4">
      <Link href={href} className="relative block h-24 w-24 shrink-0 bg-neutral-50 sm:h-44 sm:w-44">
        <Image src={item.thumbnail} alt={item.name} fill sizes="(min-width: 640px) 176px, 96px" className="object-contain" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} className="line-clamp-3 text-base font-medium leading-snug hover:text-amz-link-hover sm:text-lg">
            {item.name}
          </Link>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold">{formatPrice(item.priceCents * item.qty)}</p>
            {item.qty > 1 && <p className="text-xs text-neutral-600">{formatPrice(item.priceCents)} each</p>}
          </div>
        </div>

        <p className={`text-xs ${stockClass[status.kind]}`}>{status.label}</p>
        <p className="text-xs text-neutral-600">Eligible for FREE Shipping</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <label htmlFor={selectId} className="sr-only">
            Quantity for {item.name}
          </label>
          <select
            id={selectId}
            value={item.qty}
            onChange={(event) => onQuantityChange(Number(event.target.value))}
            className="rounded-lg border border-amz-border bg-neutral-50 px-2 py-1 shadow-sm hover:bg-neutral-100"
          >
            <option value={0}>0 (Delete)</option>
            {options.map((qty) => (
              <option key={qty} value={qty}>
                Qty: {qty}
              </option>
            ))}
          </select>

          <span className="text-amz-border" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="py-1 text-amz-link hover:text-amz-link-hover hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
