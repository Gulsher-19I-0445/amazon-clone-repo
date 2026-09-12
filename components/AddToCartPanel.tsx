"use client";

import Link from "next/link";
import { useState } from "react";
import type { NewCartItem } from "@/lib/cart";
import { addableQuantity, quantityOptions } from "@/lib/stock";
import { useCartStore } from "@/store/cart";
import { useHydrated } from "@/store/useHydrated";
import { AddToCartButton } from "./AddToCartButton";
import { QuantitySelector } from "./QuantitySelector";

type AddToCartPanelProps = {
  item: NewCartItem;
};

type AddResult =
  | { kind: "added"; qty: number }
  | { kind: "capped"; added: number; total: number };

// Quantity picker + Add to Cart, aware of what the cart already holds for this
// product so the stock cap is explained rather than silently applied.
export function AddToCartPanel({ item }: AddToCartPanelProps) {
  const hydrated = useHydrated();
  const addItem = useCartStore((s) => s.addItem);
  const storedInCart = useCartStore((s) => s.items.find((line) => line.productId === item.productId)?.qty ?? 0);
  // Treat the cart as empty until the persisted store is available so the
  // server and first client render agree (same pattern as CartIcon).
  const inCart = hydrated ? storedInCart : 0;

  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<AddResult | null>(null);

  const maxReached = inCart >= item.stock;

  const handleAdd = () => {
    const addable = addableQuantity(qty, item.stock, inCart);
    if (addable.qty === 0) return;
    addItem(item, addable.qty);
    setResult(
      addable.capped
        ? { kind: "capped", added: addable.qty, total: inCart + addable.qty }
        : { kind: "added", qty: addable.qty },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <QuantitySelector value={qty} options={quantityOptions(item.stock)} onChange={setQty} />
      <AddToCartButton onClick={handleAdd} disabled={maxReached} />

      {/* The outcome of the last click wins; the "maximum" notice covers arriving with a full cart. */}
      <div aria-live="polite" className="text-sm">
        {result?.kind === "added" ? (
          <p className="text-green-700">
            Added {result.qty === 1 ? "to" : `${result.qty} to`} cart.{" "}
            <Link href="/cart" className="text-amz-link hover:text-amz-link-hover hover:underline">
              View cart
            </Link>
          </p>
        ) : result?.kind === "capped" ? (
          <p className="text-amz-price">
            Only {result.added} could be added. Your cart now has all {result.total} in stock.
          </p>
        ) : maxReached ? (
          <p className="text-amz-price">You already have the maximum quantity ({item.stock}) in your cart.</p>
        ) : null}
      </div>
    </div>
  );
}
