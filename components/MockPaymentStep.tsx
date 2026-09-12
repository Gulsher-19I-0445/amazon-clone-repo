"use client";

import { describePaymentMethod, MOCK_PAYMENT_METHODS } from "@/lib/payment";

type MockPaymentStepProps = {
  value: string;
  onChange: (paymentMethodId: string) => void;
};

// Amazon's "Your credit and debit cards" list, backed by demo cards. Real
// payment processing is intentionally out of scope; nothing is charged.
export function MockPaymentStep({ value, onChange }: MockPaymentStepProps) {
  return (
    <fieldset className="flex max-w-xl flex-col gap-2">
      <legend className="mb-2 text-sm font-bold">Your credit and debit cards</legend>

      {MOCK_PAYMENT_METHODS.map((method) => {
        const checked = method.id === value;
        return (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
              checked ? "border-amz-orange bg-orange-50" : "border-amz-border hover:bg-neutral-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={checked}
              onChange={() => onChange(method.id)}
              className="accent-amz-orange-dark"
            />
            <CardBadge brand={method.brand} />
            <span>
              <span className="font-medium">{describePaymentMethod(method)}</span>
              <span className="block text-xs text-neutral-600">Demo card - nothing will be charged</span>
            </span>
          </label>
        );
      })}

      <p className="mt-1 text-xs text-neutral-600">
        This is a demo store: checkout does not connect to a payment processor. Pick any card to continue.
      </p>
    </fieldset>
  );
}

const badgeStyle: Record<string, { label: string; className: string }> = {
  Visa: { label: "VISA", className: "bg-blue-800" },
  Mastercard: { label: "MC", className: "bg-red-600" },
  "American Express": { label: "AMEX", className: "bg-sky-600" },
};

function CardBadge({ brand }: { brand: string }) {
  const badge = badgeStyle[brand] ?? { label: "CARD", className: "bg-neutral-700" };
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-10 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold tracking-wide text-white ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
