import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { getOrderById } from "@/lib/orders";

type ConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

// Rendered per request: reads the order just written to Neon.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  return { title: `${order ? "Order placed" : "Order not found"} | Amazon.com clone` };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (order === null) notFound();

  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-[1000px]">
        <OrderConfirmation order={order} />
      </div>
    </main>
  );
}
