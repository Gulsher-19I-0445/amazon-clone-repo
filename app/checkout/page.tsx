import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Amazon.com clone",
};

// The cart lives in localStorage, so this shell is static and the client
// component fills it in after hydration (same pattern as /cart).
export default function CheckoutPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1200px]">
        <CheckoutForm />
      </div>
    </main>
  );
}
