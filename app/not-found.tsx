import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-md bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-medium">Looking for something?</h1>
        <p className="mt-2 text-sm text-neutral-700">
          We&apos;re sorry. The page you requested could not be found.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-amz-yellow px-6 py-2 text-sm font-medium hover:bg-amz-yellow-hover"
        >
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
