import type { ReactNode } from "react";

type CheckoutStepProps = {
  number: number;
  title: string;
  children: ReactNode;
};

// One numbered section of Amazon's single-page checkout ("1  Shipping address").
export function CheckoutStep({ number, title, children }: CheckoutStepProps) {
  const headingId = `checkout-step-${number}`;
  return (
    <section aria-labelledby={headingId} className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-amz-border py-5 last:border-b-0">
      <span aria-hidden="true" className="text-lg font-bold text-neutral-800">
        {number}
      </span>
      <h2 id={headingId} className="text-lg font-bold text-neutral-800">
        {title}
      </h2>
      <div className="col-start-2 mt-3">{children}</div>
    </section>
  );
}
