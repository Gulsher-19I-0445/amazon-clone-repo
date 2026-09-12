import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ProductGrid";
import { SearchResults } from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "Search results | Amazon.com clone",
};

// Query params are read client-side via useSearchParams inside SearchResults,
// so this page stays static and never touches the database at build time.
export default function SearchPage() {
  return (
    <main className="flex-1 px-4 py-4">
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
