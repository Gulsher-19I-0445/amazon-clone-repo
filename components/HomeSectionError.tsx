import Link from "next/link";

// Shown in place of a homepage section whose database read failed, so the
// rest of the page still renders.
export function HomeSectionError() {
  return (
    <div className="rounded-md bg-white p-6 text-center shadow-sm">
      <p className="text-base font-bold">We couldn&apos;t load this section.</p>
      <p className="mt-1 text-sm text-neutral-700">Please refresh the page, or keep shopping.</p>
      <Link
        href="/s"
        className="mt-3 inline-block rounded-lg bg-amz-yellow px-6 py-2 text-sm font-medium hover:bg-amz-yellow-hover"
      >
        Browse all products
      </Link>
    </div>
  );
}
