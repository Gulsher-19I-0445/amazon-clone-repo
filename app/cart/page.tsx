import type { Metadata } from "next";
import { CartContents } from "@/components/CartContents";

export const metadata: Metadata = {
  title: "Shopping Cart | Amazon.com clone",
};

// The cart lives in localStorage, so this shell is static and the client
// component fills it in after hydration.
export default function CartPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1500px]">
        <CartContents />
      </div>
    </main>
  );
}
