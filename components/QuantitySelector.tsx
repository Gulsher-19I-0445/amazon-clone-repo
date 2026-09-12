"use client";

type QuantitySelectorProps = {
  value: number;
  options: number[];
  onChange: (qty: number) => void;
};

// Amazon's "Quantity: 1" dropdown. Options are already capped by the caller
// (lib/stock.ts) so the user cannot pick more than is in stock.
export function QuantitySelector({ value, options, onChange }: QuantitySelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span>Quantity:</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-amz-border bg-neutral-50 px-2 py-1 shadow-sm hover:bg-neutral-100"
      >
        {options.map((qty) => (
          <option key={qty} value={qty}>
            {qty}
          </option>
        ))}
      </select>
    </label>
  );
}
