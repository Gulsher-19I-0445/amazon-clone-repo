// Mock customer reviews for the PDP. Nothing is stored: everything is derived
// from the product's existing rating/reviewCount and a PRNG seeded by its id,
// so a product always shows the same histogram and the same reviews.

import type { Product } from "./types";

export type Stars = 1 | 2 | 3 | 4 | 5;

export type MockReview = {
  /** `${productId}-${index}`: a stable React key. */
  id: string;
  author: string;
  stars: Stars;
  title: string;
  body: string;
  /** Never crosses the network, so a Date is fine here. */
  date: Date;
  verified: boolean;
  helpfulCount: number;
};

/** Five rows, 5★ first. Percentages are integers that add up to 100. */
export type RatingHistogram = { stars: Stars; percent: number }[];

export type ReviewSummary = {
  rating: number;
  reviewCount: number;
  histogram: RatingHistogram;
  /** 0..MAX_REVIEWS_SHOWN, most helpful first. */
  reviews: MockReview[];
};

export const MAX_REVIEWS_SHOWN = 5;

// Percent of 5★,4★,3★,2★,1★ for each average rating from 1.0 to 5.0 in 0.5
// steps. Each row sums to 100 and its weighted mean sits close to its rating,
// so the bars visibly agree with the number next to them.
const HISTOGRAM_BANDS: readonly (readonly [number, number, number, number, number])[] = [
  [1, 1, 1, 3, 94], // 1.0
  [2, 3, 8, 17, 70], // 1.5
  [5, 8, 16, 26, 45], // 2.0
  [10, 14, 22, 26, 28], // 2.5
  [20, 20, 22, 18, 20], // 3.0
  [30, 26, 20, 12, 12], // 3.5
  [48, 26, 13, 8, 5], // 4.0
  [70, 18, 7, 3, 2], // 4.5
  [88, 8, 2, 1, 1], // 5.0
];

const STAR_ROWS: readonly Stars[] = [5, 4, 3, 2, 1];

/** Rating (clamped to 1..5, rounded to the nearest half) → percent per star. */
export function ratingHistogram(rating: number): RatingHistogram {
  const clamped = Math.max(1, Math.min(5, rating));
  const band = HISTOGRAM_BANDS[Math.round(clamped * 2) - 2] ?? HISTOGRAM_BANDS[0];
  return STAR_ROWS.map((stars, i) => ({ stars, percent: band[i] }));
}

// --- Seeded randomness -------------------------------------------------------

/** FNV-1a: turns a product id into a 32-bit seed. */
function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32: small, fast PRNG returning floats in [0, 1). */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Review text pools --------------------------------------------------------

const AUTHORS = [
  "Amazon Customer",
  "Priya S.",
  "Marcus T.",
  "J. Alvarez",
  "Dana K.",
  "Chris M.",
  "Samantha R.",
  "Kevin O.",
  "Leah W.",
  "Tom H.",
  "Nadia B.",
  "Ryan P.",
  "Emily C.",
  "Derek L.",
  "Olivia N.",
];

type ReviewText = { title: string; body: string };

const POSITIVE: readonly ReviewText[] = [
  {
    title: "Exactly as described",
    body: "Arrived two days early and matched the listing photos exactly. Solid build, no surprises. Would buy again without hesitation.",
  },
  {
    title: "Great value for the price",
    body: "I compared a few options before ordering and this one was the best balance of price and quality. Been using it daily for a month with zero issues.",
  },
  {
    title: "Better than expected",
    body: "Honestly I had low expectations for the price, but the quality is a step above what I paid for. Packaging was secure and everything worked out of the box.",
  },
  {
    title: "Bought a second one",
    body: "Liked the first one so much I ordered another as a gift. Easy to use, looks nice, and does what it says. Five stars from me.",
  },
  {
    title: "Does the job perfectly",
    body: "No complaints. Setup took a minute and it has performed consistently since. Shipping was quick and the item was well protected.",
  },
  {
    title: "Highly recommend",
    body: "This replaced an older version I had for years and it is a clear upgrade. Feels well made and the details are thoughtfully done.",
  },
];

const MIXED: readonly ReviewText[] = [
  {
    title: "Good, with a few caveats",
    body: "Works fine overall, but the finish scuffs more easily than I would like. For the price it is acceptable, just handle it with a bit of care.",
  },
  {
    title: "Decent but not amazing",
    body: "It does what it is supposed to. Nothing stood out as great or terrible. If you need one, it will do; if you are on the fence, maybe look at other options.",
  },
  {
    title: "Okay for occasional use",
    body: "Fine for light use around the house. I would not rely on it heavily. Shipping was fast and it arrived undamaged, which I appreciated.",
  },
  {
    title: "Smaller than I expected",
    body: "Check the dimensions before ordering - it is noticeably smaller than it looks in the photos. Quality is fine once you get past that.",
  },
  {
    title: "Mixed feelings",
    body: "Some parts feel premium, others feel cheap. It has held up for a few weeks so far. I am keeping it, but I am not sure I would reorder.",
  },
  {
    title: "Three stars, works as advertised",
    body: "Nothing wrong with it, but nothing special either. Instructions were a little vague. Average product at an average price.",
  },
];

const NEGATIVE: readonly ReviewText[] = [
  {
    title: "Stopped working after two weeks",
    body: "Worked well at first, then simply quit. Customer service offered a replacement but I would rather not go through that again. Disappointing.",
  },
  {
    title: "Not as pictured",
    body: "The color and material look nothing like the listing photos. Feels flimsy in hand. Returned it the same week.",
  },
  {
    title: "Arrived damaged",
    body: "The box was crushed and the item had a crack along one side. The return was easy, but I expected better packaging for something like this.",
  },
  {
    title: "Would not buy again",
    body: "Poor quality for the price. The parts do not fit together well and it wobbles. There are better options out there for the same money.",
  },
  {
    title: "Disappointed",
    body: "Looked promising but fell apart with normal use. I gave it a fair chance and it just does not hold up. Two stars only because shipping was fast.",
  },
  {
    title: "Save your money",
    body: "Cheaply made and the description overpromises. Mine had a defect out of the box. Sending it back and going with a different brand.",
  },
];

function textPoolFor(stars: Stars): readonly ReviewText[] {
  if (stars >= 4) return POSITIVE;
  if (stars === 3) return MIXED;
  return NEGATIVE;
}

// Reviews are dated relative to a fixed day, not "now", so a product's
// reviews never shift as the calendar moves.
const DATE_ANCHOR_MS = Date.UTC(2026, 8, 1);
const DATE_SPREAD_DAYS = 240;
const MS_PER_DAY = 86_400_000;

/** Draw a star value whose probability follows the histogram. */
function drawStars(histogram: RatingHistogram, random: () => number): Stars {
  let remaining = random() * 100;
  for (const row of histogram) {
    remaining -= row.percent;
    if (remaining < 0) return row.stars;
  }
  return 1;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildReviewSummary(product: Pick<Product, "id" | "rating" | "reviewCount">): ReviewSummary {
  const histogram = ratingHistogram(product.rating);
  const random = seededRandom(hashString(product.id));
  const count = Math.max(0, Math.min(MAX_REVIEWS_SHOWN, Math.floor(product.reviewCount)));

  const authors = shuffle(AUTHORS, random);
  // A random start per pool plus a running offset keeps texts distinct within
  // a product as long as we show no more reviews than a pool holds.
  const poolOffsets = new Map<readonly ReviewText[], number>();

  const reviews: MockReview[] = [];
  for (let i = 0; i < count; i++) {
    const stars = drawStars(histogram, random);
    const pool = textPoolFor(stars);
    const offset = poolOffsets.get(pool) ?? Math.floor(random() * pool.length);
    poolOffsets.set(pool, offset + 1);
    const text = pool[offset % pool.length];

    reviews.push({
      id: `${product.id}-${i}`,
      author: authors[i % authors.length],
      stars,
      title: text.title,
      body: text.body,
      date: new Date(DATE_ANCHOR_MS - Math.floor(random() * DATE_SPREAD_DAYS) * MS_PER_DAY),
      verified: random() < 0.8,
      // Squaring skews toward small counts, like real "helpful" votes.
      helpfulCount: Math.floor(random() ** 2 * 120),
    });
  }

  reviews.sort((a, b) => b.helpfulCount - a.helpfulCount || a.id.localeCompare(b.id));

  return { rating: product.rating, reviewCount: product.reviewCount, histogram, reviews };
}
