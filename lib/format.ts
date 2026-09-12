const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** 123456 → "$1,234.56" */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** 2026-09-15 → "Sep 15" (delivery estimates) */
export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}

/** 2026-09-12 → "September 12, 2026" (order placed date) */
export function formatLongDate(date: Date): string {
  return longDate.format(date);
}

/**
 * Amazon renders prices as a small "$", large dollars and superscript cents.
 * 123456 → { dollars: "1,234", cents: "56" }
 */
export function splitPrice(cents: number): { dollars: string; cents: string } {
  const [dollars = "0", fraction = "00"] = usd.format(cents / 100).replace("$", "").split(".");
  return { dollars, cents: fraction };
}
