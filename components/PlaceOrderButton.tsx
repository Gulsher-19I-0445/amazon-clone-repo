"use client";

type PlaceOrderButtonProps = {
  submitting: boolean;
  /** The form element this button submits, so it can sit outside the <form> in the summary card. */
  form: string;
};

export function PlaceOrderButton({ submitting, form }: PlaceOrderButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="submit"
        form={form}
        disabled={submitting}
        aria-busy={submitting}
        className="w-full rounded-full bg-amz-yellow px-4 py-2 text-sm shadow-sm hover:bg-amz-yellow-hover disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Placing your order…" : "Place your order"}
      </button>
      <p className="text-center text-xs text-neutral-600">
        By placing your order, you agree to this demo store&apos;s privacy notice and conditions of use.
      </p>
    </div>
  );
}
