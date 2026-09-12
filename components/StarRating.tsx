type StarRatingProps = {
  rating: number;
  reviewCount?: number;
};

// Renders five stars with fractional fill via a clipped overlay.
export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <div className="flex items-center gap-1 text-sm" aria-label={`${rating} out of 5 stars`}>
      <span className="relative inline-block leading-none text-neutral-300" aria-hidden="true">
        <span>★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-amz-star"
          style={{ width: `${percent}%` }}
        >
          ★★★★★
        </span>
      </span>
      {reviewCount !== undefined && (
        <span className="text-amz-link">{reviewCount.toLocaleString("en-US")}</span>
      )}
    </div>
  );
}
