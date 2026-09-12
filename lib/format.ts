const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** 123456 → "$1,234.56" */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

/**
 * Amazon renders prices as a small "$", large dollars and superscript cents.
 * 123456 → { dollars: "1,234", cents: "56" }
 */
export function splitPrice(cents: number): { dollars: string; cents: string } {
  const [dollars = "0", fraction = "00"] = usd.format(cents / 100).replace("$", "").split(".");
  return { dollars, cents: fraction };
}
