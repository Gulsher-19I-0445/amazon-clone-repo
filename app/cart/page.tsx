import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shopping Cart | Amazon.com clone",
};

// Placeholder so the header's cart link resolves before F5 builds the real cart.
export default function CartPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="rounded-md bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-medium">Your Amazon Cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-700">
          <Link href="/s" className="text-amz-link hover:text-amz-link-hover hover:underline">
            Continue shopping
          </Link>{" "}
          to find something you like.
        </p>
      </div>
    </main>
  );
}
