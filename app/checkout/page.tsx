import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout | Amazon.com clone",
};

// Placeholder so the cart's "Proceed to checkout" resolves before F6 builds the real flow.
export default function CheckoutPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1500px] rounded-md bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-medium">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Checkout is being set up. Your items are saved in your{" "}
          <Link href="/cart" className="text-amz-link hover:text-amz-link-hover hover:underline">
            cart
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
