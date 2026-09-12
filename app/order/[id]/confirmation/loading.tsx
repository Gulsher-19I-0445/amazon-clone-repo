import { OrderConfirmationSkeleton } from "@/components/OrderConfirmation";

// Shown right after "Place your order" while page.tsx reads the order back.
export default function ConfirmationLoading() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1000px]">
        <OrderConfirmationSkeleton />
      </div>
    </main>
  );
}
