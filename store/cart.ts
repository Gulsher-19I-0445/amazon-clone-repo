import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cart from "@/lib/cart";
import type { NewCartItem } from "@/lib/cart";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (item: NewCartItem, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

// Persisted to localStorage so the cart survives refresh for any anonymous
// visitor. All math lives in lib/cart.ts; this store only holds state.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty) => set((s) => ({ items: cart.addItem(s.items, item, qty) })),
      updateQuantity: (productId, qty) =>
        set((s) => ({ items: cart.updateQuantity(s.items, productId, qty) })),
      removeItem: (productId) => set((s) => ({ items: cart.removeItem(s.items, productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "amazon-clone-cart" },
  ),
);

export const selectItemCount = (s: CartState): number => cart.itemCount(s.items);
export const selectSubtotalCents = (s: CartState): number => cart.subtotalCents(s.items);
