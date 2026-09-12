"use client";

import type { ProductListItem } from "@/lib/types";
import { isSaved } from "@/lib/wishlist";
import { useHydrated } from "@/store/useHydrated";
import { useWishlistStore } from "@/store/wishlist";

type WishlistButtonProps = {
  product: ProductListItem;
  /** `heart`: round badge over a card image. `button`: Amazon's "Add to List" pill on the PDP. */
  variant: "heart" | "button";
};

function HeartIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.7-9.6-9.3C.9 8.3 2.8 4.5 6.4 4.5c2 0 3.6 1.1 4.6 2.7 1-1.6 2.6-2.7 4.6-2.7 3.6 0 5.5 3.8 4 7.2C19.5 16.3 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Toggles a product in the persisted wishlist. Selecting a boolean (not the
// items array) means a toggle only re-renders the hearts whose value changed.
export function WishlistButton({ product, variant }: WishlistButtonProps) {
  const hydrated = useHydrated();
  const storedSaved = useWishlistStore((s) => isSaved(s.items, product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  // Unsaved until the persisted store is readable so server and first client
  // render agree (same pattern as CartIcon).
  const saved = hydrated && storedSaved;

  if (variant === "heart") {
    return (
      <button
        type="button"
        onClick={() => toggle(product)}
        aria-label="Save to Wish List"
        aria-pressed={saved}
        data-testid="wishlist-heart"
        className="absolute right-0 top-0 z-10 p-1"
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-neutral-100 ${
            saved ? "text-amz-price" : "text-neutral-700"
          }`}
        >
          <HeartIcon filled={saved} size={18} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      data-testid="wishlist-button"
      className="flex w-full items-center justify-center gap-2 rounded-full border border-amz-border bg-neutral-50 px-4 py-2 text-sm shadow-sm hover:bg-neutral-100"
    >
      <span className={saved ? "text-amz-price" : "text-neutral-700"}>
        <HeartIcon filled={saved} size={16} />
      </span>
      {saved ? "Added to List" : "Add to List"}
    </button>
  );
}
