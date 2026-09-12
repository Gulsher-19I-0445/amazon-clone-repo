import Link from "next/link";

// Shown once the persisted cart has loaded and holds nothing.
export function EmptyCart() {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <svg
        width="140"
        height="110"
        viewBox="0 0 140 110"
        aria-hidden="true"
        className="shrink-0 self-center text-neutral-300"
      >
        <path
          d="M8 10h18l6 20h94l-14 44a7 7 0 0 1-6.7 5H46l2 8h70v9H41a7 7 0 0 1-6.7-5L15 19H8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="52" cy="101" r="7" fill="currentColor" />
        <circle cx="106" cy="101" r="7" fill="currentColor" />
      </svg>

      <div>
        <h1 className="text-2xl font-medium">Your Amazon Cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Browse{" "}
          <Link href="/s" className="text-amz-link hover:text-amz-link-hover hover:underline">
            all products
          </Link>{" "}
          to find something you like. Items you add stay in your cart on this device.
        </p>
        <Link
          href="/s?deals=true"
          className="mt-4 inline-block rounded-full bg-amz-yellow px-6 py-2 text-sm shadow-sm hover:bg-amz-yellow-hover"
        >
          Shop today&apos;s deals
        </Link>
      </div>
    </div>
  );
}
