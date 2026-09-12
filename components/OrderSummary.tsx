import type { ReactNode } from "react";
import type { OrderTotals } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";

type OrderSummaryProps = {
  totals: OrderTotals;
  itemCount: number;
  /** Rendered above the totals on checkout (the Place order button); nothing on the confirmation page. */
  action?: ReactNode;
};

// Amazon's right-hand "Order Summary" card. Pure props so checkout and the
// confirmation page show the same breakdown.
export function OrderSummary({ totals, itemCount, action }: OrderSummaryProps) {
  const rows: [string, number][] = [
    [`Items (${itemCount}):`, totals.subtotalCents],
    ["Shipping & handling:", totals.shippingCents],
    ["Total before tax:", totals.subtotalCents + totals.shippingCents],
    ["Estimated tax to be collected:", totals.taxCents],
  ];

  return (
    <div className="rounded-md border border-amz-border bg-white p-5 shadow-sm">
      {action && <div className="border-b border-amz-border pb-4">{action}</div>}

      <h2 className={`text-lg font-bold ${action ? "mt-4" : ""}`}>Order Summary</h2>
      <dl className="mt-2 flex flex-col gap-1 text-sm">
        {rows.map(([label, cents]) => (
          <div key={label} className="flex justify-between">
            <dt>{label}</dt>
            <dd>{formatPrice(cents)}</dd>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-amz-border pt-2 text-lg font-bold text-amz-price">
          <dt>Order total:</dt>
          <dd data-testid="order-total">{formatPrice(totals.totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}
