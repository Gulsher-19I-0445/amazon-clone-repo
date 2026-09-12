import type { RatingHistogram as Histogram } from "@/lib/reviews";
import { StarRating } from "./StarRating";

type RatingHistogramProps = {
  rating: number;
  reviewCount: number;
  histogram: Histogram;
};

// Left column of "Customer reviews": the average plus a 5★→1★ percentage bar
// per row, like amazon.com. Read-only, so the rows are plain list items.
export function RatingHistogram({ rating, reviewCount, histogram }: RatingHistogramProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <StarRating rating={rating} />
        <span className="text-lg font-medium">{rating.toFixed(1)} out of 5</span>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        {reviewCount.toLocaleString("en-US")} global {reviewCount === 1 ? "rating" : "ratings"}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {histogram.map(({ stars, percent }) => (
          <li key={stars} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-2 text-sm">
            <span className="sr-only">
              {percent}% of ratings are {stars} {stars === 1 ? "star" : "stars"}
            </span>
            <span aria-hidden="true" className="text-amz-link">
              {stars} star
            </span>
            <div aria-hidden="true" className="h-5 overflow-hidden rounded-sm border border-neutral-300 bg-neutral-100">
              <div className="h-full bg-amz-star" style={{ width: `${percent}%` }} />
            </div>
            <span aria-hidden="true" className="text-right text-amz-link">
              {percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
