import Link from "next/link";

// Shown once the persisted wishlist has loaded and holds nothing.
export function EmptyWishlist() {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <svg
        width="120"
        height="110"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="shrink-0 self-center text-neutral-300"
      >
        <path
          d="M12 21s-7.5-4.7-9.6-9.3C.9 8.3 2.8 4.5 6.4 4.5c2 0 3.6 1.1 4.6 2.7 1-1.6 2.6-2.7 4.6-2.7 3.6 0 5.5 3.8 4 7.2C19.5 16.3 12 21 12 21z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>

      <div>
        <h1 className="text-2xl font-medium">Your Wish List is empty</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Tap the heart on any product to save it here. Your list stays on this device — no account
          needed.
        </p>
        <Link
          href="/s"
          className="mt-4 inline-block rounded-full bg-amz-yellow px-6 py-2 text-sm shadow-sm hover:bg-amz-yellow-hover"
        >
          Browse all products
        </Link>
      </div>
    </div>
  );
}
