"use client";

import Link from "next/link";
import { selectItemCount, useCartStore } from "@/store/cart";
import { useHydrated } from "@/store/useHydrated";

export function CartIcon() {
  const hydrated = useHydrated();
  const storedCount = useCartStore(selectItemCount);
  // Render 0 until the persisted store is available on the client so the
  // server and first client render agree.
  const count = hydrated ? storedCount : 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="flex items-end gap-1 rounded-sm border border-transparent px-2 py-1 text-white hover:border-white"
    >
      <span className="relative">
        <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true">
          <path
            d="M2 3h5l1.2 4H36l-3.6 12.5a2 2 0 0 1-1.9 1.4H12.4L13 24h20v2.5H11.2a2 2 0 0 1-1.9-1.4L4.6 5.5H2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="29" r="2.2" fill="currentColor" />
          <circle cx="30" cy="29" r="2.2" fill="currentColor" />
        </svg>
        <span
          data-testid="cart-count"
          className="absolute left-1/2 top-[2px] -translate-x-1/2 text-base font-bold leading-none text-amz-orange"
        >
          {count}
        </span>
      </span>
      <span className="mb-[3px] hidden text-sm font-bold sm:inline">Cart</span>
    </Link>
  );
}
