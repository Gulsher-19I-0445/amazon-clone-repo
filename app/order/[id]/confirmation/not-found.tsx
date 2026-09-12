import Link from "next/link";

// Shown when /order/[id]/confirmation resolves to no order (mistyped or stale link).
export default function OrderNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-md bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-medium">We couldn&apos;t find that order</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Check the link in your confirmation, or place a new order from your cart.
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <Link
            href="/cart"
            className="inline-block rounded-lg bg-amz-yellow px-6 py-2 text-sm font-medium hover:bg-amz-yellow-hover"
          >
            Go to your cart
          </Link>
          <Link href="/" className="text-sm text-amz-link hover:text-amz-link-hover hover:underline">
            Go to the home page
          </Link>
        </div>
      </div>
    </main>
  );
}
