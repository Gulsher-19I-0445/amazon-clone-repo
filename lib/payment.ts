// Mock payment methods, presented like Amazon's saved cards. Real payment
// processing is out of scope (feature_list.json S1): nothing is ever charged
// and no card number exists anywhere - only a brand and last four digits.

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa-4242", brand: "Visa", last4: "4242" },
  { id: "mastercard-4444", brand: "Mastercard", last4: "4444" },
  { id: "amex-0005", brand: "American Express", last4: "0005" },
];

export const DEFAULT_PAYMENT_METHOD_ID = "visa-4242";

export function findPaymentMethod(id: string): PaymentMethod | null {
  return MOCK_PAYMENT_METHODS.find((method) => method.id === id) ?? null;
}

/** "Visa ending in 4242" */
export function describePaymentMethod(method: { brand: string; last4: string }): string {
  return `${method.brand} ending in ${method.last4}`;
}
