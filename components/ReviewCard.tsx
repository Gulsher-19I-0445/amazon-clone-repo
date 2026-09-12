import { formatLongDate } from "@/lib/format";
import type { MockReview } from "@/lib/reviews";
import { StarRating } from "./StarRating";

type ReviewCardProps = {
  review: MockReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-1 text-sm">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-base font-medium text-neutral-700"
        >
          {review.author.charAt(0)}
        </span>
        <span>{review.author}</span>
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={review.stars} />
        <h4 className="font-bold">{review.title}</h4>
      </div>

      <p className="text-xs text-neutral-600">
        Reviewed in the United States on {formatLongDate(review.date)}
      </p>
      {review.verified && <p className="text-xs font-bold text-amz-orange-dark">Verified Purchase</p>}

      <p className="leading-relaxed text-neutral-800">{review.body}</p>

      {review.helpfulCount > 0 && (
        <p className="text-xs text-neutral-600">
          {review.helpfulCount.toLocaleString("en-US")}{" "}
          {review.helpfulCount === 1 ? "person" : "people"} found this helpful
        </p>
      )}
    </article>
  );
}
