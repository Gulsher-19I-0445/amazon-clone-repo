import Link from "next/link";
import { freeShippingGapCents } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

type CartSummaryProps = {
  itemCount: number;
  subtotalCents: number;
};

// Right-hand "Proceed to checkout" card. Pure props, so it works wherever the
// caller already has the totals (cart page now, checkout later).
export function CartSummary({ itemCount, subtotalCents }: CartSummaryProps) {
  const gap = freeShippingGapCents(subtotalCents);

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      {gap === 0 ? (
        <p className="flex items-start gap-2 text-xs">
          <span aria-hidden="true" className="mt-0.5 font-bold text-green-700">
            ✓
          </span>
          <span>
            <span className="text-green-700">Your order qualifies for FREE Shipping.</span>{" "}
            <span className="text-neutral-600">Choose this option at checkout.</span>
          </span>
        </p>
      ) : (
        <p className="text-xs text-neutral-700">
          Add <span className="font-bold text-amz-price">{formatPrice(gap)}</span> of eligible items to your
          order to qualify for FREE Shipping.
        </p>
      )}

      <p className="mt-3 text-lg">
        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
        <span data-testid="cart-subtotal" className="font-bold">
          {formatPrice(subtotalCents)}
        </span>
      </p>

      <Link
        href="/checkout"
        className="mt-4 block rounded-full bg-amz-yellow px-4 py-2 text-center text-sm shadow-sm hover:bg-amz-yellow-hover"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
