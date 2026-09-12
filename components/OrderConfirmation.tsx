import Link from "next/link";
import { estimatedDeliveryWindow } from "@/lib/checkout";
import { formatLongDate, formatShortDate } from "@/lib/format";
import { describePaymentMethod } from "@/lib/payment";
import type { OrderDto } from "@/lib/types";
import { CheckoutReviewItems } from "./CheckoutReviewItems";
import { OrderSummary } from "./OrderSummary";

type OrderConfirmationProps = {
  order: OrderDto;
};

// Amazon's "Order placed, thanks!" page: what was bought, where it is going,
// and when to expect it. Reads only from the stored order.
export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const placedAt = new Date(order.createdAt);
  const delivery = estimatedDeliveryWindow(placedAt);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const { address } = order;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px] md:items-start">
      <div className="flex flex-col gap-4">
        <section aria-labelledby="confirmation-heading" className="rounded-md bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0 text-green-700">
              <circle cx="18" cy="18" r="17" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M10 18.5l5.5 5.5L26 13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h1 id="confirmation-heading" className="text-2xl font-medium text-green-800">
                Order placed, thanks!
              </h1>
              <p className="mt-1 text-sm text-neutral-700">
                Confirmation will be sent to <span className="font-medium">{address.email}</span>.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-amz-border pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-neutral-600">Order number</dt>
              <dd data-testid="order-id" className="font-medium break-all">
                {order.id}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-600">Order placed</dt>
              <dd className="font-medium">{formatLongDate(placedAt)}</dd>
            </div>
            <div>
              <dt className="text-neutral-600">Payment method</dt>
              <dd className="font-medium">{describePaymentMethod(order.payment)}</dd>
            </div>
            <div>
              <dt className="text-neutral-600">Shipping to</dt>
              <dd className="font-medium">
                <address className="not-italic">
                  {address.fullName}
                  <br />
                  {address.addressLine1}
                  {address.addressLine2 && (
                    <>
                      <br />
                      {address.addressLine2}
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </address>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="arriving-heading" className="rounded-md bg-white p-5 shadow-sm sm:p-6">
          <h2 id="arriving-heading" className="text-lg font-bold text-green-800">
            Arriving {formatShortDate(delivery.from)} - {formatShortDate(delivery.to)}
          </h2>
          <p className="mb-4 text-xs text-neutral-600">FREE Shipping · {itemCount} {itemCount === 1 ? "item" : "items"}</p>
          <CheckoutReviewItems items={order.items} />
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-amz-yellow px-6 py-2 text-sm shadow-sm hover:bg-amz-yellow-hover"
          >
            Continue shopping
          </Link>
          <Link
            href="/s?deals=true"
            className="rounded-full border border-amz-border bg-white px-6 py-2 text-sm shadow-sm hover:bg-neutral-50"
          >
            See today&apos;s deals
          </Link>
        </div>
      </div>

      <aside aria-label="Order summary" className="md:sticky md:top-24">
        <OrderSummary
          totals={{
            subtotalCents: order.subtotalCents,
            shippingCents: order.shippingCents,
            taxCents: order.taxCents,
            totalCents: order.totalCents,
          }}
          itemCount={itemCount}
        />
      </aside>
    </div>
  );
}
