import { discountPercent } from "@/lib/deals";
import { formatPrice, splitPrice } from "@/lib/format";

type PriceBlockProps = {
  priceCents: number;
  listPriceCents: number | null;
  /** "lg" for the product title column, "md" for the buy box. */
  size?: "md" | "lg";
};

// Amazon's price treatment: red "-NN%" when discounted, small "$", large
// dollars, superscript cents, then the struck-through list price underneath.
export function PriceBlock({ priceCents, listPriceCents, size = "lg" }: PriceBlockProps) {
  const price = splitPrice(priceCents);
  const percentOff = discountPercent(priceCents, listPriceCents);
  const dollarsClass = size === "lg" ? "text-[28px]" : "text-2xl";

  return (
    <div>
      <div className="flex items-start gap-2">
        {percentOff > 0 && (
          <span className={`${dollarsClass} font-light leading-none text-amz-price`}>-{percentOff}%</span>
        )}
        <span className="flex items-start text-neutral-900" aria-label={formatPrice(priceCents)}>
          <span className="mt-[3px] text-sm">$</span>
          <span className={`${dollarsClass} font-medium leading-none`}>{price.dollars}</span>
          <span className="mt-[3px] text-sm">{price.cents}</span>
        </span>
      </div>
      {percentOff > 0 && listPriceCents !== null && (
        <p className="mt-1 text-xs text-neutral-600">
          List Price: <s>{formatPrice(listPriceCents)}</s>
        </p>
      )}
    </div>
  );
}
