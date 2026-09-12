"use client";

import { useHydrated } from "@/store/useHydrated";
import { selectWishlistCount, useWishlistStore } from "@/store/wishlist";
import { EmptyWishlist } from "./EmptyWishlist";
import { WishlistLineItem } from "./WishlistLineItem";

// Client half of /wishlist. The persisted store is only readable after
// hydration, so the first render is a skeleton rather than a misleading
// "your list is empty".
export function WishlistContents() {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const count = useWishlistStore(selectWishlistCount);
  const remove = useWishlistStore((s) => s.remove);

  if (!hydrated) {
    return <WishlistSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <section aria-labelledby="wishlist-heading" className="rounded-md bg-white p-4 shadow-sm md:p-6">
      <div className="border-b border-amz-border pb-2">
        <h1 id="wishlist-heading" className="text-2xl font-medium sm:text-[28px]">
          Your Wish List
        </h1>
        <p className="text-xs text-neutral-600">
          {count} {count === 1 ? "item" : "items"} · Private list, saved on this device
        </p>
      </div>

      <ul>
        {items.map((item) => (
          <WishlistLineItem key={item.id} item={item} onRemove={() => remove(item.id)} />
        ))}
      </ul>
    </section>
  );
}

function WishlistSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your Wish List" className="animate-pulse rounded-md bg-white p-6 shadow-sm">
      <div className="h-7 w-48 rounded bg-neutral-200" />
      {[0, 1].map((i) => (
        <div key={i} className="mt-6 flex gap-4">
          <div className="h-40 w-40 shrink-0 rounded bg-neutral-100" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 rounded bg-neutral-200" />
            <div className="h-4 w-1/4 rounded bg-neutral-100" />
            <div className="h-8 w-28 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
