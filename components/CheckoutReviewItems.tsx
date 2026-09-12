import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { OrderItemDto } from "@/lib/types";
import { HoverPrefetchLink } from "./HoverPrefetchLink";

type CheckoutReviewItemsProps = {
  items: OrderItemDto[];
  /** Shown on the checkout page; omitted on the confirmation page where the cart no longer applies. */
  changeHref?: string;
};

// Compact "Review items" list used by checkout step 3 and the confirmation
// page. Takes the order-item shape so both pages render lines identically.
export function CheckoutReviewItems({ items, changeHref }: CheckoutReviewItemsProps) {
  return (
    <div>
      <ul className="flex flex-col divide-y divide-amz-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <HoverPrefetchLink href={`/product/${item.productId}`} className="relative block h-20 w-20 shrink-0 bg-neutral-50">
              <Image src={item.thumbnail} alt={item.name} fill sizes="80px" className="object-contain" />
            </HoverPrefetchLink>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
              <HoverPrefetchLink
                href={`/product/${item.productId}`}
                className="line-clamp-2 font-medium leading-snug hover:text-amz-link-hover hover:underline"
              >
                {item.name}
              </HoverPrefetchLink>
              <span className="font-bold text-amz-price">{formatPrice(item.unitPriceCents)}</span>
              <span className="text-xs text-neutral-600">Quantity: {item.qty}</span>
            </div>
          </li>
        ))}
      </ul>

      {changeHref && (
        <Link href={changeHref} className="mt-3 inline-block text-sm text-amz-link hover:text-amz-link-hover hover:underline">
          Change quantities or delete
        </Link>
      )}
    </div>
  );
}
