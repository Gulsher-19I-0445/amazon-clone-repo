import type { Metadata } from "next";
import { WishlistContents } from "@/components/WishlistContents";

export const metadata: Metadata = {
  title: "Your Wish List | Amazon.com clone",
};

// The wishlist lives in localStorage, so this shell is static and the client
// component fills it in after hydration (same shape as /cart).
export default function WishlistPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1500px]">
        <WishlistContents />
      </div>
    </main>
  );
}
