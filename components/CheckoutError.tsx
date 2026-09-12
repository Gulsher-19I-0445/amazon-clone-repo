import type { ReactNode, Ref } from "react";

type CheckoutErrorProps = {
  title: string;
  children?: ReactNode;
  /** Focused by the parent after a failed submit so screen readers and keyboard users land on it. */
  ref?: Ref<HTMLDivElement>;
};

// Amazon's red-bordered "There was a problem" box, used for both the address
// validation summary and API failures.
export function CheckoutError({ title, children, ref }: CheckoutErrorProps) {
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      data-testid="checkout-error"
      className="flex gap-3 rounded-md border border-amz-price bg-white p-4 shadow-sm outline-none"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="mt-0.5 shrink-0 text-amz-price">
        <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M11 6v6m0 3.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <div className="text-sm">
        <p className="font-bold text-amz-price">{title}</p>
        {children && <div className="mt-1 text-neutral-800">{children}</div>}
      </div>
    </div>
  );
}
