"use client";

import { formatPrice } from "@/lib/format";
import { selectItemCount, selectSubtotalCents, useCartStore } from "@/store/cart";
import { useHydrated } from "@/store/useHydrated";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";

// Client half of /cart. The persisted store is only readable after hydration,
// so the first render is a skeleton rather than a misleading "cart is empty".
export function CartContents() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotalCents);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px] md:items-start">
      {/* Summary card comes first on phones (Amazon's mobile order), right column on desktop. */}
      <aside aria-label="Order summary" className="md:col-start-2 md:row-start-1 md:sticky md:top-24">
        <CartSummary itemCount={itemCount} subtotalCents={subtotal} />
      </aside>

      <section aria-labelledby="cart-heading" className="rounded-md bg-white p-4 shadow-sm md:col-start-1 md:row-start-1 md:p-6">
        <div className="flex items-end justify-between border-b border-amz-border pb-2">
          <h1 id="cart-heading" className="text-2xl font-medium sm:text-[28px]">
            Shopping Cart
          </h1>
          <span className="text-xs text-neutral-600">Price</span>
        </div>

        <ul>
          {items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </ul>

        <p className="border-t border-amz-border pt-3 text-right text-lg">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </p>
      </section>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your cart" className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
      <div className="h-32 rounded-md bg-white shadow-sm md:col-start-2" />
      <div className="rounded-md bg-white p-6 shadow-sm md:col-start-1 md:row-start-1">
        <div className="h-7 w-48 rounded bg-neutral-200" />
        {[0, 1].map((i) => (
          <div key={i} className="mt-6 flex gap-4">
            <div className="h-44 w-44 shrink-0 rounded bg-neutral-100" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 rounded bg-neutral-200" />
              <div className="h-4 w-1/4 rounded bg-neutral-100" />
              <div className="h-8 w-24 rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
