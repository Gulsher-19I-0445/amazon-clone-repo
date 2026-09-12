import { describe, expect, it } from "vitest";
import { buildReviewSummary, MAX_REVIEWS_SHOWN, ratingHistogram } from "./reviews";

describe("ratingHistogram", () => {
  it("always adds up to 100 percent", () => {
    for (let rating = 1; rating <= 5; rating += 0.1) {
      const total = ratingHistogram(rating).reduce((sum, row) => sum + row.percent, 0);
      expect(total, `rating ${rating.toFixed(1)}`).toBe(100);
    }
  });

  it("is dominated by 5 stars for a highly rated product", () => {
    const [five, ...rest] = ratingHistogram(4.8);
    expect(five.stars).toBe(5);
    for (const row of rest) expect(five.percent).toBeGreaterThan(row.percent);
  });

  it("is dominated by 1 star for a poorly rated product", () => {
    const rows = ratingHistogram(1.3);
    const one = rows[rows.length - 1];
    expect(one.stars).toBe(1);
    for (const row of rows.slice(0, -1)) expect(one.percent).toBeGreaterThan(row.percent);
  });

  it("clamps ratings outside 1..5", () => {
    expect(ratingHistogram(9)).toEqual(ratingHistogram(5));
    expect(ratingHistogram(-2)).toEqual(ratingHistogram(1));
  });
});

describe("buildReviewSummary", () => {
  const product = { id: "clx123abc", rating: 4.6, reviewCount: 312 };

  it("returns the same reviews for the same product every time", () => {
    expect(buildReviewSummary(product)).toEqual(buildReviewSummary(product));
  });

  it("shows no reviews when the product has none", () => {
    expect(buildReviewSummary({ ...product, reviewCount: 0 }).reviews).toEqual([]);
  });

  it("never shows more reviews than the product has, or than the cap", () => {
    expect(buildReviewSummary({ ...product, reviewCount: 2 }).reviews).toHaveLength(2);
    expect(buildReviewSummary(product).reviews).toHaveLength(MAX_REVIEWS_SHOWN);
  });

  it("produces well-formed reviews sorted by helpfulness", () => {
    const { reviews } = buildReviewSummary(product);
    for (const review of reviews) {
      expect(review.stars).toBeGreaterThanOrEqual(1);
      expect(review.stars).toBeLessThanOrEqual(5);
      expect(review.title).not.toBe("");
      expect(review.date).toBeInstanceOf(Date);
    }
    const helpful = reviews.map((r) => r.helpfulCount);
    expect(helpful).toEqual([...helpful].sort((a, b) => b - a));
  });
});
