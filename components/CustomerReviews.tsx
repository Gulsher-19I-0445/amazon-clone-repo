import { buildReviewSummary } from "@/lib/reviews";
import type { Product } from "@/lib/types";
import { RatingHistogram } from "./RatingHistogram";
import { ReviewCard } from "./ReviewCard";

type CustomerReviewsProps = {
  product: Pick<Product, "id" | "rating" | "reviewCount">;
};

/** Anchor the "N ratings" link next to the product title jumps to. */
export const CUSTOMER_REVIEWS_ID = "customer-reviews";

// Server component, no I/O: the reviews are generated from the product row.
export function CustomerReviews({ product }: CustomerReviewsProps) {
  const summary = buildReviewSummary(product);
  const hasReviews = product.reviewCount > 0;

  return (
    <section
      id={CUSTOMER_REVIEWS_ID}
      aria-labelledby="reviews-heading"
      className="scroll-mt-4 rounded-md bg-white p-4 shadow-sm md:p-6"
    >
      <h2 id="reviews-heading" className="text-xl font-bold">
        Customer reviews
      </h2>

      {hasReviews ? (
        <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <RatingHistogram
              rating={summary.rating}
              reviewCount={summary.reviewCount}
              histogram={summary.histogram}
            />
          </div>

          <div className="md:col-span-8">
            <h3 className="text-base font-bold">Top reviews from the United States</h3>
            <div className="mt-3 flex flex-col gap-5">
              {summary.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-neutral-600">No customer reviews yet.</p>
      )}
    </section>
  );
}
