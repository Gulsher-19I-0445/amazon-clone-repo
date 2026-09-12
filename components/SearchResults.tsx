"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categoryLabel } from "@/lib/categories";
import { filterProducts } from "@/lib/search";
import type { ProductListItem, ProductListResponse } from "@/lib/types";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; products: ProductListItem[] };

export function SearchResults() {
  const params = useSearchParams();
  const query = params.get("k") ?? "";
  const category = params.get("category") ?? "";

  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as ProductListResponse;
      setState({ status: "ready", products: body.products });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  // The full catalog is fetched once; filtering by query/category is client-side.
  useEffect(() => {
    void load();
  }, [load]);

  const results = useMemo(
    () => (state.status === "ready" ? filterProducts(state.products, { query, category }) : []),
    [state, query, category],
  );

  if (state.status === "loading") {
    return <ProductGridSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="rounded-md bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-bold">Something went wrong loading products.</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg bg-amz-yellow px-6 py-2 text-sm font-medium hover:bg-amz-yellow-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  const scope = category ? ` in ${categoryLabel(category)}` : "";

  if (results.length === 0) {
    return (
      <div className="rounded-md bg-white p-8 shadow-sm">
        <p className="text-lg">
          No results for <span className="font-bold text-amz-price">“{query || categoryLabel(category)}”</span>
          {query && category ? scope : ""}.
        </p>
        <p className="mt-2 text-sm text-neutral-700">
          Try checking your spelling or use more general terms.
        </p>
        <Link href="/s" className="mt-4 inline-block text-sm text-amz-link hover:text-amz-link-hover hover:underline">
          See all products
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-neutral-700">
        {results.length.toLocaleString("en-US")} {results.length === 1 ? "result" : "results"}
        {query ? (
          <>
            {" "}
            for <span className="font-bold text-amz-price">“{query}”</span>
          </>
        ) : null}
        {scope}
      </p>
      <ProductGrid products={results} />
    </>
  );
}
