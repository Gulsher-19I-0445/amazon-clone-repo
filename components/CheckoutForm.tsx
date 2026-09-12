"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { calculateTotals, emptyAddress, validateAddress, type AddressErrors } from "@/lib/checkout";
import { DEFAULT_PAYMENT_METHOD_ID } from "@/lib/payment";
import type { CreateOrderRequest, CreateOrderResponse, OrderErrorResponse, ShippingAddress } from "@/lib/types";
import { selectItemCount, selectSubtotalCents, useCartStore } from "@/store/cart";
import { useHydrated } from "@/store/useHydrated";
import { AddressForm } from "./AddressForm";
import { CheckoutError } from "./CheckoutError";
import { CheckoutReviewItems } from "./CheckoutReviewItems";
import { CheckoutStep } from "./CheckoutStep";
import { MockPaymentStep } from "./MockPaymentStep";
import { OrderSummary } from "./OrderSummary";
import { PlaceOrderButton } from "./PlaceOrderButton";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  /** Address validation failed; cleared automatically once every flagged field is fixed. */
  | { kind: "invalid" }
  | { kind: "error"; message: string; items?: OrderErrorResponse["items"] };

const INVALID_MESSAGE = "Some required information is missing or incomplete. Please correct the fields highlighted below.";

const FORM_ID = "checkout-form";
const GENERIC_ERROR = "We couldn't place your order. Your cart has been kept - please try again.";

// Client half of /checkout: Amazon's single-page flow (address, payment,
// review) with the order summary and "Place your order" in the right column.
// Nothing touches the cart until the API confirms the order was written.
export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotalCents);
  const clearCart = useCartStore((s) => s.clear);

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [paymentMethodId, setPaymentMethodId] = useState(DEFAULT_PAYMENT_METHOD_ID);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });
  // Bumped on every failed attempt so the error box is re-focused even when
  // the same message is shown twice in a row.
  const [errorNonce, setErrorNonce] = useState(0);
  const errorRef = useRef<HTMLDivElement>(null);

  // A ref, not state: after a successful POST, clearing the store re-renders
  // before a setState in the same continuation would land, and the redirect
  // below would bounce the visitor to /cart instead of the confirmation page.
  const placedRef = useRef(false);

  useEffect(() => {
    if (hydrated && items.length === 0 && !placedRef.current) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  useEffect(() => {
    if (errorNonce > 0) errorRef.current?.focus();
  }, [errorNonce]);

  if (!hydrated || items.length === 0) {
    return <CheckoutSkeleton />;
  }

  const totals = calculateTotals(subtotal);
  const reviewItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    thumbnail: item.thumbnail,
    unitPriceCents: item.priceCents,
    qty: item.qty,
  }));

  const fail = (next: SubmitStatus) => {
    setStatus(next);
    setErrorNonce((n) => n + 1);
  };

  // Editing a flagged field clears its error right away (as on amazon.com);
  // the summary box goes with the last one.
  const handleAddressChange = (next: ShippingAddress) => {
    setAddress(next);
    const changed = (Object.keys(next) as (keyof ShippingAddress)[]).filter((key) => next[key] !== address[key]);
    if (!changed.some((key) => errors[key] !== undefined)) return;

    const remaining: AddressErrors = { ...errors };
    for (const key of changed) delete remaining[key];
    setErrors(remaining);
    if (status.kind === "invalid" && Object.keys(remaining).length === 0) {
      setStatus({ kind: "idle" });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "submitting") return;

    const addressErrors = validateAddress(address);
    setErrors(addressErrors);
    if (Object.keys(addressErrors).length > 0) {
      fail({ kind: "invalid" });
      return;
    }

    setStatus({ kind: "submitting" });
    const payload: CreateOrderRequest = {
      address,
      paymentMethodId,
      items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        const created = (await response.json()) as CreateOrderResponse;
        placedRef.current = true;
        clearCart();
        router.push(`/order/${created.orderId}/confirmation`);
        return;
      }

      const body = await readErrorBody(response);
      fail({ kind: "error", message: body?.error ?? GENERIC_ERROR, items: body?.items });
    } catch {
      fail({ kind: "error", message: GENERIC_ERROR });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px] md:items-start">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium sm:text-[28px]">
          Checkout{" "}
          <span className="text-lg font-normal text-amz-link">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        {status.kind === "invalid" && (
          <CheckoutError ref={errorRef} title="There was a problem">
            <p>{INVALID_MESSAGE}</p>
          </CheckoutError>
        )}

        {status.kind === "error" && (
          <CheckoutError ref={errorRef} title="There was a problem">
            <p>{status.message}</p>
            {status.items && status.items.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {status.items.map((item) => (
                  <li key={item.productId}>
                    {item.name}: only {item.available} available.
                  </li>
                ))}
              </ul>
            )}
            {status.items && (
              <Link href="/cart" className="mt-1 inline-block text-amz-link hover:text-amz-link-hover hover:underline">
                Update quantities in your cart
              </Link>
            )}
          </CheckoutError>
        )}

        <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="rounded-md bg-white px-4 shadow-sm sm:px-6">
          <CheckoutStep number={1} title="Shipping address">
            <AddressForm value={address} errors={errors} onChange={handleAddressChange} />
          </CheckoutStep>

          <CheckoutStep number={2} title="Payment method">
            <MockPaymentStep value={paymentMethodId} onChange={setPaymentMethodId} />
          </CheckoutStep>

          <CheckoutStep number={3} title="Review items and shipping">
            <CheckoutReviewItems items={reviewItems} changeHref="/cart" />
          </CheckoutStep>
        </form>
      </div>

      <aside aria-label="Order summary" className="md:sticky md:top-24">
        <OrderSummary
          totals={totals}
          itemCount={itemCount}
          action={<PlaceOrderButton form={FORM_ID} submitting={status.kind === "submitting"} />}
        />
      </aside>
    </div>
  );
}

/** The API's JSON error body, or null when the response had none (e.g. a gateway error page). */
async function readErrorBody(response: Response): Promise<OrderErrorResponse | null> {
  try {
    return (await response.json()) as OrderErrorResponse;
  } catch {
    return null;
  }
}

function CheckoutSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading checkout" className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-56 rounded bg-neutral-200" />
        <div className="rounded-md bg-white p-6 shadow-sm">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-6 space-y-3">
              <div className="h-5 w-40 rounded bg-neutral-200" />
              <div className="h-9 w-full max-w-xl rounded bg-neutral-100" />
              <div className="h-9 w-full max-w-xl rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-56 rounded-md bg-white shadow-sm" />
    </div>
  );
}
