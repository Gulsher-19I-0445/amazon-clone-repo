import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as wishlist from "@/lib/wishlist";
import type { ProductListItem, WishlistItem } from "@/lib/types";

type WishlistState = {
  items: WishlistItem[];
  toggle: (product: ProductListItem) => void;
  remove: (productId: string) => void;
};

// Persisted to localStorage like the cart: a private list on this device for
// any anonymous visitor. All rules live in lib/wishlist.ts.
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) =>
        set((s) => ({ items: wishlist.toggleItem(s.items, wishlist.toWishlistItem(product)) })),
      remove: (productId) => set((s) => ({ items: wishlist.removeItem(s.items, productId) })),
    }),
    { name: "amazon-clone-wishlist" },
  ),
);

export const selectWishlistCount = (s: WishlistState): number => s.items.length;
